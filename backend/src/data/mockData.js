export const states = [
  { state_code: "MH", state_name: "Maharashtra" },
  { state_code: "GJ", state_name: "Gujarat" },
  { state_code: "TN", state_name: "Tamil Nadu" },
  { state_code: "KA", state_name: "Karnataka" },
  { state_code: "DL", state_name: "Delhi" },
  { state_code: "UP", state_name: "Uttar Pradesh" },
  { state_code: "WB", state_name: "West Bengal" },
  { state_code: "RJ", state_name: "Rajasthan" },
  { state_code: "BR", state_name: "Bihar" },
  { state_code: "AS", state_name: "Assam" }
];

export const years = ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24"];

export const nationalSeries = {
  electricity_total_ktoe: [122420, 125220, 129880, 131005, 132698],
  gdp_constant_crore: [22439888, 21003173, 23665149, 26356427, 28000767],
  gdp_growth_rate_percent: [3.9, -6.6, 12.7, 11.4, 6.2],
  electricity_industry_ktoe: [45120, 43890, 47040, 48920, 50110]
};

export const stateDerived = {
  "2023-24": [
    { state_code: "GJ", state_name: "Gujarat", electricity_total_ktoe: 16980, electricity_per_capita_ktoe: 1.42, gdp_constant_crore: 1920000, electricity_intensity_ktoe_per_crore_gdp: 0.00884, data_completeness: 0.98 },
    { state_code: "TN", state_name: "Tamil Nadu", electricity_total_ktoe: 15310, electricity_per_capita_ktoe: 1.31, gdp_constant_crore: 1880000, electricity_intensity_ktoe_per_crore_gdp: 0.00814, data_completeness: 0.97 },
    { state_code: "MH", state_name: "Maharashtra", electricity_total_ktoe: 14710, electricity_per_capita_ktoe: 1.12, gdp_constant_crore: 3210000, electricity_intensity_ktoe_per_crore_gdp: 0.00458, data_completeness: 0.99 },
    { state_code: "KA", state_name: "Karnataka", electricity_total_ktoe: 11800, electricity_per_capita_ktoe: 1.08, gdp_constant_crore: 1800000, electricity_intensity_ktoe_per_crore_gdp: 0.00656, data_completeness: 0.98 },
    { state_code: "DL", state_name: "Delhi", electricity_total_ktoe: 4020, electricity_per_capita_ktoe: 1.73, gdp_constant_crore: 1110000, electricity_intensity_ktoe_per_crore_gdp: 0.00362, data_completeness: 0.96 },
    { state_code: "RJ", state_name: "Rajasthan", electricity_total_ktoe: 9680, electricity_per_capita_ktoe: 0.98, gdp_constant_crore: 1320000, electricity_intensity_ktoe_per_crore_gdp: 0.00733, data_completeness: 0.95 },
    { state_code: "WB", state_name: "West Bengal", electricity_total_ktoe: 8420, electricity_per_capita_ktoe: 0.74, gdp_constant_crore: 1480000, electricity_intensity_ktoe_per_crore_gdp: 0.00569, data_completeness: 0.95 },
    { state_code: "UP", state_name: "Uttar Pradesh", electricity_total_ktoe: 11230, electricity_per_capita_ktoe: 0.51, gdp_constant_crore: 2340000, electricity_intensity_ktoe_per_crore_gdp: 0.00480, data_completeness: 0.95 },
    { state_code: "AS", state_name: "Assam", electricity_total_ktoe: 2650, electricity_per_capita_ktoe: 0.71, gdp_constant_crore: 428000, electricity_intensity_ktoe_per_crore_gdp: 0.00619, data_completeness: 0.94 },
    { state_code: "BR", state_name: "Bihar", electricity_total_ktoe: 5120, electricity_per_capita_ktoe: 0.42, gdp_constant_crore: 905000, electricity_intensity_ktoe_per_crore_gdp: 0.00566, data_completeness: 0.96 }
  ]
};

export const stateTrend = {
  MH: {
    electricity_total_ktoe: [12920, 12850, 13890, 14220, 14710],
    gdp_constant_crore: [2460000, 2320000, 2890000, 3050000, 3210000],
    electricity_per_capita_ktoe: [1.01, 1.0, 1.07, 1.09, 1.12],
    electricity_intensity_ktoe_per_crore_gdp: [0.00525, 0.00554, 0.00481, 0.00466, 0.00458],
    sectors: [
      { sector_name: "Industry", value: 5100, unit: "KToE" },
      { sector_name: "Transport", value: 1600, unit: "KToE" },
      { sector_name: "Others", value: 8010, unit: "KToE" }
    ]
  }
};
