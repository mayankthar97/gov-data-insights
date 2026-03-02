export const snapshotMeta = {
  source: "MoSPI MCP extracted snapshot",
  as_of: "2026-03-02",
  mcp_workflow: {
    inflation_decoder: {
      dataset: "CPI",
      steps: ["1_know_about_mospi_api", "2_get_indicators", "3_get_metadata", "4_get_data"],
      filters: {
        base_year: "2024",
        series: "Current",
        state_code: "1",
        sector_code: "3",
        group_code: "1,8,11",
        division_code: "0"
      }
    },
    job_market_simplifier: {
      dataset: "PLFS",
      steps: ["1_know_about_mospi_api", "2_get_indicators", "3_get_metadata", "4_get_data"],
      filters: {
        frequency_code: "1",
        indicators_used: "1,3,4",
        state_code: "99",
        weekly_status_code: "1,2",
        sector_code: "1,2,3",
        age_code: "1,2",
        gender_code: "2,3"
      }
    }
  }
};

export const inflationSnapshot = {
  latest: {
    month: "January",
    year: 2026,
    headline_inflation: 2.75,
    food_inflation: 2.13,
    housing_inflation: 1.93,
    fuel_inflation: 0.35,
    food_index: 104.04,
    housing_index: 102.36,
    fuel_index: 100.68,
    cpi_general_index: 104.46
  },
  trend_4m: {
    months: ["2025-10", "2025-11", "2025-12", "2026-01"],
    cpi_general_index: [103.74, 104.01, 104.1, 104.46],
    food_index: [103.94, 104.45, 104.09, 104.04],
    housing_index: [101.94, 102.04, 102.16, 102.36],
    fuel_index: [100.69, 100.64, 100.74, 100.68]
  }
};

export const jobSnapshot = {
  latest_year: "2023-24",
  unemployment: {
    overall_cws: 4.9,
    youth_15_29_psss: 14.7,
    urban_cws: 6.7,
    rural_cws: 4.2
  },
  female_lfpr: {
    rural_2022_23: 34.6,
    rural_2023_24: 39.7,
    urban_2022_23: 24.0,
    urban_2023_24: 26.1
  },
  worker_distribution_cws_2023_24: {
    rural: {
      self_employed: 64.2,
      regular_salaried: 13.8
    },
    urban: {
      self_employed: 40.3,
      regular_salaried: 48.7
    },
    combined: {
      self_employed: 57.7,
      regular_salaried: 23.2
    }
  }
};
