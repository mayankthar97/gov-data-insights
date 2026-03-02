function RankingTable({ title, items }) {
  return (
    <div className="ranking-column">
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.state_code}>
            <span>{item.state_name}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RankingsPanel({ data, metricId }) {
  return (
    <section className="panel">
      <h2>Top and Bottom Performers ({metricId})</h2>
      <div className="ranking-grid">
        <RankingTable title="Top" items={data.top} />
        <RankingTable title="Bottom" items={data.bottom} />
      </div>
    </section>
  );
}
