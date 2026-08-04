import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

/* A small visual editor over contentEditable, with a raw-HTML tab alongside.
 *
 * It leans on document.execCommand. That API is formally deprecated, but every
 * current browser still implements it and it is the only way to get rich-text
 * editing without pulling in a framework such as TipTap or Quill. Swapping the
 * internals later only touches this file — the outside contract is just
 * `value` (an HTML string) and `onChange`.
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

const BLOCKS = [
  { tag: 'p',          label: 'Paragraph' },
  { tag: 'h2',         label: 'Heading 2' },
  { tag: 'h3',         label: 'Heading 3' },
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
    if (value !== emitted.current || value !== box.innerHTML) {
      if (value !== box.innerHTML) box.innerHTML = value || '';
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
    emitted.current = box.innerHTML;
    onChange(box.innerHTML);
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

  /* Lets the page drop markup (an <img> from the media library) at the caret
     without reaching into this component's DOM itself. */
  useImperativeHandle(ref, () => ({
    insertHtml(html) {
      if (mode === 'visual') {
        const box = boxRef.current;
        if (!box) return;
        box.focus();
        // With no prior caret in the box, execCommand would no-op — put the
        // caret at the end first so the image still lands somewhere sensible.
        const sel = window.getSelection();
        if (!sel || !box.contains(sel.anchorNode)) {
          const range = document.createRange();
          range.selectNodeContents(box);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
        document.execCommand('insertHTML', false, html);
        emit();
      } else {
        const box = htmlRef.current;
        const at  = box ? box.selectionStart : (value || '').length;
        const next = (value || '').slice(0, at) + html + (value || '').slice(at);
        emitted.current = next;
        onChange(next);
      }
    },
  }), [mode, value, onChange, emit]);

  function run(cmd, arg = null) {
    boxRef.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
    refreshActive();
  }

  function applyBlock(tag) {
    // formatBlock wants <tag> in older engines and tolerates it everywhere.
    run('formatBlock', `<${tag}>`);
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

  /* Paste as plain text — otherwise Word and Google Docs bring a wall of
     inline styles and <span> soup into the saved markup. */
  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
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
