# Product Use Case and MVP Plan

## Problem
Users need a single interactive experience to understand how electricity usage and economic output relate.

## Target Users
- Policy teams
- Corporate strategy/market intelligence teams
- Researchers and students

## Primary Questions
1. How is electricity consumption changing over time?
2. Which sectors use the most electricity?
3. Which regions are top/bottom performers on per-capita usage and efficiency?
4. How strongly does electricity usage track GDP?

## User Journey
1. Open dashboard and see headline cards:
- Total electricity consumption
- GDP and GDP growth
- Electricity intensity (electricity per GDP)
2. View map (state choropleth when state data is available).
3. Toggle metric: `Total`, `Per Capita`, `Intensity`.
4. View top/bottom 5 rankings.
5. Click a state to open detail panel:
- Electricity and GDP trend lines
- Scatter plot electricity vs GDP
- Correlation score and interpretation

## MVP (Phase 1: National + sector interactive)
Because current MCP outputs are national for ENERGY and NAS in this environment:
- National trend charts for electricity and GDP
- Sector consumption chart (industry/corporate view)
- Correlation at national time-series level
- UI and API contracts prepared for state expansion

## Phase 2 (State map + state rankings)
Add state electricity + state GDP + population sources, then enable:
- State choropleth map
- Top/bottom state performers
- State detail correlation

## KPI Ideas
- Time to first insight < 30 seconds
- Chart interactions/session
- State selection rate
- Export/report generation rate
