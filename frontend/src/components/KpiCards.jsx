function valueOrDash(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function KpiCards({ values }) {
  const cards = [
    { label: `Electricity Final Consumption (${values.yearElectricity || "-"})`, value: valueOrDash(values.electricity) },
    { label: `Electricity Industry Consumption (${values.yearElectricity || "-"})`, value: valueOrDash(values.industry) },
    { label: `Industry Share of Electricity (${values.yearElectricity || "-"})`, value: `${valueOrDash(values.industryShare, 1)}%` },
    { label: `GDP Constant (${values.yearGdp || "-"})`, value: valueOrDash(values.gdp, 0) },
    { label: `GDP Growth (${values.yearGrowth || "-"})`, value: `${valueOrDash(values.growth, 2)}%` }
  ];

  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article key={card.label} className="kpi-card">
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
    </section>
  );
}
