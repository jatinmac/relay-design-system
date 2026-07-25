# ADR-0009: Styling and Responsive Boundaries

- Status: Accepted
- Date: 2026-07-24

## Context

Theme leakage, selector coupling, and viewport-only responsiveness would make
universal components difficult to embed in varied application layouts.

## Decision

Use CSS Modules for component styles and cascade layers ordered as reset,
tokens, base, components, and utilities. Components consume semantic `--ds-*`
variables and expose no internal CSS classes as public API.

Use logical properties for bidirectional layout. Use container queries for
component-level adaptation and viewport breakpoints only for application or
page-level layout. Support reduced motion through semantic tokens and media
preferences.

## Consequences

- Components respond to their available container rather than assumptions about
  the viewport.
- Consumer overrides occur through documented props, slots, and tokens.
- Visual tests must include representative containers, themes, modes, and
  densities.

## Rejected alternatives

- Global component class names: rejected because they create collision and
  override risk.
- Viewport queries for all responsiveness: rejected because components may be
  embedded in narrow regions on wide screens.
- Raw values in component CSS: rejected because they bypass themes and density.
