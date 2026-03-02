const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function get(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Request failed (${response.status}): ${message}`);
  }
  return response.json();
}

export const api = {
  health: () => get("/health"),
  summary: () => get("/v1/summary"),
  metricSeries: ({ metricId, startYear, endYear }) => {
    const q = new URLSearchParams({ metric_id: metricId });
    if (startYear) q.set("start_year", startYear);
    if (endYear) q.set("end_year", endYear);
    return get(`/v1/metrics?${q.toString()}`);
  },
  correlation: ({ xMetricId, yMetricId, startYear, endYear }) => {
    const q = new URLSearchParams({ x_metric_id: xMetricId, y_metric_id: yMetricId });
    if (startYear) q.set("start_year", startYear);
    if (endYear) q.set("end_year", endYear);
    return get(`/v1/metrics/correlation?${q.toString()}`);
  }
};
