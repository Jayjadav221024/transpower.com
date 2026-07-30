import { COMPARISON_ROWS } from '../../data/products';

const toneClass = { good: 'check-green', bad: 'cross-red', neutral: undefined };

const Cell = ({ cell }) => (
  <td><span className={toneClass[cell.tone]}>{cell.text}</span></td>
);

export default function ComparisonTable() {
  return (
    <section id="comparison" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Technical Advantage</div>
          <h2>Why Choose <span className="text-orange">FRP vs. Steel</span></h2>
          <p>Discover why industrial plants globally are replacing traditional steel with Transpower FRP composites.</p>
        </div>

        <div className="table-responsive">
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
                  <td>{row.feature}</td>
                  <Cell cell={row.frp} />
                  <Cell cell={row.galv} />
                  <Cell cell={row.ss} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
