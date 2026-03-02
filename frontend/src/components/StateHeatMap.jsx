function colorFor(value, min, max) {
  if (value === null || value === undefined) return "#e5e7eb";
  const ratio = max === min ? 0.5 : (value - min) / (max - min);
  const light = 92 - Math.round(ratio * 42);
  return `hsl(189, 70%, ${light}%)`;
}

export default function StateHeatMap({ mapData, selectedState, onSelect }) {
  const values = mapData.values.map((v) => v.value).filter((v) => Number.isFinite(v));
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <section className="panel">
      <h2>State Map View</h2>
      <p className="muted">Click a state tile to open detail and correlation.</p>
      <div className="state-grid">
        {mapData.values.map((state) => (
          <button
            type="button"
            key={state.state_code}
            className={`state-tile ${selectedState === state.state_code ? "active" : ""}`}
            style={{ background: colorFor(state.value, min, max) }}
            onClick={() => onSelect(state.state_code)}
          >
            <span>{state.state_code}</span>
            <strong>{state.value ?? "NA"}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
