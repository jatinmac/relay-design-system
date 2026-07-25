# ADR-0006: Accessibility Behavior Is Public API

- Status: Accepted
- Date: 2026-07-24

## Context

Semantic structure, labels, keyboard behavior, and focus management determine
whether a component is usable. Treating them as implementation details lets
consumer usage break accessibility guarantees.

## Decision

WCAG 2.2 AA is the baseline. Required labels, semantic roles, ARIA
relationships, keyboard interactions, focus placement and restoration,
disabled/read-only/invalid distinctions, and reduced-motion behavior are part
of component contracts.

Public types require accessible names when they cannot be obtained from visible
content. Components use semantic HTML first and approved accessibility
utilities for complex behavior. Automated axe checks must report no serious or
critical violations; manual keyboard review remains required for complex
patterns.

Selected AAA criteria may be documented, but Relay does not claim blanket AAA
compliance.

## Consequences

- Accessibility changes may be public behavioral changes.
- Tests must cover more than rendered appearance.
- Some low-level implementation choices are constrained by established
  interaction patterns.

## Rejected alternatives

- Leave accessibility entirely to consumers: rejected because intrinsic
  component behavior cannot be repaired reliably from outside.
- Rely on automated checks alone: rejected because they cannot validate full
  keyboard and focus workflows.
