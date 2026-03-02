import { useEffect, useMemo, useState } from "react";
import CorrelationPanel from "./components/CorrelationPanel";
import KpiCards from "./components/KpiCards";
import NationalTrendChart from "./components/NationalTrendChart";
import { api } from "./lib/api";
import "./styles/app.css";

export default function App() {
  const [summary, setSummary] = useState(null);
  const [electricitySeries, setElectricitySeries] = useState([]);
  const [gdpSeries, setGdpSeries] = useState([]);
  const [correlation, setCorrelation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.summary(),
      api.metricSeries({ metricId: "electricity_total_ktoe" }),
      api.metricSeries({ metricId: "gdp_constant_crore" }),
      api.correlation({ xMetricId: "electricity_total_ktoe", yMetricId: "gdp_constant_crore" })
    ])
      .then(([summaryRes, electricityRes, gdpRes, correlationRes]) => {
        setSummary(summaryRes);
        setElectricitySeries(electricityRes.points || []);
        setGdpSeries(gdpRes.points || []);
        setCorrelation(correlationRes);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      });
  }, []);

  const trendData = useMemo(() => {
    const years = Array.from(new Set([...electricitySeries.map((p) => p.year), ...gdpSeries.map((p) => p.year)])).sort();
    return years.map((year) => ({
      year,
      electricity: electricitySeries.find((p) => p.year === year)?.value ?? null,
      gdp: gdpSeries.find((p) => p.year === year)?.value ?? null
    }));
  }, [electricitySeries, gdpSeries]);

  if (error) {
    return (
      <main className="container">
        <header className="hero">
          <h1>Electricity x GDP Insights</h1>
          <p className="error">{error}</p>
        </header>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="hero">
        <h1>Electricity x GDP Insights (National)</h1>
        <p>
          Live app view built from actual MoSPI ENERGY and NAS series. State-wise views removed.
        </p>
      </header>

      {summary && (
        <KpiCards
          values={{
            yearElectricity: summary.year_electricity,
            yearGdp: summary.year_gdp,
            yearGrowth: summary.year_growth,
            electricity: summary.electricity_ktoe,
            industry: summary.electricity_industry_ktoe,
            industryShare: summary.industry_share_percent,
            gdp: summary.gdp_constant_crore,
            growth: summary.gdp_growth_percent
          }}
        />
      )}

      <NationalTrendChart data={trendData} />
      <CorrelationPanel correlation={correlation} />

      {summary && (
        <section className="panel">
          <h2>Data Source</h2>
          <p className="muted">{summary.source_as_of} snapshot from MoSPI ENERGY and NAS via MCP extraction.</p>
        </section>
      )}
    </main>
  );
}
