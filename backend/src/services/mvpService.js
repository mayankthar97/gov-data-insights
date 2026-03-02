import OpenAI from "openai";
import { inflationSnapshot, jobSnapshot, snapshotMeta } from "../data/mvpSnapshot.js";

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function lastN(arr, n) {
  return arr.slice(Math.max(0, arr.length - n));
}

function trendLabel(series) {
  if (!Array.isArray(series) || series.length < 2) return "Stable";
  const tail = lastN(series, 3);
  const deltas = [tail[1] - tail[0], tail[2] - tail[1]];
  if (deltas.every((d) => d > 0.04)) return "Rising";
  if (deltas.every((d) => d < -0.04)) return "Falling";
  return "Stable";
}

function isRisingConsecutively(series, months = 4) {
  const tail = lastN(series, months);
  if (tail.length < months) return false;
  for (let i = 1; i < tail.length; i += 1) {
    if (tail[i] <= tail[i - 1]) return false;
  }
  return true;
}

function estimateCoreInflationProxy() {
  // Proxy using non-food dominant components available in this MVP snapshot.
  const { housing_inflation: housing, fuel_inflation: fuel, headline_inflation: headline } = inflationSnapshot.latest;
  return (0.6 * housing) + (0.2 * fuel) + (0.2 * headline);
}

function inflationRiskLevel(headline, food) {
  if (headline >= 6 || food >= 8) return "High";
  if (headline >= 4 || food >= 5) return "Moderate";
  return "Low";
}

export function getInflationDecoderData() {
  const latest = inflationSnapshot.latest;
  const trend = inflationSnapshot.trend_4m;
  const coreProxy = estimateCoreInflationProxy();
  const cpiRising4 = isRisingConsecutively(trend.cpi_general_index, 4);

  const interpretations = [];
  if (latest.food_inflation > 8) {
    interpretations.push("Short-term grocery pressure");
  }
  if (coreProxy > 5) {
    interpretations.push("Persistent price pressure (core proxy > 5)");
  }
  if (cpiRising4) {
    interpretations.push("Upward inflation trend forming");
  }

  return {
    headline: {
      inflation: latest.headline_inflation,
      grocery_inflation: latest.food_inflation,
      risk_level: inflationRiskLevel(latest.headline_inflation, latest.food_inflation)
    },
    categories: [
      {
        key: "food",
        name: "Food",
        current_inflation: latest.food_inflation,
        trend_3m: trendLabel(lastN(trend.food_index, 3)),
        meaning: "Grocery bills will change with food inflation"
      },
      {
        key: "housing",
        name: "Housing",
        current_inflation: latest.housing_inflation,
        trend_3m: trendLabel(lastN(trend.housing_index, 3)),
        meaning: "Rent and utility pressure"
      },
      {
        key: "fuel",
        name: "Fuel",
        current_inflation: latest.fuel_inflation,
        trend_3m: trendLabel(lastN(trend.fuel_index, 3)),
        meaning: "Transport and fuel cost movement"
      }
    ],
    logic_flags: {
      food_gt_8: latest.food_inflation > 8,
      core_proxy_gt_5: coreProxy > 5,
      headline_rising_4m: cpiRising4,
      core_inflation_proxy: Number(coreProxy.toFixed(2))
    },
    interpretations,
    metadata: snapshotMeta
  };
}

export function calculatePersonalImpact(input) {
  const {
    salary_growth = 0,
    spend_food = 30,
    spend_grocery = 20,
    spend_housing = 25,
    spend_fuel = 10,
    spend_other = 15,
    monthly_income = 0
  } = input || {};

  const latest = inflationSnapshot.latest;

  const weightedInflation = (
    (Number(spend_food) * latest.food_inflation) +
    (Number(spend_grocery) * latest.food_inflation) +
    (Number(spend_housing) * latest.housing_inflation) +
    (Number(spend_fuel) * latest.fuel_inflation) +
    (Number(spend_other) * latest.headline_inflation)
  ) / 100;

  const realIncomeChange = Number(salary_growth) - weightedInflation;
  const purchasingPower = realIncomeChange >= 0 ? "Rising" : "Falling";

  return {
    monthly_income,
    salary_growth: Number(salary_growth),
    personal_inflation_estimate: Number(weightedInflation.toFixed(2)),
    real_income_change: Number(realIncomeChange.toFixed(2)),
    purchasing_power: purchasingPower,
    summary:
      realIncomeChange >= 0
        ? `Your real income is improving by ${realIncomeChange.toFixed(2)}%`
        : `Your real income is shrinking by ${Math.abs(realIncomeChange).toFixed(2)}%`
  };
}

function computeJobSecurityIndex() {
  const youth = jobSnapshot.unemployment.youth_15_29_psss;
  const regularShare = jobSnapshot.worker_distribution_cws_2023_24.combined.regular_salaried;
  const selfShare = jobSnapshot.worker_distribution_cws_2023_24.combined.self_employed;
  const urbanGap = jobSnapshot.unemployment.urban_cws - jobSnapshot.unemployment.rural_cws;

  let score = 10;
  if (youth > 15) score -= 3;
  else if (youth > 12) score -= 2;

  if (regularShare < 30) score -= 3;
  else if (regularShare < 40) score -= 2;

  if (selfShare > 55) score -= 2;
  else if (selfShare > 45) score -= 1;

  if (urbanGap > 2) score -= 1;

  return Math.max(1, Math.min(10, score));
}

export function getJobMarketData() {
  const score = computeJobSecurityIndex();
  const femaleRising =
    jobSnapshot.female_lfpr.rural_2023_24 > jobSnapshot.female_lfpr.rural_2022_23 &&
    jobSnapshot.female_lfpr.urban_2023_24 > jobSnapshot.female_lfpr.urban_2022_23;

  const interpretations = [];
  if (jobSnapshot.worker_distribution_cws_2023_24.combined.self_employed > 50) {
    interpretations.push("Falling unemployment + high self-employment may indicate informal absorption");
  }
  if (femaleRising) {
    interpretations.push("Rising female participation suggests a positive structural shift");
  }
  if (jobSnapshot.unemployment.youth_15_29_psss > 12) {
    interpretations.push("High youth unemployment implies tougher early-career job market");
  }
  if (jobSnapshot.unemployment.urban_cws > jobSnapshot.unemployment.rural_cws) {
    interpretations.push("Urban unemployment is higher than rural, indicating urban job stress");
  }

  return {
    headline: {
      unemployment: jobSnapshot.unemployment.overall_cws,
      youth_unemployment: jobSnapshot.unemployment.youth_15_29_psss,
      job_quality: score <= 4 ? "Weak" : score <= 7 ? "Mixed" : "Strong"
    },
    urban_vs_rural: {
      unemployment: {
        urban: jobSnapshot.unemployment.urban_cws,
        rural: jobSnapshot.unemployment.rural_cws,
        meaning: "Urban stress is higher when urban unemployment exceeds rural"
      },
      female_lfpr: {
        urban_2022_23: jobSnapshot.female_lfpr.urban_2022_23,
        urban_2023_24: jobSnapshot.female_lfpr.urban_2023_24,
        rural_2022_23: jobSnapshot.female_lfpr.rural_2022_23,
        rural_2023_24: jobSnapshot.female_lfpr.rural_2023_24,
        meaning: "Participation trend"
      },
      self_employment_share: {
        urban: jobSnapshot.worker_distribution_cws_2023_24.urban.self_employed,
        rural: jobSnapshot.worker_distribution_cws_2023_24.rural.self_employed,
        meaning: "Higher share can imply informal job dominance"
      }
    },
    job_quality: {
      regular_salaried_share: jobSnapshot.worker_distribution_cws_2023_24.combined.regular_salaried,
      self_employed_share: jobSnapshot.worker_distribution_cws_2023_24.combined.self_employed,
      job_security_index: score
    },
    interpretations,
    metadata: snapshotMeta
  };
}

export function getHouseholdStress() {
  const inflation = getInflationDecoderData();
  const jobs = getJobMarketData();

  const inflationPressure = inflation.headline.risk_level === "High";
  const jobWeak = jobs.job_quality.job_security_index <= 4;

  return {
    stress_level: inflationPressure && jobWeak ? "High" : inflationPressure || jobWeak ? "Moderate" : "Low",
    narrative:
      inflationPressure && jobWeak
        ? "Middle-class pressure is building: inflation pressure and weak job quality may squeeze real consumption."
        : "Household stress is present but not at peak risk.",
    inputs: {
      inflation_risk: inflation.headline.risk_level,
      job_security_index: jobs.job_quality.job_security_index
    }
  };
}

const defaultSuggestions = [
  "Is inflation likely to hurt my grocery budget this quarter?",
  "My salary grew 6%. Is my purchasing power rising or falling?",
  "What does youth unemployment mean for fresh graduates?",
  "Are job conditions improving in urban India?"
];

export function getHomeSuggestions() {
  return {
    suggestions: defaultSuggestions,
    metadata: snapshotMeta
  };
}

function fallbackAnswer(question) {
  const inflation = getInflationDecoderData();
  const jobs = getJobMarketData();
  return `You asked: "${question}"\n\nInflation snapshot: headline ${inflation.headline.inflation}% and food ${inflation.headline.grocery_inflation}%.\nJob snapshot: unemployment ${jobs.headline.unemployment}%, youth unemployment ${jobs.headline.youth_unemployment}%, Job Security Index ${jobs.job_quality.job_security_index}/10.\n\nThis app is powered by MoSPI data via MCP snapshot ingestion (${snapshotMeta.as_of}).`;
}

export async function askMospiAssistant(question) {
  if (!openaiClient) {
    return {
      answer: fallbackAnswer(question),
      model: "fallback",
      powered_by: "MoSPI MCP snapshot"
    };
  }

  const inflation = getInflationDecoderData();
  const jobs = getJobMarketData();

  const systemPrompt = `You are a public-data explainer for Indian households. Use only this data:\nInflation headline=${inflation.headline.inflation}, food=${inflation.headline.grocery_inflation}, housing=${inflation.categories.find(c=>c.key==='housing').current_inflation}, fuel=${inflation.categories.find(c=>c.key==='fuel').current_inflation}.\nJobs unemployment=${jobs.headline.unemployment}, youth=${jobs.headline.youth_unemployment}, job_security_index=${jobs.job_quality.job_security_index}.\nExplain in simple language with practical implications and no jargon.`;

  const resp = await openaiClient.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ]
  });

  return {
    answer: resp.output_text,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    powered_by: "MoSPI MCP snapshot + OpenAI"
  };
}
