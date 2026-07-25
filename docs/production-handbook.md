# Relay Production Handbook

Status: **v0.1 beta**

This handbook is the production-facing companion to executable Storybook
documentation. Architecture contracts and accepted decisions remain canonical
in [`architecture`](architecture/README.md) and [`adr`](adr/README.md).

## Getting started

Use Node.js 22.12 or newer and pnpm 10. Install and build from the repository
root:

```sh
pnpm install
pnpm tokens:build
pnpm build
pnpm storybook
```

Import a theme, React component styles, and `DesignSystemProvider`. Applications
choose brand, color mode, and density without changing component props.

## Principles and architecture

Relay follows one dependency direction:

```text
Token contract
├── Brand themes
└── Universal React components
        ↓
Product-specific components
        ↓
Application integration and business logic
```

Code and token sources are authoritative. Accessibility is public API.
Composition precedes prop expansion, and state ownership is explicit.

## Brand versus product responsibilities

Themes own color, typography, shape, elevation, icon treatment, motion, and
light/dark mapping. Product packages own stable domain anatomy and terminology.
Applications own authentication, routing, API calls, caching, permissions,
business validation, analytics, persistence, optimistic updates, and rollback.

Universal components remain brand-neutral and product-neutral. Product
components remain API-client agnostic and consume the same semantic tokens.

## Token taxonomy and naming

Tokens progress from primitive scales to semantic contracts and optional
component tokens:

```text
color.blue.600
→ color.action.primary.background.default
→ component.button.primary.background.hover
```

Generated CSS uses `--ds-`. Component CSS must not contain raw color, spacing,
radius, shadow, or motion values. Public props describe intent rather than
appearance.

## Themes, color, and density

Relay is the primary theme. Northstar implements the same contract with visibly
different color, typography, shape, elevation, and motion to prove structural
neutrality. Both support light/dark modes and comfortable/compact density.

Foreground/background pairs, status states, disabled states, and focus
indicators require contrast validation. Meaning cannot depend on color alone.

## Typography

Themes provide display, body, and monospace families. Semantic size,
line-height, and weight tokens keep hierarchy consistent while allowing brand
expression. Interfaces must tolerate text zoom, localization, missing values,
and long unbroken identifiers.

## Layout and responsiveness

`Stack` owns one-dimensional component layout. Universal components own
intrinsic sizing and local overflow. Product components may use container
queries for their anatomy. Applications own page-shell breakpoints and
navigation.

Tables preserve semantic table structure inside a named, keyboard-focusable
horizontal scroll region. Responsive adaptation must not reorder the visual
experience against DOM order.

## Motion and reduced motion

Use semantic fast, normal, and slow durations with standard or emphasized
easing. Motion communicates state or spatial change; it is not decoration by
default. The reduced-motion contract makes transitions effectively immediate
while retaining necessary loading communication.

## Accessibility

WCAG 2.2 AA is the baseline. Relay does not claim blanket AAA compliance.
Components use semantic HTML, visible focus, keyboard operation, accessible
names/descriptions, and suitable live regions. Dialogs trap focus and restore it
to the trigger. Representative axe checks must have no serious or critical
violations.

Consumers remain responsible for meaningful localized labels, logical page
focus order, product-appropriate announcements, and accessible content.

## Universal components

`@relay/react` contains eight families:

- `Stack`
- `Button` and `IconButton`
- `FormField` and `TextField`
- `Checkbox`
- `Badge`
- `StatePanel`
- `Dialog`
- `DataTable`

Their complete status, usage, anatomy, API, states, interaction, accessibility,
responsive behavior, tokens, integration responsibilities, limitations,
examples, tests, and changelog appear in `Documentation/Components`.

## Product-specific components

`@relay/product-access` contains `AccessManagementPage`. It owns access workflow
anatomy, invitation form presentation, permission explanation, role/removal
controls, selection summary, and accessible copy. It receives all reusable
state and domain callbacks from the application.

## Coded and documented patterns

A repeated pattern becomes code when purpose, anatomy, variation, interaction,
and API are stable. Guidance remains a recipe when sequence, content, server
behavior, or responsive structure differs substantially across products.

`AccessManagementPage` is coded. The
[filter, query, and results pattern](patterns/filter-query-results.md) remains a
recipe.

## API-integration boundaries

The reference flow is:

```text
Mock HTTP API
→ application query/mutation hooks
→ AccessManagementContainer
→ AccessManagementPage
→ universal components
```

The application maps HTTP and server state into component contracts. Neither
`@relay/react` nor `@relay/product-access` imports fetch, SWR, endpoints,
authentication, or routes.

## Testing strategy

Tests follow ownership:

- Token generation and theme-contract parity.
- Colocated Vitest and React Testing Library component behavior.
- Storybook examples and interaction coverage across theme globals.
- Playwright workflows and visual snapshots in the owning application.
- Axe checks for representative component and product states.

Required coverage includes keyboard/focus behavior, loading, empty, errors,
disabled/read-only, permissions, mutation failure, long content, reduced
motion, responsive overflow, both brands, both modes, and both densities.

The executable commands, visual-baseline policy, and human keyboard release
check are defined in
[`docs/testing/production-verification.md`](testing/production-verification.md).

## Contribution workflow

Start by selecting the correct ownership layer. A component change includes
implementation, colocated tests, Storybook states, accessibility and responsive
notes, API documentation, and a Changeset. Architectural changes require an
ADR. See [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Versioning and lifecycle

Lifecycle progresses through `experimental → beta → stable → deprecated →
removed`. All v0.1 components are beta. Public packages use semantic versioning
and Changesets. Breaking changes require migration guidance even before the
first stable release.

## AI-agent usage

Agents must inspect `AGENTS.md`, TypeScript exports, token sources, Storybook,
and tests before editing. Generated `@relay/knowledge` artifacts provide
machine-readable components, tokens, patterns, constraints, and type-checked
examples. Agents import only documented APIs, consume semantic tokens, preserve
ownership boundaries, and never invent props or place network logic in
design-system packages.

Run `pnpm knowledge:check` after changes to public exports, props, tokens,
patterns, examples, or lifecycle metadata.

## Changelog

Release-level additions, changes, deprecations, removals, and migrations live in
[`CHANGELOG.md`](../CHANGELOG.md). Package-facing public changes also require a
Changeset.
