---
name: mospi-novice-explainer
description: Use this skill when a user asks for beginner-friendly explanations of MoSPI indicators, terms, or dataset concepts. It simplifies jargon, uses plain language examples, and compares related terms clearly.
---

# MoSPI Novice Explainer

## Purpose
Turn MoSPI terms into first-time-learner explanations without losing correctness.

## Use This Skill When
- The user asks “what does this indicator mean?”
- The user is confused between similar metrics (for example GDP vs GVA, LFPR vs WPR, CPI vs WPI)
- The user needs easy examples before working with raw data

## Inputs
- User term or indicator name
- Optional context (dataset, year, geography, frequency)
- Indicator sheet: `../mospi_indicators_sheet.csv`

## Workflow
1. Find the closest matching indicator or concept in `../mospi_indicators_sheet.csv`.
2. Explain in this exact order:
- One-line plain meaning
- Why it matters (one practical reason)
- Simple numeric example (2-3 lines)
- Common confusion with closest related term
- Quick memory trick (one line)
3. Keep language at novice level:
- Avoid unexplained jargon
- Expand acronyms once
- Keep sentences short
4. If multiple matches exist, list up to 3 candidates and explain each in one line before asking which one to continue with.

## Response Template
Use this structure:

`Term:`

`Plain meaning:`

`Why it matters:`

`Mini example:`

`Often confused with:`

`Memory trick:`

## Guardrails
- Do not assume statistical background.
- Do not jump to formulas unless the user asks.
- If the term is absent from the sheet, say so briefly and offer the closest known terms.
