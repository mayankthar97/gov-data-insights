export const sourceInfo = {
  electricity: "MoSPI ENERGY (indicator: Energy Balance in KToE, use: Consumption, commodity: Electricity)",
  gdp: "MoSPI NAS (base_year: 2022-23, series: Current, indicator: GDP / GDP Growth Rate)",
  as_of: "2026-03-02"
};

export const nationalSeries = {
  electricity_total_ktoe: {
    metric_name: "Electricity Final Consumption",
    unit: "KToE",
    points: [
      { year: "2012-13", value: 70889.89 },
      { year: "2013-14", value: 75181.94 },
      { year: "2014-15", value: 81572.86 },
      { year: "2015-16", value: 86102.4 },
      { year: "2016-17", value: 91261.71 },
      { year: "2017-18", value: 96614.71 },
      { year: "2018-19", value: 104057.56 },
      { year: "2019-20", value: 107335.38 },
      { year: "2020-21", value: 105797.89 },
      { year: "2021-22", value: 113241.77 },
      { year: "2022-23", value: 123866.75 },
      { year: "2023-24", value: 132698 }
    ]
  },
  electricity_industry_ktoe: {
    metric_name: "Electricity Consumption - Industry",
    unit: "KToE",
    points: [
      { year: "2012-13", value: 31475.05 },
      { year: "2013-14", value: 33059.97 },
      { year: "2014-15", value: 35977.77 },
      { year: "2015-16", value: 36422.97 },
      { year: "2016-17", value: 37857.67 },
      { year: "2017-18", value: 40300.74 },
      { year: "2018-19", value: 44650.88 },
      { year: "2019-20", value: 45822.49 },
      { year: "2020-21", value: 43754.75 },
      { year: "2021-22", value: 47857.37 },
      { year: "2022-23", value: 51074.97 },
      { year: "2023-24", value: 55470 }
    ]
  },
  gdp_constant_crore: {
    metric_name: "GDP (Constant Price)",
    unit: "INR Crore",
    points: [
      { year: "2022-23", value: 26117627.200238142 },
      { year: "2023-24", value: 28000766.97942123 },
      { year: "2024-25", value: 29988619.479805388 },
      { year: "2025-26", value: 32257756.419088542 }
    ]
  },
  gdp_current_crore: {
    metric_name: "GDP (Current Price)",
    unit: "INR Crore",
    points: [
      { year: "2022-23", value: 26117627.20023815 },
      { year: "2023-24", value: 28983909.303971015 },
      { year: "2024-25", value: 31807308.592047345 },
      { year: "2025-26", value: 34547156.79646479 }
    ]
  },
  gdp_growth_rate_percent: {
    metric_name: "GDP Growth Rate (Constant Price)",
    unit: "%",
    points: [
      { year: "2023-24", value: 7.21022535755435 },
      { year: "2024-25", value: 7.099278751346731 },
      { year: "2025-26", value: 7.566661792822444 }
    ]
  }
};
