import { useMemo, useState } from 'react';
import { MESH_PROFILES } from '../../data/products';

const SURFACE_TYPES = [
  { key: 'meniscus', label: 'Meniscus Top' },
  { key: 'grit', label: 'Grit Top' },
  { key: 'chequered', label: 'Chequered Plate (5 mm)' },
];

export default function LoadCalculator() {
  const [meshKey, setMeshKey]       = useState(MESH_PROFILES[0].key);
  const [surfaceKey, setSurfaceKey] = useState(SURFACE_TYPES[0].key);
  const [span, setSpan]             = useState('900');
  const [load, setLoad]             = useState('500');

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
    const utilisationText = utilisationRatio > 999 ? '> 999%' : `${utilisationRatio.toFixed(1)}%`;

    return {
      deflection: deflection.toFixed(2),
      allowable: allowableDeflection.toFixed(2),
      utilisation: utilisationText,
      badgeText,
      badgeClass,
    };
  }, [meshKey, validation]);

  return (
    <section id="calculator" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Engineering Tool</div>
          <h2>Interactive FRP <span className="text-orange">Load Calculator</span></h2>
          <p>Instant deflection estimator and design check based on standard physical sizing parameters.</p>
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
                onChange={(e) => setSurfaceKey(e.target.value)}
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
              {validation.spanError && (
                <span className="calc-error-text">{validation.spanError}</span>
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

            {/* Utilisation Ratio */}
            <div className="result-item">
              <span>Utilisation Ratio</span>
              <div className="result-val" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {validation.isValid ? results.utilisation : '--'}
                {validation.isValid && (
                  <span className={`calc-badge ${results.badgeClass}`}>{results.badgeText}</span>
                )}
              </div>
            </div>

            <a href="#quote" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>
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
