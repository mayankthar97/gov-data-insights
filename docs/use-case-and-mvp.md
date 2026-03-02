# Product Use Case (Current Scope)

## Goal
Track national electricity usage and map it against national GDP in an interactive dashboard.

## Current Scope
1. Electricity final consumption trend (KToE)
2. Electricity industry consumption trend (KToE)
3. GDP constant-price trend (INR Crore)
4. GDP growth rate trend (%)
5. Electricity-GDP correlation for overlapping years

## Why State Views Are Removed
State-wise filters for the ENERGY and NAS endpoints used in this integration are not available in the current MoSPI API flow implemented here, so map/ranking/state drill-down features were removed.

## Future Expansion
If state electricity + state GDP series become available in the same pipeline, state map and ranking modules can be reintroduced.
