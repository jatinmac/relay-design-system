# ADR-0002: Code and Tokens Are the Source of Truth

- Status: Accepted
- Date: 2026-07-24

## Context

Relay needs consistent human documentation, generated CSS, typed token exports,
and AI-readable contracts. Maintaining these independently would allow them to
drift.

## Decision

TypeScript public declarations and DTCG-compatible token sources are the
machine-readable sources of truth. Architecture and usage decisions are
authored in Markdown. CSS variables, typed token exports, parity reports, API
reference, and AI manifests are generated deterministically from those sources.

Generated artifacts are checked for clean diffs in CI and are never edited
manually. Design-tool synchronization is outside v0.1 scope.

## Consequences

- Documentation and machine-readable knowledge can be validated against code.
- Generator behavior becomes release-critical and requires tests.
- Contributors must modify the source contract rather than generated output.

## Rejected alternatives

- Storybook prose as the API source: rejected because it cannot reliably
  generate or validate TypeScript contracts.
- A design tool as source of truth: rejected for v0.1 because synchronization
  and conflict resolution add a separate ownership system.
