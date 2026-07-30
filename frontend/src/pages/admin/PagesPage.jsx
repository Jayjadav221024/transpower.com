import { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';

export default function PagesPage() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(null);
  const [feedback, setFeedback] = useState(null); // { ok, text }

  useEffect(() => {
    fetchPageContent();
  }, [activeTab]);

  async function fetchPageContent() {
    setLoading(true);
    setFeedback(null);
    try {
      // Use the public API get method (routed appropriately)
      const res = await fetch(`/api/pages/${activeTab}`).then(r => r.json());
      setContent(res.content || {});
    } catch (err) {
      setFeedback({ ok: false, text: err.message || 'Error loading page content.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.updatePageContent(activeTab, content);
      setFeedback({ ok: true, text: 'Page content successfully updated!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ ok: false, text: err.message || 'Error saving page content.' });
    } finally {
      setSaving(false);
    }
  }

  const handleFieldChange = (key, value) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayChange = (key, index, value) => {
    setContent(prev => {
      const updatedArr = [...(prev[key] || [])];
      updatedArr[index] = value;
      return {
        ...prev,
        [key]: updatedArr
      };
    });
  };

  const addArrayItem = (key, defaultValue = '') => {
    setContent(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), defaultValue]
    }));
  };

  const removeArrayItem = (key, index) => {
    setContent(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index)
    }));
  };

  const handleGroupCompanyChange = (index, field, value) => {
    setContent(prev => {
      const companies = [...(prev.groupCompanies || [])];
      companies[index] = { ...companies[index], [field]: value };
      return { ...prev, groupCompanies: companies };
    });
  };

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>Page Content Manager</h1>
          <p className="muted">Modify frontend web content dynamically from the backend database.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            className={`btn ${activeTab === 'homepage' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('homepage')}
          >
            🏠 Homepage Content
          </button>
          <button 
            type="button" 
            className={`btn ${activeTab === 'aboutpage' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('aboutpage')}
          >
            ℹ️ About Us Content
          </button>
        </div>
      </div>

      {loading && <p>Loading page data from backend...</p>}

      {!loading && content && (
        <form onSubmit={handleSave} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2>Editing {activeTab === 'homepage' ? 'Homepage' : 'About Us Page'} Content</h2>
          
          {feedback && (
            <div className={`alert ${feedback.ok ? 'alert-success' : 'alert-error'}`}>
              {feedback.text}
            </div>
          )}

          {activeTab === 'homepage' && (
            <>
              <label className="field">
                <span>Hero Headline</span>
                <input 
                  type="text" 
                  className="input" 
                  value={content.heroTitle || ''} 
                  onChange={(e) => handleFieldChange('heroTitle', e.target.value)} 
                  required
                />
              </label>

              <label className="field">
                <span>Hero Subtitle</span>
                <textarea 
                  className="input" 
                  rows={3}
                  value={content.heroSubtitle || ''} 
                  onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)} 
                  required
                />
              </label>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3>Technical Specifications List</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                  {(content.specBullets || []).map((bullet, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className="input" 
                        value={bullet} 
                        onChange={(e) => handleArrayChange('specBullets', idx, e.target.value)} 
                        required
                      />
                      <button 
                        type="button" 
                        className="btn btn-ghost" 
                        style={{ color: '#d0342c' }}
                        onClick={() => removeArrayItem('specBullets', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    onClick={() => addArrayItem('specBullets', 'New Technical Spec Item')}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    + Add Spec Item
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'aboutpage' && (
            <>
              <label className="field">
                <span>About Paragraph Text</span>
                <textarea 
                  className="input" 
                  rows={6}
                  value={content.aboutText || ''} 
                  onChange={(e) => handleFieldChange('aboutText', e.target.value)} 
                  required
                />
              </label>

              <label className="field">
                <span>Contact Phone</span>
                <input 
                  type="text" 
                  className="input" 
                  value={content.phone || ''} 
                  onChange={(e) => handleFieldChange('phone', e.target.value)} 
                  required
                />
              </label>

              <label className="field">
                <span>Office Address</span>
                <input 
                  type="text" 
                  className="input" 
                  value={content.address || ''} 
                  onChange={(e) => handleFieldChange('address', e.target.value)} 
                  required
                />
              </label>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3>Email Channels</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                  {(content.emails || []).map((email, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="email" 
                        className="input" 
                        value={email} 
                        onChange={(e) => handleArrayChange('emails', idx, e.target.value)} 
                        required
                      />
                      <button 
                        type="button" 
                        className="btn btn-ghost" 
                        style={{ color: '#d0342c' }}
                        onClick={() => removeArrayItem('emails', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    onClick={() => addArrayItem('emails', 'sales@transpower.com')}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    + Add Email Address
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3>Group Companies</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                  {(content.groupCompanies || []).map((company, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                      <label className="field" style={{ marginBottom: '0.5rem' }}>
                        <span>Company Name</span>
                        <input 
                          type="text" 
                          className="input" 
                          value={company.name || ''} 
                          onChange={(e) => handleGroupCompanyChange(idx, 'name', e.target.value)} 
                          required
                        />
                      </label>
                      <label className="field">
                        <span>Tagline / Description</span>
                        <input 
                          type="text" 
                          className="input" 
                          value={company.desc || ''} 
                          onChange={(e) => handleGroupCompanyChange(idx, 'desc', e.target.value)} 
                          required
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={fetchPageContent}>
              Reset Form
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
