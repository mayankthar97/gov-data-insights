import cors from "cors";
import express from "express";
import { getCorrelation, getMetricSeries, getSummaryCards } from "./services/metricsService.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/v1/summary", (_req, res) => {
  res.json(getSummaryCards());
});

app.get("/v1/metrics", (req, res) => {
  const { metric_id: metricId, start_year: startYear, end_year: endYear } = req.query;

  if (!metricId) {
    return res.status(400).json({ error: "metric_id is required" });
  }

  const series = getMetricSeries({ metricId, startYear, endYear });
  if (!series) {
    return res.status(404).json({ error: "Metric series not found" });
  }

  return res.json(series);
});

app.get("/v1/metrics/correlation", (req, res) => {
  const {
    x_metric_id: xMetricId,
    y_metric_id: yMetricId,
    start_year: startYear,
    end_year: endYear
  } = req.query;

  if (!xMetricId || !yMetricId) {
    return res.status(400).json({ error: "x_metric_id and y_metric_id are required" });
  }

  const correlation = getCorrelation({ xMetricId, yMetricId, startYear, endYear });
  if (!correlation) {
    return res.status(404).json({ error: "Correlation data not found" });
  }

  return res.json(correlation);
});

// Removed intentionally: state-wise endpoints, rankings, and map views.
app.get(["/v1/rankings", "/v1/map", "/v1/state/:stateCode"], (_req, res) => {
  res.status(410).json({
    error: "State-wise endpoints removed. Current app supports national data only."
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
