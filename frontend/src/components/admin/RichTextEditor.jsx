import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { escapeHtml, toDisplayHtml, toStoredHtml } from '../../utils/contentHtml';

/* A small visual editor over contentEditable, with a raw-HTML tab alongside.
 *
 * It leans on document.execCommand. That API is formally deprecated, but every
 * current browser still implements it and it is the only way to get rich-text
 * editing without pulling in a framework such as TipTap or Quill. Swapping the
 * internals later only touches this file — the outside contract is just
 * `value` (an HTML string) and `onChange`.
 *
 * `value` is the *stored* markup, with upload paths left root-relative. The
 * editable box needs them absolute to actually load the images, so everything
 * crossing the boundary goes through toDisplayHtml / toStoredHtml.
 */

/* Commands that toggle on and off, so the button can show a pressed state.
   Each carries a name next to its mark — you can tell what a button does
   without hovering and waiting for a tooltip. */
const INLINE = [
  { cmd: 'bold',          mark: 'B', label: 'Bold',      title: 'Bold (Ctrl+B)',      style: { fontWeight: 700 } },
  { cmd: 'italic',        mark: 'I', label: 'Italic',    title: 'Italic (Ctrl+I)',    style: { fontStyle: 'italic' } },
  { cmd: 'underline',     mark: 'U', label: 'Underline', title: 'Underline (Ctrl+U)', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', mark: 'S', label: 'Strike',    title: 'Strikethrough',      style: { textDecoration: 'line-through' } },
];

const LISTS = [
  { cmd: 'insertUnorderedList', mark: '•',  label: 'Bullet List', title: 'Bulleted list' },
  { cmd: 'insertOrderedList',   mark: '1.', label: 'Number List', title: 'Numbered list' },
];

/* The full heading range. H1 is offered even though the article title already
   renders as the page's h1 — imported posts use it inside the body and editing
   one should not silently rewrite the tag. */
const BLOCKS = [
  { tag: 'p',          label: 'Paragraph' },
  { tag: 'h1',         label: 'Heading 1' },
  { tag: 'h2',         label: 'Heading 2' },
  { tag: 'h3',         label: 'Heading 3' },
  { tag: 'h4',         label: 'Heading 4' },
  { tag: 'h5',         label: 'Heading 5' },
  { tag: 'h6',         label: 'Heading 6' },
  { tag: 'blockquote', label: 'Quote' },
];

const RichTextEditor = forwardRef(function RichTextEditor(
  { value, onChange, onRequestImage },
  ref
) {
  const boxRef  = useRef(null);
  const htmlRef = useRef(null);
  const [mode, setMode]     = useState('visual');   // 'visual' | 'html'
  const [active, setActive] = useState({});         // which inline commands apply at the caret

  /* Last HTML this component emitted. Used to tell an outside change (load a
     post, edit in the HTML tab) apart from the echo of our own typing — writing
     innerHTML on every render would drop the caret to the start on each key. */
  const emitted = useRef(value);

  useEffect(() => {
    const box = boxRef.current;
    if (mode !== 'visual' || !box) return;
    const display = toDisplayHtml(value);
    if (value !== emitted.current || display !== box.innerHTML) {
      if (display !== box.innerHTML) box.innerHTML = display;
      emitted.current = value;
    }
  }, [value, mode]);

  /* Enter should open a new <p>, not a bare <div>, so saved markup matches the
     tags the public blog styles. */
  useEffect(() => {
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch { /* not supported */ }
  }, []);

  const emit = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const stored = toStoredHtml(box.innerHTML);
    emitted.current = stored;
    onChange(stored);
  }, [onChange]);

  const refreshActive = useCallback(() => {
    if (mode !== 'visual') return;
    const next = {};
    for (const { cmd } of [...INLINE, ...LISTS]) {
      try { next[cmd] = document.queryCommandState(cmd); } catch { next[cmd] = false; }
    }
    setActive(next);
  }, [mode]);

  /* Selection lives on the document, so track it there rather than on the box. */
  useEffect(() => {
    document.addEventListener('selectionchange', refreshActive);
    return () => document.removeEventListener('selectionchange', refreshActive);
  }, [refreshActive]);

  /* Puts the caret in the box, at the end when it has never been there — with
     no selection inside it every execCommand below would silently no-op. */
  const focusBox = useCallback(() => {
    const box = boxRef.current;
    if (!box) return null;
    box.focus();
    const sel = window.getSelection();
    if (!sel || !box.contains(sel.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(box);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    return box;
  }, []);

  /* Lets the page drop markup (an <img> from the media library) at the caret
     without reaching into this component's DOM itself. */
  useImperativeHandle(ref, () => ({
    insertHtml(html) {
      if (mode === 'visual') {
        if (!focusBox()) return;
        // Display form, or the freshly inserted image shows as a broken icon
        // until the post is reloaded. emit() converts it back for saving.
        document.execCommand('insertHTML', false, toDisplayHtml(html));
        emit();
      } else {
        const box = htmlRef.current;
        const at  = box ? box.selectionStart : (value || '').length;
        const next = (value || '').slice(0, at) + html + (value || '').slice(at);
        emitted.current = next;
        onChange(next);
      }
    },
  }), [mode, value, onChange, emit, focusBox]);

  function run(cmd, arg = null) {
    focusBox();
    document.execCommand(cmd, false, arg);
    emit();
    refreshActive();
  }

  function applyBlock(tag) {
    // formatBlock wants <tag> in older engines and tolerates it everywhere.
    run('formatBlock', `<${tag}>`);
  }

  /* A line break inside a paragraph, as opposed to Enter's new paragraph.
     execCommand('insertLineBreak') is the good path — Chrome keeps the trailing
     placeholder <br> that holds the new line open, and it lands on the undo
     stack. Firefox has no such command, so fall back to placing the <br> by
     hand, adding the placeholder ourselves when the break ends its block (a
     lone trailing <br> renders as nothing, which is exactly the "br does not
     work" symptom). */
  function lineBreak() {
    if (!focusBox()) return;

    let handled = false;
    try { handled = document.execCommand('insertLineBreak'); } catch { handled = false; }

    if (!handled) {
      const sel = window.getSelection();
      if (sel?.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const br = document.createElement('br');
        range.insertNode(br);
        if (!br.nextSibling) br.parentNode?.appendChild(document.createElement('br'));
        const after = document.createRange();
        after.setStartAfter(br);
        after.collapse(true);
        sel.removeAllRanges();
        sel.addRange(after);
      }
    }
    emit();
  }

  function addLink() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      window.alert('Select the text you want to turn into a link first.');
      return;
    }
    const url = window.prompt('Link URL', 'https://');
    if (!url || url === 'https://') return;
    run('createLink', url);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      lineBreak();
    }
  }

  /* Paste as plain text — otherwise Word and Google Docs bring a wall of
     inline styles and <span> soup into the saved markup. Newlines have to be
     turned into real markup on the way in: insertText keeps them as literal
     characters, which HTML collapses to spaces, so a multi-line paste used to
     land as one run-on line. Blank-line gaps become paragraphs, single
     newlines become <br>. */
  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    if (!/[\r\n]/.test(text)) {
      // Single line — insertText so pasting mid-sentence stays in that sentence.
      document.execCommand('insertText', false, text);
    } else {
      const html = text
        .replace(/\r\n?/g, '\n')
        .split(/\n{2,}/)
        .filter((block) => block.trim())
        .map((block) => `<p>${block.split('\n').map(escapeHtml).join('<br>')}</p>`)
        .join('');
      document.execCommand('insertHTML', false, html);
    }
    emit();
  }

  /* `isActive` is undefined for one-shot buttons (link, image, clear) — those
     have no on/off state, so they get no aria-pressed at all. */
  const btn = (key, label, title, onClick, isActive) => (
    <button
      key={key} type="button" title={title}
      aria-pressed={isActive === undefined ? undefined : String(Boolean(isActive))}
      className={`rte-btn${isActive ? ' active' : ''}`}
      // Keep focus (and the selection) in the editable box when clicking.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="rte">
      <div className="rte-bar">
        {mode === 'visual' && (
          <>
            {INLINE.map(({ cmd, mark, label, title, style }) =>
              btn(
                cmd,
                <><span className="rte-mark" style={style}>{mark}</span>{label}</>,
                title, () => run(cmd), active[cmd]
              ))}

            <span className="rte-sep" />

            <select
              className="rte-select" title="Paragraph style"
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => { applyBlock(e.target.value); e.target.selectedIndex = 0; }}
              defaultValue=""
            >
              <option value="" disabled>Format</option>
              {BLOCKS.map(({ tag, label }) => <option key={tag} value={tag}>{label}</option>)}
            </select>

            <span className="rte-sep" />

            {LISTS.map(({ cmd, mark, label, title }) =>
              btn(
                cmd,
                <><span className="rte-mark">{mark}</span>{label}</>,
                title, () => run(cmd), active[cmd]
              ))}

            <span className="rte-sep" />

            {btn('link',   <><span className="rte-mark">🔗</span>Link</>,   'Turn the selected text into a link', addLink)}
            {btn('unlink', <><span className="rte-mark">⛓</span>Unlink</>,  'Remove the link',                    () => run('unlink'))}
            {btn('break',  <><span className="rte-mark">↵</span>Break</>,   'Insert a line break (Shift+Enter)',  lineBreak)}
            {btn('image',  <><span className="rte-mark">🖼</span>Image</>,  'Insert an image from the library',   () => onRequestImage?.())}
            {btn('clear',  <><span className="rte-mark">⌫</span>Clear</>,  'Strip formatting from the selection', () => run('removeFormat'))}
          </>
        )}

        <div className="rte-tabs">
          <button
            type="button" className={`rte-tab${mode === 'visual' ? ' active' : ''}`}
            onClick={() => setMode('visual')}
          >
            Visual
          </button>
          <button
            type="button" className={`rte-tab${mode === 'html' ? ' active' : ''}`}
            onClick={() => setMode('html')}
          >
            HTML
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        <div
          ref={boxRef}
          className="rte-box"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
          onInput={emit}
          onBlur={emit}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
        />
      ) : (
        <textarea
          ref={htmlRef}
          className="input input-editor rte-html"
          rows="20"
          value={value}
          onChange={(e) => { emitted.current = e.target.value; onChange(e.target.value); }}
          spellCheck="false"
        />
      )}
    </div>
  );
});

export default RichTextEditor;
