import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function NationalTrendChart({ data }) {
  return (
    <section className="panel">
      <h2>National Trend: Electricity vs GDP</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="electricity" stroke="#0f766e" strokeWidth={2} name="Electricity (KToE)" />
            <Line yAxisId="right" type="monotone" dataKey="gdp" stroke="#1d4ed8" strokeWidth={2} name="GDP Constant (INR Cr)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
