import { useEffect, useState } from "react";
import { api } from "../lib/api";

const defaultInput = {
  monthly_income: 100000,
  salary_growth: 6,
  spend_food: 25,
  spend_grocery: 20,
  spend_housing: 25,
  spend_fuel: 10,
  spend_other: 20
};

function riskEmoji(level) {
  if (level === "High") return "🔴";
  if (level === "Moderate") return "🟠";
  return "🟢";
}

export default function InflationPage() {
  const [data, setData] = useState(null);
  const [impactInput, setImpactInput] = useState(defaultInput);
  const [impact, setImpact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.inflation()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    api.inflationImpact(impactInput)
      .then(setImpact)
      .catch((err) => setError(err.message));
  }, [impactInput]);

  function onNumberChange(key, value) {
    setImpactInput((prev) => ({ ...prev, [key]: Number(value || 0) }));
  }

  if (error) return <p className="error">{error}</p>;
  if (!data || !impact) return <p className="muted">Loading inflation data...</p>;

  return (
    <section className="page">
      <h1>Inflation Decoder: What Does This Mean for Me?</h1>

      <div className="panel">
        <h2>Headline Simplified</h2>
        <p><strong>Inflation:</strong> {data.headline.inflation}%</p>
        <p><strong>Your grocery inflation:</strong> {data.headline.grocery_inflation}%</p>
        <p><strong>Risk level:</strong> {riskEmoji(data.headline.risk_level)} {data.headline.risk_level}</p>
      </div>

      <div className="panel">
        <h2>Category Breakdown</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Current</th>
              <th>3-Month Trend</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((row) => (
              <tr key={row.key}>
                <td>{row.name}</td>
                <td>{row.current_inflation}%</td>
                <td>{row.trend_3m}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Personal Impact Calculator</h2>
        <div className="form-grid">
          {Object.entries(impactInput).map(([k, v]) => (
            <label key={k} className="form-field">
              <span>{k.replaceAll("_", " ")}</span>
              <input type="number" value={v} onChange={(e) => onNumberChange(k, e.target.value)} />
            </label>
          ))}
        </div>
        <div className="impact-card">
          <p><strong>Personal inflation estimate:</strong> {impact.personal_inflation_estimate}%</p>
          <p><strong>Real income change:</strong> {impact.real_income_change}%</p>
          <p><strong>Purchasing power:</strong> {impact.purchasing_power}</p>
          <p><strong>Summary:</strong> {impact.summary}</p>
        </div>
      </div>

      <div className="panel">
        <h2>Interpretation Engine</h2>
        <ul>
          {data.interpretations.length ? data.interpretations.map((x) => <li key={x}>{x}</li>) : <li>No strong warning signal right now.</li>}
        </ul>
      </div>
    </section>
  );
}
