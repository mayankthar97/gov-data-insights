# Electricity-GDP App Data Model

## Scope
This model supports:
- National electricity and GDP trends (MVP)
- Sector-level electricity consumption (including industry/corporate-style views)
- State-level map and state correlation views once state datasets are connected

## Core Entities

### 1) `metric_series`
Time-series values for one metric.

Fields:
- `metric_id` (string): unique metric key (for example `electricity_total_ktoe`, `gdp_constant_crore`)
- `metric_name` (string)
- `unit` (string)
- `frequency` (enum): `annual` | `quarterly` | `monthly`
- `geo_level` (enum): `national` | `state`
- `geo_code` (string): `IND` for national, state code for state rows
- `geo_name` (string)
- `year` (string): fiscal year format like `2023-24`
- `quarter` (string|null): `Q1`..`Q4` where relevant
- `value` (number)
- `source` (string): `mospi_energy`, `mospi_nas`, `external_state_energy`, `external_state_gsdp`
- `updated_at` (ISO datetime)

### 2) `electricity_sector_series`
Sector/sub-sector electricity values.

Fields:
- `metric_id` (string): `electricity_sector_consumption_ktoe`
- `year` (string)
- `geo_level` (enum): `national` | `state`
- `geo_code` (string)
- `geo_name` (string)
- `sector_code` (string)
- `sector_name` (string)
- `sub_sector_code` (string|null)
- `sub_sector_name` (string|null)
- `value` (number)
- `unit` (string): `KToE`
- `source` (string)

### 3) `state_profile`
Dimension table for state map and lookup.

Fields:
- `state_code` (string)
- `state_name` (string)
- `region` (string|null)
- `population` (number|null)
- `population_year` (string|null)

### 4) `derived_state_metrics`
Precomputed state-level indicators used in rankings and choropleth maps.

Fields:
- `state_code` (string)
- `state_name` (string)
- `year` (string)
- `electricity_total_ktoe` (number|null)
- `electricity_per_capita_ktoe` (number|null)
- `gdp_constant_crore` (number|null)
- `electricity_intensity_ktoe_per_crore_gdp` (number|null)
- `data_completeness` (number): 0 to 1 score

### 5) `state_correlation`
Correlation stats used for selected state page.

Fields:
- `state_code` (string)
- `state_name` (string)
- `window_start_year` (string)
- `window_end_year` (string)
- `points` (number)
- `pearson_r` (number|null)
- `slope` (number|null)
- `intercept` (number|null)
- `method` (string): `ols_loglog` or `ols_linear`
- `notes` (string|null)

## Metric Dictionary (initial)
- `electricity_total_ktoe`
- `electricity_final_consumption_ktoe`
- `electricity_industry_ktoe`
- `gdp_current_crore`
- `gdp_constant_crore`
- `gdp_growth_rate_percent`

## Update Policy
- ENERGY annual refresh: yearly pull per available year
- NAS annual/quarterly refresh: quarterly for GDP/GVA growth, annual for yearly aggregates
- Derived tables recompute after source sync

## Data Quality Rules
- Never mix `current` and `constant` GDP in one trend chart without explicit labeling.
- Require matching years for electricity-GDP scatter/correlation points.
- Any derived metric with missing numerator/denominator becomes `null` and is excluded from ranking.
