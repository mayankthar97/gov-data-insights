export default function CorrelationPanel({ correlation }) {
  if (!correlation) return null;

  return (
    <section className="panel">
      <h2>Electricity-GDP Correlation (National)</h2>
      <div className="stats-grid">
        <div>
          <p className="muted">Window</p>
          <strong>{correlation.window_start_year} to {correlation.window_end_year}</strong>
        </div>
        <div>
          <p className="muted">Data points</p>
          <strong>{correlation.points}</strong>
        </div>
        <div>
          <p className="muted">Pearson r</p>
          <strong>{Number.isFinite(correlation.pearson_r) ? correlation.pearson_r.toFixed(3) : "-"}</strong>
        </div>
      </div>
      <p className="muted">Computed on overlapping years where both electricity and GDP data are available.</p>
    </section>
  );
}
