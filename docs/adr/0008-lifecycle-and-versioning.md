# ADR-0008: Lifecycle and Versioning

- Status: Accepted
- Date: 2026-07-24

## Context

Consumers need to understand API maturity and compatibility risk. Package
versions alone do not communicate whether an individual component is still
being validated.

## Decision

Use the lifecycle `experimental → beta → stable → deprecated → removed`.
All v0.1 components begin as `beta`. Status is recorded in Storybook, generated
knowledge artifacts, and release documentation.

Published packages use semantic versioning and Changesets. User-facing changes
require a Changeset. Breaking changes require migration notes. Lifecycle
promotion is an explicit evidence-based release decision.

## Consequences

- Maturity is visible at the component level.
- Beta does not exempt a component from accessibility or testing requirements.
- Deprecation includes a supported replacement or migration path and a stated
  window before removal.

## Rejected alternatives

- Treat all initial components as stable: rejected because the APIs have not
  demonstrated repeated product use.
- Use package version as the only maturity signal: rejected because exports
  within a package can mature at different rates.
