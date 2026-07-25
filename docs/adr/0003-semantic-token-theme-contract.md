# ADR-0003: Semantic Token Contract and Replaceable Themes

- Status: Accepted
- Date: 2026-07-24

## Context

Universal components must support Relay, Northstar, and future brands without
brand-specific component logic or APIs.

## Decision

Use primitive, semantic, and optional component token layers. Theme packages
provide complete light and dark implementations of the same semantic contract.
Universal component CSS consumes only `--ds-*` semantic or approved component
variables.

Applications load concrete theme CSS. `DesignSystemProvider` exposes stable
theme, color-mode, and density attributes but does not map theme names to token
values. The `theme` prop remains an open string.

## Consequences

- A new conforming theme can be added without releasing `@relay/react`.
- Contract parity must be validated during token generation.
- Theme packages must implement the full contract even when a value aliases
  another value.
- Raw visual values in universal component CSS are invalid.

## Rejected alternatives

- Theme-specific React providers: rejected because they couple component logic
  to a brand.
- Brand names in component props: rejected because brand and UI intent are
  separate axes.
- Runtime JavaScript token objects for styling: rejected as the primary styling
  mechanism because CSS custom properties support nested theming and modes
  without component rerenders.
