import { useEffect, useMemo, useState } from "react";
import KpiCards from "./components/KpiCards";
import NationalTrendChart from "./components/NationalTrendChart";
import RankingsPanel from "./components/RankingsPanel";
import StateDetail from "./components/StateDetail";
import StateHeatMap from "./components/StateHeatMap";
import { api } from "./lib/api";
import "./styles/app.css";

const YEAR = "2023-24";
const METRIC_OPTIONS = [
  "electricity_total_ktoe",
  "electricity_per_capita_ktoe",
  "electricity_intensity_ktoe_per_crore_gdp"
];

export default function App() {
  const [metricId, setMetricId] = useState(METRIC_OPTIONS[0]);
  const [mapData, setMapData] = useState({ values: [] });
  const [rankings, setRankings] = useState({ top: [], bottom: [] });
  const [stateCode, setStateCode] = useState("MH");
  const [stateDetail, setStateDetail] = useState(null);
  const [series, setSeries] = useState({ electricity: [], gdp: [], growth: [], industry: [] });

  useEffect(() => {
    Promise.all([
      api.metricSeries({ metricId: "electricity_total_ktoe" }),
      api.metricSeries({ metricId: "gdp_constant_crore" }),
      api.metricSeries({ metricId: "gdp_growth_rate_percent" }),
      api.metricSeries({ metricId: "electricity_industry_ktoe" })
    ]).then(([electricity, gdp, growth, industry]) => setSeries({ electricity, gdp, growth, industry }));
  }, []);

  useEffect(() => {
    Promise.all([
      api.map({ metricId, year: YEAR }),
      api.rankings({ metricId, year: YEAR, n: 5 })
    ]).then(([mapRes, rankRes]) => {
      setMapData(mapRes);
      setRankings(rankRes);
    });
  }, [metricId]);

  useEffect(() => {
    api.stateDetail(stateCode).then(setStateDetail);
  }, [stateCode]);

  const trendData = useMemo(() => {
    if (!series.electricity.points || !series.gdp.points) return [];
    return series.electricity.points.map((point, idx) => ({
      year: point.year,
      electricity: point.value,
      gdp: series.gdp.points[idx]?.value
    }));
  }, [series]);

  const latestIndex = (series.electricity.points || []).length - 1;
  const kpis = {
    electricity: series.electricity.points?.[latestIndex]?.value,
    gdp: series.gdp.points?.[latestIndex]?.value,
    growth: series.growth.points?.[latestIndex]?.value,
    industry: series.industry.points?.[latestIndex]?.value
  };

  return (
    <main className="container">
      <header className="hero">
        <h1>Electricity x GDP Insights</h1>
        <p>
          Interactive analytics for electricity usage, per-capita usage, and GDP correlation.
        </p>
      </header>

      <KpiCards values={kpis} />
      <NationalTrendChart data={trendData} />

      <section className="panel controls">
        <h2>State Ranking Metric</h2>
        <select value={metricId} onChange={(e) => setMetricId(e.target.value)}>
          {METRIC_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      <div className="two-col">
        <StateHeatMap mapData={mapData} selectedState={stateCode} onSelect={setStateCode} />
        <RankingsPanel data={rankings} metricId={metricId} />
      </div>

      <StateDetail detail={stateDetail} />
    </main>
  );
}
