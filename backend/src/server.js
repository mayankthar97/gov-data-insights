import cors from "cors";
import express from "express";
import {
  getCorrelation,
  getMapValues,
  getMetricSeries,
  getRankings,
  getStateDetail
} from "./services/metricsService.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/v1/metrics", (req, res) => {
  const { metric_id: metricId, geo_level: geoLevel, geo_code: geoCode, start_year: startYear, end_year: endYear } = req.query;

  if (!metricId) {
    return res.status(400).json({ error: "metric_id is required" });
  }

  const series = getMetricSeries({ metricId, geoLevel, geoCode, startYear, endYear });
  if (!series) {
    return res.status(404).json({ error: "Metric series not found" });
  }

  return res.json(series);
});

app.get("/v1/metrics/correlation", (req, res) => {
  const {
    x_metric_id: xMetricId,
    y_metric_id: yMetricId,
    geo_level: geoLevel,
    geo_code: geoCode,
    start_year: startYear,
    end_year: endYear
  } = req.query;

  if (!xMetricId || !yMetricId) {
    return res.status(400).json({ error: "x_metric_id and y_metric_id are required" });
  }

  const correlation = getCorrelation({ xMetricId, yMetricId, geoLevel, geoCode, startYear, endYear });
  if (!correlation) {
    return res.status(404).json({ error: "Correlation data not found" });
  }

  return res.json(correlation);
});

app.get("/v1/rankings", (req, res) => {
  const { metric_id: metricId, year, n } = req.query;

  if (!metricId || !year) {
    return res.status(400).json({ error: "metric_id and year are required" });
  }

  return res.json(getRankings({ metricId, year, n: Number(n) || 5 }));
});

app.get("/v1/map", (req, res) => {
  const { metric_id: metricId, year } = req.query;

  if (!metricId || !year) {
    return res.status(400).json({ error: "metric_id and year are required" });
  }

  return res.json(getMapValues({ metricId, year }));
});

app.get("/v1/state/:stateCode", (req, res) => {
  const { stateCode } = req.params;
  const { start_year: startYear, end_year: endYear } = req.query;

  const detail = getStateDetail({ stateCode, startYear, endYear });
  if (!detail) {
    return res.status(404).json({ error: "State detail not found" });
  }

  return res.json(detail);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
