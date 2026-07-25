# Public API Conventions

Status: **Accepted for v0.1**

These conventions apply to publishable Relay packages.

## Public surface

An API is public when it is available through a package export map. Public APIs
include exported components, functions, hooks, types, CSS entry points, stable
provider attributes, and documented token names.

The following are internal:

- Source paths not present in an export map.
- CSS Module class names.
- Undocumented DOM nesting.
- Behavioral primitives not explicitly exported.
- Test utilities unless exposed through a dedicated testing entry point.
- Generated implementation details not included in a published contract.

Consumers must not target internal classes or DOM structure.

## Props and variants

- Props express semantic intention, never visual implementation.
- Prefer composition and named slots over boolean-heavy configuration.
- Use discriminated unions for mutually exclusive states.
- Use required accessible labels in types when the label cannot be inferred
  from visible content.
- Native element props may be extended when doing so preserves semantics and
  does not create conflicting Relay props.
- Variants must have a clear behavioral or semantic purpose.
- Defaults must be documented and consistent across component families.

Examples:

```tsx
<Badge tone="critical">Suspended</Badge>
<Button variant="primary">Invite member</Button>
```

The following are not valid universal APIs:

```tsx
<Badge color="red">Suspended</Badge>
<Button rounded shadow="large">Invite member</Button>
```

## Controlled state

Reusable externally meaningful state is controlled. Ephemeral interaction state
may remain internal.

- A controlled value and its change callback are named as a pair.
- Domain-neutral controls use familiar React naming where practical.
- Domain components use domain-specific callback names that describe outcomes.
- Callbacks do not expose internal DOM structure unless the native event is
  genuinely part of the contract.
- Components do not duplicate controlled props into synchronized local state.

`Dialog` uses controlled open state. `DataTable` receives sorting and selection
state with corresponding change callbacks. `AccessManagementPage` receives
product state and mutation callbacks from its application container.

## Provider contract

The baseline provider contract is:

```ts
type ColorMode = 'light' | 'dark' | 'system';
type Density = 'comfortable' | 'compact';

interface DesignSystemProviderProps {
  theme: string;
  colorMode?: ColorMode;
  density?: Density;
  children: React.ReactNode;
}
```

`theme` deliberately remains an open string so a new conforming theme does not
require a release of `@relay/react`. Empty names are rejected. `colorMode`
defaults to `system`, `density` defaults to `comfortable`, and system-mode
resolution remains in CSS so server and client markup stay identical.

## Collection state

Collections model mutually exclusive states with a discriminated union:

```ts
type CollectionState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string; onRetry?: () => void }
  | { status: 'empty'; emptyState?: React.ReactNode }
  | { status: 'ready'; items: T[]; refreshing?: boolean };
```

This is the baseline contract for `DataTable`. More detailed row, sorting, and
selection types will be finalized with executable component tests rather than
being frozen speculatively.

## Accessibility contract

Accessibility is part of the API:

- Interactive components use semantic elements whenever possible.
- Required names, labels, and descriptions cannot be omitted silently.
- Keyboard behavior follows the relevant WAI-ARIA interaction pattern.
- Focus placement, trapping, dismissal, and restoration are component-owned
  where the behavior is intrinsic to the component.
- Disabled, read-only, invalid, loading, and pending semantics are distinct.
- Color is not the sole means of communicating state.
- Reduced-motion behavior is supported by default.

A public API that makes correct accessible usage impractical is considered an
API defect.

## Styling contract

- Component styles use CSS Modules.
- Component CSS consumes `--ds-*` semantic or approved component variables.
- Raw color, spacing, radius, and motion values are prohibited.
- Logical properties are preferred for bidirectional layout.
- Container queries handle component-level responsiveness.
- Viewport queries are reserved for application/page layout.
- Public customization occurs through documented props, slots, and token
  contracts—not internal selectors.
- Brand assets remain outside universal components.

## Exports and compatibility

- Packages expose explicit export maps.
- Public types are exported alongside their components.
- Internal helpers are not re-exported for convenience.
- User-facing package changes require a Changeset.
- Breaking changes require migration notes.
- All v0.1 component exports carry `beta` lifecycle metadata in documentation
  and generated knowledge artifacts.

## Source and generation policy

Authored sources of truth:

- TypeScript component and public type declarations.
- DTCG-compatible token source files.
- Theme token mappings.
- Markdown architecture, ADR, and usage documentation.
- Test and story source files.

Generated artifacts:

- CSS custom properties.
- Typed token exports.
- Token parity reports.
- AI-readable component, token, and pattern manifests.
- Generated API reference derived from public declarations.

Generated artifacts are reproducible and checked for clean diffs in CI. They are
never edited manually.
