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
  metricSeries: ({ metricId, geoLevel = "national", geoCode = "IND", startYear, endYear }) => {
    const q = new URLSearchParams({ metric_id: metricId, geo_level: geoLevel, geo_code: geoCode });
    if (startYear) q.set("start_year", startYear);
    if (endYear) q.set("end_year", endYear);
    return get(`/v1/metrics?${q.toString()}`);
  },
  map: ({ metricId, year }) => get(`/v1/map?${new URLSearchParams({ metric_id: metricId, year }).toString()}`),
  rankings: ({ metricId, year, n = 5 }) => get(`/v1/rankings?${new URLSearchParams({ metric_id: metricId, year, n: String(n) }).toString()}`),
  stateDetail: (stateCode, startYear, endYear) => {
    const q = new URLSearchParams();
    if (startYear) q.set("start_year", startYear);
    if (endYear) q.set("end_year", endYear);
    return get(`/v1/state/${stateCode}${q.toString() ? `?${q.toString()}` : ""}`);
  }
};
