# ADR-0007: Coded Components and Documented Recipes

- Status: Accepted
- Date: 2026-07-24

## Context

Turning every repeated layout into a component creates brittle configuration
APIs. Leaving stable interaction patterns as prose causes inconsistent and
inaccessible reimplementation.

## Decision

A pattern becomes coded only when it has a repeated purpose, stable anatomy,
bounded variations, shared interaction or accessibility requirements, and a
public API without business leakage.

Patterns with reusable decisions but materially variable structure remain
documented recipes. A page header with search, filters, and actions is the
intentional v0.1 recipe. Business logic, API calls, and routing remain
application features.

## Consequences

- Component count is not a success metric.
- Recipes must still include decision rules, accessibility guidance, responsive
  behavior, error recovery, and examples.
- Promotion from recipe to component requires evidence of stable repeated use.

## Rejected alternatives

- Componentize every repeated composition: rejected because superficial visual
  similarity does not establish a stable contract.
- Document all patterns without code: rejected because stable shared behavior
  would be duplicated.
