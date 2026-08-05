import { useState, useEffect } from 'react';
import { adminApi, publicApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import { TrendingUp, Copy, Check } from 'lucide-react';

const DEFAULT_PRODUCTS = [
  'FRP Gratings',
  'FRP Molded Gratings',
  'FRP Cable Trays',
  'Fiberglass Cable Trays',
  'Pultruded FRP Profiles',
  'Industrial Gear Boxes',
  'Power Switchgears'
];

const DEFAULT_CITIES = [
  'Vadodara',
  'Ahmedabad',
  'Anand',
  'Ankleshwar',
  'Bharuch',
  'Surat',
  'Rajkot',
  'Godhra',
  'Navsari',
  'Vapi',
  'Bhuj',
  'Amreli',
  'Dahod'
];

const DEFAULT_CONNECTORS = [
  'in',
  'supplier in',
  'manufacturer in',
  'dealer in',
  'distributor in'
];

export default function SEOKeywordPage() {
  const toast = useToast();
  const [productsText, setProductsText] = useState(DEFAULT_PRODUCTS.join(', '));
  const [citiesText, setCitiesText] = useState(DEFAULT_CITIES.join(', '));
  const [connectorsText, setConnectorsText] = useState(DEFAULT_CONNECTORS.join(', '));
  
  const [placement, setPlacement] = useState({
    footer: true,
    homepage: false,
    locations: false,
    about: false,
    products: false
  });
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    let alive = true;
    publicApi.getPageContent('keyword_stuffing')
      .then((res) => {
        if (!alive) return;
        if (res?.content) {
          const content = res.content;
          if (content.products) setProductsText(content.products);
          if (content.cities) setCitiesText(content.cities);
          if (content.connectors) setConnectorsText(content.connectors);
          if (content.placement) {
            setPlacement(prev => ({ ...prev, ...content.placement }));
          } else if (content.enabled !== undefined) {
            setPlacement(prev => ({ ...prev, footer: content.enabled }));
          }
          if (content.generatedText) setGeneratedText(content.generatedText);
        }
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  function handleGenerate() {
    const products = productsText.split(',').map(x => x.trim()).filter(Boolean);
    const cities = citiesText.split(',').map(x => x.trim()).filter(Boolean);
    const connectors = connectorsText.split(',').map(x => x.trim()).filter(Boolean);

    if (products.length === 0 || cities.length === 0) {
      toast('Please supply at least one product and one city.', true);
      return;
    }

    const sentences = [];
    
    // Generate logical permutations
    products.forEach((product) => {
      cities.forEach((city, index) => {
        // Cycle through connectors to add variety
        const connector = connectors.length > 0 ? connectors[index % connectors.length] : 'in';
        sentences.push(`${product} ${connector} ${city}`);
      });
    });

    // Shuffle slightly to look less robotic, or keep ordered. Let's keep it clean separated by commas
    const output = sentences.join(', ');
    setGeneratedText(output);
    toast('Keywords generated! Review below and click publish.');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updatePageContent('keyword_stuffing', {
        products: productsText,
        cities: citiesText,
        connectors: connectorsText,
        placement,
        generatedText
      });
      toast('SEO Keyword block saved and published successfully!');
    } catch (ex) {
      toast(ex.message || 'Error saving keyword block.', true);
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast('Copied to clipboard');
  }

  if (loading) return <div className="empty-state">Loading configuration…</div>;

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>SEO Keyword Stuffer</h1>
          <p className="muted">Generate and inject custom keyword-stuffed SEO listings to improve regional search engine optimization.</p>
        </div>
      </header>

      <div className="editor-grid">
        <form className="editor-main" onSubmit={handleSave}>
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Generator Settings</h3>
            
            <label className="field">
              <span>Products / SEO Keywords (comma separated)</span>
              <textarea
                className="input"
                rows={3}
                value={productsText}
                onChange={(e) => setProductsText(e.target.value)}
                placeholder="e.g. FRP Gratings, FRP Cable Trays"
                required
              />
            </label>

            <label className="field">
              <span>Target Cities (comma separated)</span>
              <textarea
                className="input"
                rows={3}
                value={citiesText}
                onChange={(e) => setCitiesText(e.target.value)}
                placeholder="e.g. Vadodara, Ahmedabad, Anand"
                required
              />
            </label>

            <label className="field">
              <span>Connector Phrases (comma separated, cycled automatically)</span>
              <input
                type="text"
                className="input"
                value={connectorsText}
                onChange={(e) => setConnectorsText(e.target.value)}
                placeholder="e.g. in, supplier in, manufacturer in"
                required
              />
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleGenerate}
              >
                ✨ Generate Stuffed Keywords Block
              </button>
            </div>
          </div>

          {generatedText && (
            <div className="panel" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Generated Output Preview</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.6',
                  textAlign: 'justify',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  wordBreak: 'break-word'
                }}
              >
                {generatedText}
              </div>

              <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Stats:</strong> {generatedText.split(',').length} search phrases generated ({generatedText.length} characters)
              </div>
            </div>
          )}
        </form>

        <aside className="editor-side">
          <div className="panel">
            <h3>Publishing Options</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Inject Locations:</span>
              
              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={placement.footer}
                  onChange={(e) => setPlacement(prev => ({ ...prev, footer: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Website Footer (Global)</span>
              </label>

              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={placement.homepage}
                  onChange={(e) => setPlacement(prev => ({ ...prev, homepage: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Homepage Bottom</span>
              </label>

              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={placement.locations}
                  onChange={(e) => setPlacement(prev => ({ ...prev, locations: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Locations Page Bottom</span>
              </label>

              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={placement.about}
                  onChange={(e) => setPlacement(prev => ({ ...prev, about: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                />
                <span style={{ fontSize: '0.85rem' }}>About Page Bottom</span>
              </label>

              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={placement.products}
                  onChange={(e) => setPlacement(prev => ({ ...prev, products: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Product Pages Bottom</span>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={saving || !generatedText}
              onClick={handleSave}
            >
              {saving ? 'Publishing…' : '💾 Publish SEO Settings'}
            </button>
          </div>

          <div className="panel">
            <h3>SEO Notice</h3>
            <p className="muted small" style={{ lineHeight: 1.5 }}>
              Keyword stuffing is designed to load pages with keywords in an attempt to manipulate search ranking.
              For optimal compliance, mix this block naturally into local listings, footers, or hide details until expanded.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
