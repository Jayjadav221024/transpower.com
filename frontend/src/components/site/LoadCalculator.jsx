import { useMemo, useState } from 'react';
import { MESH_PROFILES } from '../../data/products';

export default function LoadCalculator() {
  const [meshKey, setMeshKey] = useState(MESH_PROFILES[0].key);
  const [span, setSpan]       = useState(900);
  const [load, setLoad]       = useState(500);

  const results = useMemo(() => {
    const profile = MESH_PROFILES.find((m) => m.key === meshKey) ?? MESH_PROFILES[0];
    const spanMm  = parseFloat(span) || 900;
    const loadKg  = parseFloat(load) || 500;

    // Simply-supported uniform load deflection, clamped to a sane display range.
    const loadN = loadKg * 9.81;
    const deflection = Math.min(
      25,
      Math.max(0.4, (5 * loadN * spanMm ** 3) / (384 * profile.EI))
    );

    return {
      deflection: deflection.toFixed(2),
      capacity: profile.capacity,
      safety: (profile.capacity / loadKg).toFixed(1),
    };
  }, [meshKey, span, load]);

  return (
    <section id="calculator" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Engineering Tool</div>
          <h2>Interactive FRP <span className="text-orange">Load Calculator</span></h2>
          <p>Instant deflection and load capacity estimator for structural engineers and project planners.</p>
        </div>

        <div className="calc-box">
          <div className="calc-inputs">
            <div className="form-group">
              <label htmlFor="calc-mesh-type">Select Grating / Spec Profile</label>
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

            <div className="form-group">
              <label htmlFor="calc-span">Support Span Distance (mm)</label>
              <input
                type="number" id="calc-span" className="form-control"
                value={span} min="300" max="2000" step="50"
                onChange={(e) => setSpan(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="calc-load">Uniform Design Load (kg/m²)</label>
              <input
                type="number" id="calc-load" className="form-control"
                value={load} min="100" max="5000" step="100"
                onChange={(e) => setLoad(e.target.value)}
              />
            </div>
          </div>

          <div className="calc-results-card">
            <div className="result-item">
              <span>Estimated Deflection</span>
              <div className="result-val">{results.deflection} mm</div>
            </div>

            <div className="result-item">
              <span>Safe Uniform Capacity</span>
              <div className="result-val">{results.capacity} kg/m²</div>
            </div>

            <div className="result-item">
              <span>Design Safety Margin</span>
              <div className="result-val">{results.safety}x Rating</div>
            </div>

            <a href="#quote" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
              Download Calculation Sheet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
