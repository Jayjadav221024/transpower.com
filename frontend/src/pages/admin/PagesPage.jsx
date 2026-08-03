import { useState, useEffect } from 'react';
import { adminApi, publicApi } from '../../api/client';

// Generate a deterministic and clean tag-based unique selector path
function getUniqueSelector(el) {
  if (el.id) return `#${el.id}`;
  const parts = [];
  let current = el;
  while (current && current.nodeType === 1) {
    let tagName = current.nodeName.toLowerCase();
    let sibling = current;
    let index = 1;
    while (sibling = sibling.previousElementSibling) {
      if (sibling.nodeName === current.nodeName) {
        index++;
      }
    }
    parts.unshift(`${tagName}:nth-of-type(${index})`);
    current = current.parentNode;
  }
  return parts.join(' > ');
}

const getFullImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/assets/')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || '';
  return `${apiBase}${path}`;
};

export default function PagesPage() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'form'
  const [visualMode, setVisualMode] = useState('edit'); // 'edit' (intercept clicks) or 'browse' (allow navigation)
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // content contains { accentColor, overrides: { [selector]: value } }
  const [content, setContent] = useState({ accentColor: '#d9653b', overrides: {} });
  
  const [feedback, setFeedback] = useState(null); // { ok, text }
  const [activeSelector, setActiveSelector] = useState(null); // CSS selector of active editing element
  const [activeFieldType, setActiveFieldType] = useState('text'); // 'text' or 'image'
  const [activeValue, setActiveValue] = useState('');
  
  const [iframeKey, setIframeKey] = useState(0); // force refresh iframe
  const [mediaList, setMediaList] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, [activeTab]);

  useEffect(() => {
    adminApi.listMedia()
      .then(({ media: list }) => setMediaList(list))
      .catch(() => {});
  }, []);

  async function fetchPageContent() {
    setLoading(true);
    setFeedback(null);
    setActiveSelector(null);
    setActiveValue('');
    try {
      const res = await publicApi.getPageContent(activeTab);
      const pageData = res.content || {};
      
      if (!pageData.accentColor) pageData.accentColor = '#d9653b';
      if (!pageData.overrides) pageData.overrides = {};
      
      setContent(pageData);
      setIframeKey(prev => prev + 1);
    } catch (err) {
      setFeedback({ ok: false, text: err.message || 'Error loading page content.' });
    } finally {
      setLoading(false);
    }
  }

  // Inject script to track visual edits inside iframe
  const handleIframeLoad = () => {
    const iframe = document.getElementById('preview-iframe');
    if (!iframe) return;
    try {
      const iframeWindow = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument || iframeWindow.document;

      // Inject custom overlay indicator stylesheet
      const style = iframeDoc.createElement('style');
      style.innerHTML = `
        .cms-hover-highlight:hover {
          outline: 2px dashed ${content?.accentColor || '#d9653b'} !important;
          outline-offset: 2px !important;
          cursor: pointer !important;
        }
        .cms-selected-edit {
          outline: 2px solid ${content?.accentColor || '#d9653b'} !important;
          outline-offset: 2px !important;
          background: rgba(217, 101, 59, 0.04) !important;
        }
      `;
      iframeDoc.head.appendChild(style);

      // Fetch dynamic overrides from the current editor state and apply them to the iframe DOM
      if (content.overrides) {
        Object.entries(content.overrides).forEach(([sel, val]) => {
          try {
            const els = iframeDoc.querySelectorAll(sel);
            els.forEach(el => {
              if (el.tagName === 'IMG') {
                el.src = val;
              } else {
                el.innerText = val;
              }
            });
          } catch (e) {}
        });
      }

      // Add mouseover indicator
      iframeDoc.body.addEventListener('mouseover', (e) => {
        if (visualMode !== 'edit') return;
        
        // Find closest editable block (text containers or images)
        const el = e.target;
        if (el && el !== iframeDoc.body && el !== iframeDoc.documentElement) {
          el.classList.add('cms-hover-highlight');
        }
      });

      iframeDoc.body.addEventListener('mouseout', (e) => {
        const el = e.target;
        if (el) {
          el.classList.remove('cms-hover-highlight');
        }
      });

      // Handle click events inside iframe
      iframeDoc.body.addEventListener('click', (e) => {
        if (visualMode !== 'edit') return; // Allow normal browsing / navigation

        // Find clicked target element
        const target = e.target;
        if (target && target !== iframeDoc.body && target !== iframeDoc.documentElement) {
          e.preventDefault();
          e.stopPropagation();

          // Clear previous selections
          iframeDoc.querySelectorAll('.cms-selected-edit').forEach(el => el.classList.remove('cms-selected-edit'));
          // Highlight current selection
          target.classList.add('cms-selected-edit');

          // Compute unique selector path
          const editKey = target.getAttribute('data-edit-key');
          const selector = editKey ? `[data-edit-key="${editKey}"]` : getUniqueSelector(target);
          setActiveSelector(selector);

          if (target.tagName === 'IMG') {
            setActiveFieldType('image');
            setActiveValue(target.src);
          } else {
            setActiveFieldType('text');
            setActiveValue(target.innerText || target.textContent);

            // Enable inline editing directly on the page!
            target.contentEditable = 'true';
            target.focus();

            // Intercept inline text typing changes
            target.oninput = () => {
              const textVal = target.innerText;
              setActiveValue(textVal);
              
              // Instantly update parent component overrides dictionary
              setContent(prev => {
                const newOverrides = { ...prev.overrides, [selector]: textVal };
                return { ...prev, overrides: newOverrides };
              });
            };
          }
        }
      }, true); // Use capture phase

    } catch (err) {
      console.warn('Iframe DOM access restricted (cross-origin or load state):', err);
    }
  };

  const handleFieldChange = (selector, value) => {
    setActiveValue(value);
    
    // Update state dictionary
    setContent(prev => {
      const newOverrides = { ...prev.overrides, [selector]: value };
      return { ...prev, overrides: newOverrides };
    });

    // Update iframe view dynamically
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const el = iframeDoc.querySelector(selector);
        if (el) {
          if (el.tagName === 'IMG') {
            el.src = getFullImageUrl(value);
          } else {
            el.innerText = value;
          }
        }
      } catch (err) {}
    }
  };

  const handleAccentColorChange = (hex) => {
    setContent(prev => ({ ...prev, accentColor: hex }));

    // Apply inside iframe instantly
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.documentElement.style.setProperty('--accent-orange', hex);
      } catch (e) {}
    }
  };

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.updatePageContent(activeTab, content);
      
      // Update global document variable
      if (content.accentColor) {
        document.documentElement.style.setProperty('--accent-orange', content.accentColor);
      }
      
      setFeedback({ ok: true, text: 'Whole page edits successfully saved and published!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ ok: false, text: err.message || 'Error saving page content.' });
    } finally {
      setSaving(false);
    }
  }

  const handleImageUpload = async (e) => {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploadingImage(true);
    try {
      const { media: uploaded } = await adminApi.uploadMedia(files);
      if (uploaded && uploaded[0]) {
        const newUrl = uploaded[0].url;
        setMediaList(prev => [uploaded[0], ...prev]);
        handleFieldChange(activeSelector, newUrl);
      }
    } catch (err) {
      setFeedback({ ok: false, text: err.message || 'Error uploading image.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const PRESET_COLORS = [
    { name: 'Safety Orange', hex: '#d9653b' },
    { name: 'Deep Amber', hex: '#b24a21' },
    { name: 'Steel Teal/Cyan', hex: '#14607a' },
    { name: 'Forest Green', hex: '#0f9d68' },
    { name: 'Electric Blue', hex: '#2563eb' },
    { name: 'Crimson Red', hex: '#d0342c' }
  ];

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>WYSIWYG Whole-Website Customizer</h1>
          <p className="muted">Click on literally any section text, paragraph, badge, or image inside the live website to edit it.</p>
        </div>
      </header>

      {/* Control bar */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Active Page Drawer selection */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button 
              type="button" 
              className={`btn ${activeTab === 'homepage' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('homepage')}
            >
              🏠 Edit Homepage
            </button>
            <button 
              type="button" 
              className={`btn ${activeTab === 'aboutpage' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('aboutpage')}
            >
              ℹ️ Edit About Us
            </button>
            <button 
              type="button" 
              className={`btn ${activeTab === 'blogpage' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('blogpage')}
            >
              📰 Edit Blog Page
            </button>
            <button 
              type="button" 
              className={`btn ${activeTab.startsWith('productpage_') ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('productpage_cable-trays')}
            >
              🛍️ Edit Product Pages
            </button>
          </div>

          {activeTab.startsWith('productpage_') && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, alignSelf: 'center', color: '#64748b', marginRight: '0.5rem' }}>Select Product to Edit:</span>
              <button 
                type="button" 
                className={`btn btn-xs ${activeTab === 'productpage_cable-trays' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setActiveTab('productpage_cable-trays')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', height: 'auto', minHeight: 0 }}
              >
                Cable Trays
              </button>
              <button 
                type="button" 
                className={`btn btn-xs ${activeTab === 'productpage_gear-boxes' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setActiveTab('productpage_gear-boxes')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', height: 'auto', minHeight: 0 }}
              >
                Gear Boxes
              </button>
              <button 
                type="button" 
                className={`btn btn-xs ${activeTab === 'productpage_switchgears' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setActiveTab('productpage_switchgears')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', height: 'auto', minHeight: 0 }}
              >
                Switchgears
              </button>
              <button 
                type="button" 
                className={`btn btn-xs ${activeTab === 'productpage_molded-gratings' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setActiveTab('productpage_molded-gratings')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', height: 'auto', minHeight: 0 }}
              >
                Molded Gratings
              </button>
              <button 
                type="button" 
                className={`btn btn-xs ${activeTab === 'productpage_pultruded-profiles' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setActiveTab('productpage_pultruded-profiles')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', height: 'auto', minHeight: 0 }}
              >
                Pultruded Profiles
              </button>
            </div>
          )}

          {/* Editor Mode Control */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#eef2f7', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${editorMode === 'visual' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}
              onClick={() => setEditorMode('visual')}
            >
              ✨ Visual Click-to-Edit Mode
            </button>
            <button
              type="button"
              className={`btn btn-sm ${editorMode === 'form' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}
              onClick={() => setEditorMode('form')}
            >
              📋 Standard JSON Form
            </button>
          </div>
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading page content from database...</p>}

      {!loading && content && (
        <>
          {editorMode === 'form' ? (
            /* Traditional JSON Editor fallback */
            <form onSubmit={handleSave} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2>Raw Overrides & Colors for {activeTab}</h2>
              
              {feedback && (
                <div className={`alert ${feedback.ok ? 'alert-success' : 'alert-error'}`}>
                  {feedback.text}
                </div>
              )}

              <label className="field">
                <span>Theme Accent Color</span>
                <input 
                  type="color" 
                  value={content.accentColor || '#d9653b'} 
                  onChange={(e) => handleAccentColorChange(e.target.value)}
                  style={{ width: '45px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', display: 'block', marginTop: '0.5rem' }}
                />
              </label>

              <label className="field">
                <span>Active CSS Override Selector Tree (JSON)</span>
                <textarea 
                  className="input input-editor"
                  rows={15}
                  value={JSON.stringify(content.overrides || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setContent(prev => ({ ...prev, overrides: parsed }));
                    } catch (err) {}
                  }}
                />
              </label>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Publishing...' : '💾 Save Page Changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={fetchPageContent}>
                  Reset
                </button>
              </div>
            </form>
          ) : (
            /* Premium visual inline CMS editor */
            <div className="visual-editor-container" style={{ display: 'grid', gridTemplateColumns: '3.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* Iframe Viewport */}
              <div className="mock-viewport" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                {/* Browser Header Bar */}
                <div style={{ background: '#eef2f7', borderBottom: '1px solid var(--border)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
                  </div>

                  {/* Mode controls for clicking items vs link navigation */}
                  <div style={{ display: 'flex', gap: '0.3rem', background: '#fff', border: '1px solid var(--border)', padding: '0.2rem', borderRadius: '6px' }}>
                    <button
                      type="button"
                      className={`btn btn-sm`}
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.68rem',
                        background: visualMode === 'edit' ? (content.accentColor || '#d9653b') : 'transparent',
                        color: visualMode === 'edit' ? '#fff' : 'var(--muted)',
                        borderRadius: '4px'
                      }}
                      onClick={() => setVisualMode('edit')}
                    >
                      ✏️ Edit Element Mode
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm`}
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.68rem',
                        background: visualMode === 'browse' ? (content.accentColor || '#d9653b') : 'transparent',
                        color: visualMode === 'browse' ? '#fff' : 'var(--muted)',
                        borderRadius: '4px'
                      }}
                      onClick={() => setVisualMode('browse')}
                    >
                      🔗 Browse Link Mode
                    </button>
                  </div>

                  <div style={{ background: '#fff', borderRadius: '6px', padding: '0.2rem 1rem', fontSize: '0.72rem', color: '#6b7280', border: '1px solid var(--border)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>localhost:5173{activeTab === 'homepage' ? '/' : activeTab === 'aboutpage' ? '/about' : activeTab.startsWith('productpage_') ? `/product/${activeTab.replace('productpage_', '')}` : '/blog'}</span>
                  </div>
                </div>

                {/* Live Website Frame */}
                <div style={{ position: 'relative', width: '100%', height: '700px', background: '#fff' }}>
                  <iframe
                    key={`${activeTab}-${iframeKey}`}
                    id="preview-iframe"
                    src={activeTab === 'homepage' ? '/' : activeTab === 'aboutpage' ? '/about' : activeTab.startsWith('productpage_') ? `/product/${activeTab.replace('productpage_', '')}` : '/blog'}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    onLoad={handleIframeLoad}
                  />
                  {visualMode === 'edit' && (
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(14,26,43,0.92)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, pointerEvents: 'none', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      ✏️ EDIT MODE ACTIVE — Click on any text directly to type, or click images to replace them!
                    </div>
                  )}
                  {visualMode === 'browse' && (
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(15,157,104,0.92)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, pointerEvents: 'none', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      🔗 BROWSE MODE ACTIVE — Clicks will follow links normally to navigate the website pages.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Live customizer */}
              <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'stretch', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    🎨 Live Customizer
                  </h2>
                  <p className="muted" style={{ marginBottom: '1.25rem' }}>
                    Switch to **Edit Element Mode**, click any text block or image on the page, and start customising.
                  </p>

                  {feedback && (
                    <div className={`alert ${feedback.ok ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.25rem' }}>
                      {feedback.text}
                    </div>
                  )}

                  {/* Brand Accent Color Customizer (Always visible at top of sidebar) */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.8rem' }}>
                      Brand Accent Color Theme
                    </span>
                    
                    {/* Preset Swatches */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.name}
                          onClick={() => handleAccentColorChange(c.hex)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: c.hex,
                            border: content.accentColor === c.hex ? '3px solid #000' : '1px solid rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        />
                      ))}
                    </div>

                    {/* Manual Hex Input */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={content.accentColor || '#d9653b'} 
                        onChange={(e) => handleAccentColorChange(e.target.value)} 
                        style={{ width: '36px', height: '32px', padding: 0, border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        className="input" 
                        value={content.accentColor || '#d9653b'} 
                        onChange={(e) => handleAccentColorChange(e.target.value)}
                        style={{ maxWidth: '100px', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                        placeholder="#hex"
                      />
                    </div>
                  </div>

                  <div className="gsp-divider" style={{ margin: '1rem 0' }} />

                  {/* Active Element Properties */}
                  {activeSelector ? (
                    <div style={{ animation: 'modalEnter 0.2s ease-out' }}>
                      <h3 style={{ color: content.accentColor || '#d9653b', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem' }}>
                        Selected Element
                      </h3>

                      <code style={{ display: 'block', fontSize: '0.68rem', padding: '0.5rem', background: '#f1f5f9', color: '#64748b', borderRadius: '4px', wordBreak: 'break-all', marginBottom: '1.25rem' }}>
                        {activeSelector}
                      </code>

                      {activeFieldType === 'image' ? (
                        /* Image editor panel */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
                            Choose / Replace Image
                          </span>
                          
                          {/* Image preview */}
                          <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', padding: '0.5rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.62rem', display: 'block', color: 'var(--muted)', marginBottom: '0.3rem' }}>Current Selection Preview:</span>
                            {activeValue ? (
                              <img src={getFullImageUrl(activeValue)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '4px' }} />
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--faint)' }}>No image</span>
                            )}
                          </div>

                          {/* Upload */}
                          <label className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', textAlign: 'center' }}>
                            {uploadingImage ? 'Uploading...' : '📤 Upload Replace Image'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                          </label>

                          {/* Image path URL input */}
                          <label className="field" style={{ margin: 0 }}>
                            <span style={{ fontSize: '0.65rem' }}>Image URL / Path</span>
                            <input 
                              type="text" 
                              className="input"
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                              value={activeValue || ''}
                              onChange={(e) => handleFieldChange(activeSelector, e.target.value)}
                              required
                            />
                          </label>

                          {/* Media library picker */}
                          <div>
                            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                              Choose from Media Library
                            </span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '6px' }}>
                              {mediaList.map((m) => (
                                <div 
                                  key={m.id} 
                                  onClick={() => handleFieldChange(activeSelector, m.url)}
                                  style={{
                                    aspectRatio: '1',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: activeValue === m.url ? `2.5px solid ${content.accentColor || '#d9653b'}` : '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <img src={getFullImageUrl(m.url)} alt={m.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Text editor panel */
                        <label className="field">
                          <span>Modify Text Content</span>
                          <textarea 
                            className="input"
                            rows={8}
                            value={activeValue || ''}
                            onChange={(e) => handleFieldChange(activeSelector, e.target.value)}
                            placeholder="Type to edit text..."
                            required
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed var(--border)', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      💡 Click on any text block or image inside the browser viewport on the left to start editing.
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving and Publishing...' : '💾 Publish Website Changes'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={fetchPageContent}>
                    Discard Edits
                  </button>
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </section>
  );
}
