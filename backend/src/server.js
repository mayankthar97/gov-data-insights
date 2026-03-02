import cors from "cors";
import express from "express";
import {
  askMospiAssistant,
  calculatePersonalImpact,
  getHomeSuggestions,
  getHouseholdStress,
  getInflationDecoderData,
  getJobMarketData
} from "./services/mvpService.js";
import { snapshotMeta } from "./data/mvpSnapshot.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/v1/mvp/home", (_req, res) => {
  res.json(getHomeSuggestions());
});

app.get("/v1/mvp/source", (_req, res) => {
  res.json(snapshotMeta);
});

app.post("/v1/mvp/ask", async (req, res) => {
  try {
    const question = req.body?.question;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    const result = await askMospiAssistant(question);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to answer question", detail: error.message });
  }
});

app.get("/v1/mvp/inflation", (_req, res) => {
  res.json(getInflationDecoderData());
});

app.post("/v1/mvp/inflation/impact", (req, res) => {
  res.json(calculatePersonalImpact(req.body));
});

app.get("/v1/mvp/jobs", (_req, res) => {
  res.json(getJobMarketData());
});

app.get("/v1/mvp/household-stress", (_req, res) => {
  res.json(getHouseholdStress());
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
