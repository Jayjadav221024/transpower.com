import { COMPARISON_ROWS } from '../../data/products';

const toneClass = { good: 'check-green', bad: 'cross-red', neutral: undefined };

const Cell = ({ cell }) => (
  <td><span className={toneClass[cell.tone] || ''}>{cell.text}</span></td>
);

export default function ComparisonTable() {
  return (
    <section id="comparison" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Technical Advantage</div>
          <h2>Why Choose <span className="text-orange">FRP vs. Steel</span></h2>
          <p>Trusted across Indian process, power and chemical plants — 60+ years of Electro-Mechanical experience, 8000+ customers, 99% retention.</p>
        </div>

        {/* Desktop View Table */}
        <div className="table-responsive comparison-table-desktop">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature / Property</th>
                <th>Transpower FRP Composites</th>
                <th>Galvanized Steel</th>
                <th>Stainless Steel</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature}>
                  <td style={{ fontWeight: '700' }}>{row.feature}</td>
                  <Cell cell={row.frp} />
                  <Cell cell={row.galv} />
                  <Cell cell={row.ss} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Stacked Cards */}
        <div className="comparison-cards-mobile">
          {/* FRP Card */}
          <div className="comparison-card">
            <h4>Transpower FRP Composites</h4>
            <div className="card-specs">
              {COMPARISON_ROWS.map((row) => (
                <div key={row.feature} className="card-spec-item">
                  <span className="spec-label">{row.feature}</span>
                  <span className={`spec-value ${toneClass[row.frp.tone] || ''}`}>{row.frp.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Galvanized Steel Card */}
          <div className="comparison-card">
            <h4>Galvanized Steel</h4>
            <div className="card-specs">
              {COMPARISON_ROWS.map((row) => (
                <div key={row.feature} className="card-spec-item">
                  <span className="spec-label">{row.feature}</span>
                  <span className={`spec-value ${toneClass[row.galv.tone] || ''}`}>{row.galv.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stainless Steel Card */}
          <div className="comparison-card">
            <h4>Stainless Steel</h4>
            <div className="card-specs">
              {COMPARISON_ROWS.map((row) => (
                <div key={row.feature} className="card-spec-item">
                  <span className="spec-label">{row.feature}</span>
                  <span className={`spec-value ${toneClass[row.ss.tone] || ''}`}>{row.ss.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
