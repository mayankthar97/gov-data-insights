import { nationalSeries, stateDerived, stateTrend, states, years } from "../data/mockData.js";
import { linearRegression, pearsonCorrelation } from "../utils/math.js";

const metricMeta = {
  electricity_total_ktoe: { name: "Electricity Consumption", unit: "KToE", source: "mock_mospi_energy" },
  electricity_industry_ktoe: { name: "Industry Electricity Consumption", unit: "KToE", source: "mock_mospi_energy" },
  gdp_constant_crore: { name: "GDP (Constant Price)", unit: "INR Crore", source: "mock_mospi_nas" },
  gdp_growth_rate_percent: { name: "GDP Growth Rate", unit: "Percent", source: "mock_mospi_nas" },
  electricity_per_capita_ktoe: { name: "Electricity Per Capita", unit: "KToE per person", source: "derived" },
  electricity_intensity_ktoe_per_crore_gdp: { name: "Electricity Intensity", unit: "KToE per INR Crore", source: "derived" }
};

function filterByYearRange(points, startYear, endYear) {
  return points.filter((p) => {
    const afterStart = !startYear || p.year >= startYear;
    const beforeEnd = !endYear || p.year <= endYear;
    return afterStart && beforeEnd;
  });
}

function buildSyntheticStateTrend(stateCode) {
  const latest = stateDerived["2023-24"].find((row) => row.state_code === stateCode);
  if (!latest) return null;

  const scale = [0.88, 0.86, 0.94, 0.97, 1.0];
  return {
    electricity_total_ktoe: scale.map((s) => Math.round(latest.electricity_total_ktoe * s)),
    gdp_constant_crore: scale.map((s) => Math.round(latest.gdp_constant_crore * s)),
    electricity_per_capita_ktoe: scale.map((s) => Number((latest.electricity_per_capita_ktoe * s).toFixed(2))),
    electricity_intensity_ktoe_per_crore_gdp: scale.map((s) => Number((latest.electricity_intensity_ktoe_per_crore_gdp * (1 + (1 - s) * 0.2)).toFixed(5))),
    sectors: [
      { sector_name: "Industry", value: Math.round(latest.electricity_total_ktoe * 0.36), unit: "KToE" },
      { sector_name: "Transport", value: Math.round(latest.electricity_total_ktoe * 0.12), unit: "KToE" },
      { sector_name: "Others", value: Math.round(latest.electricity_total_ktoe * 0.52), unit: "KToE" }
    ]
  };
}

function getStateTrendSafe(stateCode) {
  return stateTrend[stateCode] || buildSyntheticStateTrend(stateCode);
}

export function getMetricSeries({ metricId, geoLevel = "national", geoCode = "IND", startYear, endYear }) {
  const meta = metricMeta[metricId];
  if (!meta) return null;

  let values;
  if (geoLevel === "national") {
    values = nationalSeries[metricId];
    if (!values) return null;
  } else {
    const stateKey = (geoCode || "").toUpperCase();
    values = getStateTrendSafe(stateKey)?.[metricId];
    if (!values) return null;
  }

  const points = years.map((year, idx) => ({ year, quarter: null, value: values[idx] }));
  const filtered = filterByYearRange(points, startYear, endYear);

  return {
    metric_id: metricId,
    metric_name: meta.name,
    unit: meta.unit,
    geo_level: geoLevel,
    geo_code: geoLevel === "national" ? "IND" : geoCode,
    geo_name: geoLevel === "national" ? "India" : (states.find((s) => s.state_code === geoCode)?.state_name || geoCode),
    frequency: "annual",
    points: filtered,
    source: meta.source,
    updated_at: new Date().toISOString()
  };
}

export function getCorrelation({ xMetricId, yMetricId, geoLevel = "national", geoCode = "IND", startYear, endYear }) {
  const x = getMetricSeries({ metricId: xMetricId, geoLevel, geoCode, startYear, endYear });
  const y = getMetricSeries({ metricId: yMetricId, geoLevel, geoCode, startYear, endYear });

  if (!x || !y) return null;

  const aligned = x.points
    .map((xp) => {
      const yp = y.points.find((item) => item.year === xp.year);
      if (!yp) return null;
      return { year: xp.year, x_value: xp.value, y_value: yp.value };
    })
    .filter(Boolean);

  const xs = aligned.map((p) => p.x_value);
  const ys = aligned.map((p) => p.y_value);
  const { slope, intercept } = linearRegression(xs, ys);

  return {
    x_metric_id: xMetricId,
    y_metric_id: yMetricId,
    geo_level: geoLevel,
    geo_code: geoLevel === "national" ? "IND" : geoCode,
    window_start_year: aligned[0]?.year || null,
    window_end_year: aligned[aligned.length - 1]?.year || null,
    points: aligned.length,
    pearson_r: pearsonCorrelation(xs, ys),
    slope,
    intercept,
    aligned_series: aligned
  };
}

export function getRankings({ metricId, year, n = 5 }) {
  const rows = stateDerived[year] || [];
  if (!rows.length) return { metric_id: metricId, year, top: [], bottom: [] };

  const sorted = [...rows]
    .filter((r) => Number.isFinite(r[metricId]))
    .sort((a, b) => b[metricId] - a[metricId]);

  const top = sorted.slice(0, n).map((row, idx) => ({
    rank: idx + 1,
    state_code: row.state_code,
    state_name: row.state_name,
    value: row[metricId],
    data_completeness: row.data_completeness
  }));

  const bottom = sorted
    .slice(-n)
    .reverse()
    .map((row, idx) => ({
      rank: idx + 1,
      state_code: row.state_code,
      state_name: row.state_name,
      value: row[metricId],
      data_completeness: row.data_completeness
    }));

  return { metric_id: metricId, year, top, bottom };
}

export function getMapValues({ metricId, year }) {
  const rows = stateDerived[year] || [];

  return {
    metric_id: metricId,
    year,
    geo_level: "state",
    values: rows.map((r) => ({
      state_code: r.state_code,
      state_name: r.state_name,
      value: Number.isFinite(r[metricId]) ? r[metricId] : null,
      data_completeness: r.data_completeness
    }))
  };
}

export function getStateDetail({ stateCode, startYear, endYear }) {
  const code = (stateCode || "").toUpperCase();
  const state = states.find((s) => s.state_code === code);
  const trend = getStateTrendSafe(code);

  if (!state || !trend) return null;

  const electricity = getMetricSeries({ metricId: "electricity_total_ktoe", geoLevel: "state", geoCode: code, startYear, endYear });
  const gdp = getMetricSeries({ metricId: "gdp_constant_crore", geoLevel: "state", geoCode: code, startYear, endYear });
  const perCapita = getMetricSeries({ metricId: "electricity_per_capita_ktoe", geoLevel: "state", geoCode: code, startYear, endYear });
  const intensity = getMetricSeries({ metricId: "electricity_intensity_ktoe_per_crore_gdp", geoLevel: "state", geoCode: code, startYear, endYear });

  return {
    state_code: code,
    state_name: state.state_name,
    electricity_series: electricity,
    gdp_series: gdp,
    per_capita_series: perCapita,
    intensity_series: intensity,
    correlation: getCorrelation({
      xMetricId: "electricity_total_ktoe",
      yMetricId: "gdp_constant_crore",
      geoLevel: "state",
      geoCode: code,
      startYear,
      endYear
    }),
    sector_breakdown: trend.sectors
  };
}
