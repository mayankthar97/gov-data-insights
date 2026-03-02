import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function StateDetail({ detail }) {
  if (!detail) return null;

  const trendRows = detail.electricity_series.points.map((p, idx) => ({
    year: p.year,
    electricity: p.value,
    gdp: detail.gdp_series.points[idx]?.value ?? null
  }));

  return (
    <section className="panel">
      <h2>{detail.state_name}: Electricity and GDP Correlation</h2>
      <p className="muted">Pearson r: {detail.correlation.pearson_r?.toFixed(3) ?? "NA"}</p>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendRows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" dataKey="electricity" stroke="#0f766e" name="Electricity" />
            <Line yAxisId="right" dataKey="gdp" stroke="#1d4ed8" name="GDP" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x_value" name="Electricity" />
            <YAxis type="number" dataKey="y_value" name="GDP" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Year points" data={detail.correlation.aligned_series} fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
