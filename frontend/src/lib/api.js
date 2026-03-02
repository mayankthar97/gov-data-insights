const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return response.json();
}

export const api = {
  home: () => request("/v1/mvp/home"),
  ask: (question) => request("/v1/mvp/ask", { method: "POST", body: JSON.stringify({ question }) }),
  inflation: () => request("/v1/mvp/inflation"),
  inflationImpact: (payload) => request("/v1/mvp/inflation/impact", { method: "POST", body: JSON.stringify(payload) }),
  jobs: () => request("/v1/mvp/jobs"),
  householdStress: () => request("/v1/mvp/household-stress")
};
