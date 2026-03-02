import { nationalSeries, sourceInfo } from "../data/mockData.js";
import { linearRegression, pearsonCorrelation } from "../utils/math.js";

function filterByYearRange(points, startYear, endYear) {
  return points.filter((p) => {
    const afterStart = !startYear || p.year >= startYear;
    const beforeEnd = !endYear || p.year <= endYear;
    return afterStart && beforeEnd;
  });
}

function latestPoint(points) {
  if (!points?.length) return null;
  return points[points.length - 1];
}

export function getMetricSeries({ metricId, startYear, endYear }) {
  const metric = nationalSeries[metricId];
  if (!metric) return null;

  const points = filterByYearRange(metric.points, startYear, endYear).map((p) => ({
    year: p.year,
    quarter: null,
    value: p.value
  }));

  return {
    metric_id: metricId,
    metric_name: metric.metric_name,
    unit: metric.unit,
    geo_level: "national",
    geo_code: "IND",
    geo_name: "India",
    frequency: "annual",
    points,
    source: metricId.startsWith("electricity") ? sourceInfo.electricity : sourceInfo.gdp,
    updated_at: `${sourceInfo.as_of}T00:00:00Z`
  };
}

export function getCorrelation({ xMetricId, yMetricId, startYear, endYear }) {
  const x = getMetricSeries({ metricId: xMetricId, startYear, endYear });
  const y = getMetricSeries({ metricId: yMetricId, startYear, endYear });
  if (!x || !y) return null;

  const aligned = x.points
    .map((xp) => {
      const yp = y.points.find((row) => row.year === xp.year);
      if (!yp) return null;
      if (!Number.isFinite(xp.value) || !Number.isFinite(yp.value)) return null;
      return { year: xp.year, x_value: xp.value, y_value: yp.value };
    })
    .filter(Boolean);

  const xs = aligned.map((p) => p.x_value);
  const ys = aligned.map((p) => p.y_value);
  const { slope, intercept } = linearRegression(xs, ys);

  return {
    x_metric_id: xMetricId,
    y_metric_id: yMetricId,
    geo_level: "national",
    geo_code: "IND",
    window_start_year: aligned[0]?.year ?? null,
    window_end_year: aligned[aligned.length - 1]?.year ?? null,
    points: aligned.length,
    pearson_r: pearsonCorrelation(xs, ys),
    slope,
    intercept,
    aligned_series: aligned
  };
}

export function getSummaryCards() {
  const electricity = latestPoint(nationalSeries.electricity_total_ktoe.points);
  const industry = latestPoint(nationalSeries.electricity_industry_ktoe.points);
  const gdpConst = latestPoint(nationalSeries.gdp_constant_crore.points);
  const growth = latestPoint(nationalSeries.gdp_growth_rate_percent.points);

  const industrySharePercent = electricity?.value
    ? (industry.value / electricity.value) * 100
    : null;

  return {
    year_electricity: electricity?.year ?? null,
    year_gdp: gdpConst?.year ?? null,
    year_growth: growth?.year ?? null,
    electricity_ktoe: electricity?.value ?? null,
    electricity_industry_ktoe: industry?.value ?? null,
    industry_share_percent: industrySharePercent,
    gdp_constant_crore: gdpConst?.value ?? null,
    gdp_growth_percent: growth?.value ?? null,
    source_as_of: sourceInfo.as_of
  };
}
