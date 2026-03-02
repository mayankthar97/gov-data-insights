export default function KpiCards({ values }) {
  const cards = [
    { label: "Electricity (KToE)", value: values.electricity },
    { label: "GDP Constant (INR Cr)", value: values.gdp },
    { label: "GDP Growth %", value: values.growth },
    { label: "Industry Electricity (KToE)", value: values.industry }
  ];

  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article key={card.label} className="kpi-card">
          <p>{card.label}</p>
          <h3>{card.value ?? "-"}</h3>
        </article>
      ))}
    </section>
  );
}
