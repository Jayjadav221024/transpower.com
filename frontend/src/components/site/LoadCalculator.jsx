import { useMemo, useState } from 'react';
import { MESH_PROFILES } from '../../data/products';

const SURFACE_TYPES = [
  { key: 'meniscus', label: 'Meniscus Top' },
  { key: 'grit', label: 'Grit Top' },
  { key: 'chequered', label: 'Chequered Plate (5 mm)' },
];

export default function LoadCalculator() {
  const [meshKey, setMeshKey]       = useState('38mm-molded');
  const [surfaceKey, setSurfaceKey] = useState('meniscus');
  const [span, setSpan]             = useState('900');
  const [load, setLoad]             = useState('500');

  // Max recommended span per grating profile
  const maxSpan = useMemo(() => {
    if (meshKey === '25mm-molded') return 600;
    if (meshKey === '30mm-molded') return 750;
    return 1000;
  }, [meshKey]);

  // Span limit warnings
  const spanWarning = useMemo(() => {
    const spanNum = parseFloat(span);
    if (!isNaN(spanNum) && spanNum > maxSpan && surfaceKey !== 'chequered') {
      return `⚠️ Exceeds recommended span of ${maxSpan} mm for this profile`;
    }
    return '';
  }, [span, maxSpan, surfaceKey]);

  // Input parsing and validation
  const validation = useMemo(() => {
    const spanNum = parseFloat(span);
    const loadNum = parseFloat(load);

    let spanError = '';
    let loadError = '';

    if (span === '' || isNaN(spanNum)) {
      spanError = 'Span distance is required';
    } else if (spanNum < 300 || spanNum > 1500) {
      spanError = 'Span must be between 300 and 1500 mm';
    }

    if (load === '' || isNaN(loadNum)) {
      loadError = 'Uniform design load is required';
    } else if (loadNum < 100 || loadNum > 2500) {
      loadError = 'Load must be between 100 and 2500 kg/m²';
    }

    return {
      spanNum,
      loadNum,
      spanError,
      loadError,
      isValid: !spanError && !loadError,
    };
  }, [span, load]);

  // Math calculations
  const results = useMemo(() => {
    if (!validation.isValid) return null;

    const profile = MESH_PROFILES.find((m) => m.key === meshKey) ?? MESH_PROFILES[0];
    const L = validation.spanNum;
    const loadKg = validation.loadNum;

    // Line load on a 1-meter wide strip: w = loadKg * g * 10^-3 N/mm
    const w = loadKg * 9.81 * 1e-3;

    // Simply-supported uniform-load deflection formula: 5wL^4 / (384EI)
    const deflection = (5 * w * Math.pow(L, 4)) / (384 * profile.EI);
    const allowableDeflection = L / 200;

    // Status Badge
    let badgeText = 'PASS';
    let badgeClass = 'badge-pass';
    if (deflection > allowableDeflection) {
      badgeText = 'FAIL';
      badgeClass = 'badge-fail';
    } else if (deflection > 0.9 * allowableDeflection) {
      badgeText = 'REVIEW';
      badgeClass = 'badge-review';
    }

    const utilisationRatio = (deflection / allowableDeflection) * 100;
    const isOverCap = utilisationRatio > 400;
    const utilisationText = utilisationRatio > 999 ? '> 999%' : `${utilisationRatio.toFixed(1)}%`;

    return {
      deflection: deflection.toFixed(2),
      allowable: allowableDeflection.toFixed(2),
      utilisation: utilisationText,
      isOverCap,
      badgeText,
      badgeClass,
    };
  }, [meshKey, validation]);

  // Dispatch current details to RFQ Form
  const handleRequestTable = () => {
    const profile = MESH_PROFILES.find((m) => m.key === meshKey) ?? MESH_PROFILES[0];
    const surface = SURFACE_TYPES.find((s) => s.key === surfaceKey) ?? SURFACE_TYPES[0];

    let messageText = '';
    if (surfaceKey === 'chequered') {
      messageText = `Requesting verified spacing calculations/load tables for:\n- Product: Chequered Plate (5 mm)\n- Design Load: ${load} kg/m²\n- Support Span: ${span} mm`;
    } else {
      messageText = `Requesting verified spacing calculations/load tables for:\n- Product: Molded FRP Grating\n- Profile: ${profile.label}\n- Surface Type: ${surface.label}\n- Support Span: ${span} mm\n- Design Load: ${load} kg/m²\n- Estimated Deflection: ${results?.deflection || '--'} mm\n- Deflection Utilisation: ${results?.isOverCap ? 'Over 400%' : results?.utilisation || '--'}\n- Sizing Check: ${results?.badgeText || '--'}`;
    }

    const event = new CustomEvent('prefillRFQ', {
      detail: {
        product: 'frp-gratings',
        message: messageText,
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <section id="calculator" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Engineering Tool</div>
          <h2>Interactive FRP <span className="text-orange">Load Calculator</span></h2>
          <p>Simply-supported uniform-load deflection check against the L/200 serviceability limit.</p>
        </div>

        <div className="calc-box">
          <div className="calc-inputs">
            {/* Grating dropdown */}
            <div className="form-group">
              <label htmlFor="calc-mesh-type">Grating Profile (38x38 mesh)</label>
              <select
                id="calc-mesh-type"
                className="form-control"
                value={meshKey}
                disabled={surfaceKey === 'chequered'}
                onChange={(e) => setMeshKey(e.target.value)}
              >
                {MESH_PROFILES.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Surface type dropdown */}
            <div className="form-group">
              <label htmlFor="calc-surface-type">Surface Type</label>
              <select
                id="calc-surface-type"
                className="form-control"
                value={surfaceKey}
                onChange={(e) => {
                  const val = e.target.value;
                  setSurfaceKey(val);
                }}
              >
                {SURFACE_TYPES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Span Input */}
            <div className="form-group">
              <label htmlFor="calc-span">Support Span Distance (300 - 1500 mm)</label>
              <input
                type="number"
                id="calc-span"
                className={`form-control ${validation.spanError ? 'input-error' : ''}`}
                value={span}
                min="300"
                max="1500"
                step="50"
                onChange={(e) => setSpan(e.target.value)}
              />
              {validation.spanError ? (
                <span className="calc-error-text">{validation.spanError}</span>
              ) : (
                surfaceKey !== 'chequered' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Max recommended span for this profile: {maxSpan} mm
                    </span>
                    {spanWarning && (
                      <span className="calc-error-text" style={{ color: '#d97706', fontSize: '0.74rem' }}>
                        {spanWarning}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Load Input */}
            <div className="form-group">
              <label htmlFor="calc-load">Uniform Design Load (100 - 2500 kg/m²)</label>
              <input
                type="number"
                id="calc-load"
                className={`form-control ${validation.loadError ? 'input-error' : ''}`}
                value={load}
                min="100"
                max="2500"
                step="100"
                onChange={(e) => setLoad(e.target.value)}
              />
              {validation.loadError && (
                <span className="calc-error-text">{validation.loadError}</span>
              )}
            </div>
          </div>

          <div className="calc-results-card">
            {surfaceKey === 'chequered' ? (
              <div style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.88rem', lineHeight: '1.6', padding: '1.2rem 0', minHeight: '136px', display: 'flex', alignItems: 'center' }}>
                Chequered plate is a solid 5 mm panel — contact engineering for support spacing.
              </div>
            ) : (
              <>
                {/* Estimated Deflection */}
                <div className="result-item-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div className="result-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <span>Estimated Deflection</span>
                    <div className="result-val">
                      {validation.isValid ? `${results.deflection} mm` : '--'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', textAlign: 'right', borderBottom: '1px solid rgba(241, 245, 249, 0.15)', paddingBottom: '0.8rem' }}>
                    {validation.isValid ? `Allowable Limit: ${results.allowable} mm (L/200)` : 'Allowable Limit: --'}
                  </div>
                </div>

                {/* Deflection Utilisation */}
                <div className="result-item">
                  <span>Deflection Utilisation (vs L/200)</span>
                  <div className="result-val" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'right' }}>
                    {validation.isValid ? (
                      results.isOverCap ? (
                        <span style={{ fontSize: '0.78rem', color: '#ffb0b0', fontWeight: '500', display: 'block', maxWidth: '200px', lineHeight: '1.3' }}>
                          Span too long for this profile — reduce span or select a deeper grating.
                        </span>
                      ) : (
                        results.utilisation
                      )
                    ) : '--'}
                    {validation.isValid && (
                      <span className={`calc-badge ${results.badgeClass}`}>{results.badgeText}</span>
                    )}
                  </div>
                </div>
              </>
            )}

            <a href="#quote" onClick={handleRequestTable} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>
              Request Verified Load Table from Engineering Team
            </a>
          </div>
        </div>

        <p className="calc-disclaimer">
          <strong>Disclaimer:</strong> Indicative values for preliminary sizing only. Final design must be
          confirmed against Transpower's certified load tables. Contact <a href="mailto:frp@transpower.net.in">frp@transpower.net.in</a> for
          stamped calculations.
        </p>
      </div>
    </section>
  );
}
