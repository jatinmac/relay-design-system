# Relay v0.1 — One-Day, Fully Coded React Design System Plan

## 1. Summary and fixed decisions

Build a production-shaped vertical slice of a React design system in one 12-hour day. The goal is not a large component count; it is to demonstrate the architecture, documentation and engineering quality expected in a production design-system role.

Fixed decisions:

- React and TypeScript only.
- Code and token files are the source of truth.
- Brand-neutral universal components with replaceable brand themes.
- Relay is the primary brand theme.
- Northstar is a contrasting validation theme proving the components are not Relay-dependent.
- Light/dark modes and comfortable/compact density.
- Universal components and product-specific components live in separate packages.
- Components never fetch product data directly.
- A reference application demonstrates real API conditions through an application-owned mock API layer.
- WCAG 2.2 AA is the baseline; selected AAA criteria are documented without claiming blanket AAA compliance.
- All v0.1 components begin with `beta` lifecycle status.
- Semantic versioning, Changesets and GitHub Actions provide the release workflow.
- No design-tool synchronization is included.

Success means a clean checkout can install, build, test and run Storybook; every component works across both brands and modes; the product pattern handles loading, empty, error, permission and mutation states; and both humans and AI agents can understand how to use the system.

## 2. Target system and public interfaces

### Package architecture

```text
apps/
├── storybook/              System documentation and component inspection
└── reference-app/          Production-state and API-integration demonstration

packages/
├── tokens/                 Token contract, source tokens and generation
├── theme-relay/            Primary Relay brand implementation
├── theme-northstar/        Contrasting brand-agnostic validation theme
├── react/                  Universal React components
├── product-access/         Product-specific access-management components
├── knowledge/              AI-readable contracts, rules and examples
└── tooling/                Shared TypeScript, lint, test and build configuration
```

Use pnpm workspaces, Turborepo, Vite library builds, CSS Modules, CSS custom properties, Style Dictionary, Storybook React/Vite, React Aria for complex accessibility behavior, Vitest, React Testing Library, Playwright and axe.

### Component hierarchy

```text
Foundations
→ Behavioral primitives
→ Universal components
→ Universal UI patterns
→ Product-specific components
→ Product workflows
→ Application features
```

Atomic Design terminology can be explained in documentation, but package and component names use responsibility rather than `atom`, `molecule` or `organism`.

#### Universal component layer: `@relay/react`

- `Stack`
- `Button` and `IconButton`
- `TextField` and `FormField`
- `Checkbox`
- `Badge`
- `StatePanel`
- `Dialog`
- `DataTable`

Universal components own:

- Semantic DOM structure
- ARIA relationships
- Keyboard and focus behavior
- Interaction state
- Stable slots and public APIs
- Responsive component behavior
- Loading, disabled, invalid and other UI presentation states

They do not own:

- API endpoints
- Authentication or permissions
- Server caching
- Business validation
- Product routing
- Domain mutations

Important public contracts:

```ts
type ColorMode = "light" | "dark" | "system";
type Density = "comfortable" | "compact";

interface DesignSystemProviderProps {
  theme: string;
  colorMode?: ColorMode;
  density?: Density;
  children: React.ReactNode;
}
```

The open `theme` string allows additional theme packages without changing `@relay/react`.

```ts
type CollectionState<T> =
  | { status: "loading" }
  | { status: "error"; message: string; onRetry?: () => void }
  | { status: "empty"; emptyState?: React.ReactNode }
  | { status: "ready"; items: T[]; refreshing?: boolean };
```

`DataTable` consumes this discriminated union so impossible combinations such as simultaneous loading and error states cannot be passed.

Core API intent:

| Component | Primary interface |
|---|---|
| `Stack` | `as`, `direction`, `gap`, `align`, `justify`, `wrap` |
| `Button` | `variant`, `size`, `loading`, `disabled`, icons |
| `IconButton` | Button behavior plus required accessible label |
| `TextField` | Label, value, hint, error, required, disabled, read-only and type |
| `Checkbox` | Checked, indeterminate, label, description, disabled and required |
| `Badge` | Semantic `tone`, never raw brand color names |
| `StatePanel` | Loading, empty, no-results, error and no-access presentations |
| `Dialog` | Controlled open state, title, description, size, dismissal and footer |
| `DataTable` | Typed rows/columns, collection state, sorting, selection and actions |

Public props express semantic intention—`primary`, `critical`, `invalid`—rather than visual implementation such as `blue`, `rounded` or `thickBorder`.

### Product-specific layer: `@relay/product-access`

Implement one coded product pattern:

```tsx
<AccessManagementPage
  collection={memberCollection}
  permissions={permissions}
  selection={selection}
  sort={sort}
  inviteState={inviteState}
  onSelectionChange={setSelection}
  onSortChange={setSort}
  onInviteMember={inviteMember}
  onChangeRole={changeRole}
  onRemoveMember={removeMember}
/>
```

It composes universal components into a product-specific structure but remains API-client agnostic.

The reference application owns the integration container:

```text
Mock HTTP API
→ application query/mutation hooks
→ AccessManagementContainer
→ AccessManagementPage
→ universal components
```

Use a small mock API and application data adapter to demonstrate:

- Initial loading
- Successful data
- Empty response
- Request error and retry
- Background refresh
- Pending mutation
- Failed mutation
- Duplicate-submission prevention
- Restricted permissions
- Long and incomplete data
- Optimistic update behavior

Neither `@relay/react` nor `@relay/product-access` imports the mock API or application data library.

### Brand architecture

The token system has three levels:

```text
Primitive values
→ Semantic contracts
→ Optional component tokens
```

Naming examples:

```text
color.blue.600
color.background.canvas
color.text.primary
color.action.primary.background.default
component.button.primary.background.hover
```

Generated CSS uses a consistent `--ds-` namespace.

`@relay/theme-relay` defines Relay’s:

- Color palette
- Typography
- Radius and border character
- Elevation
- Icon treatment
- Motion personality
- Light and dark mappings

`@relay/theme-northstar` supplies different colors, typography, shape, elevation and motion while satisfying the same semantic contract.

The React package consumes only semantic variables:

```css
.buttonPrimary {
  color: var(--ds-color-action-primary-label);
  background: var(--ds-color-action-primary-background-default);
  border-radius: var(--ds-radius-control);
}
```

Brand assets such as logos and illustrations remain outside universal components. Product-specific anatomy is allowed in the product package, but its appearance still comes from the active theme.

### UI-pattern policy

A repeated pattern becomes coded when it has:

- A repeated and consistent purpose
- Stable anatomy
- Bounded variations
- Shared interaction or accessibility requirements
- A clear API without business-specific leakage

Examples include `StatePanel`, `FormField`, page headers, filter bars and confirmation dialogs.

Patterns remain documented recipes when their decision model is reusable but their structure varies too much. Business logic, API calls and routing remain application features.

## 3. One-day implementation sequence

### 0:00–0:20 — Lock the architecture and taxonomy

Create the package boundaries, dependency direction, naming rules, component maturity model and ADR list.

Why first: package and ownership mistakes become expensive once component code and imports exist.

Exit gate:

- Universal, product, brand and application responsibilities are written down.
- Dependency direction permits only downward imports.
- The eight universal families and one product pattern are frozen.

### 0:20–2:40 — Scaffold the monorepo and build tokens/themes

- Configure pnpm, Turborepo, TypeScript, Vite and shared tooling.
- Author DTCG-compatible primitive and semantic token JSON.
- Generate CSS custom properties and typed TypeScript token exports.
- Implement Relay and Northstar themes with complete light/dark mappings.
- Add comfortable/compact density, focus, status and reduced-motion tokens.
- Define breakpoint tokens at 30rem, 48rem, 64rem and 80rem.
- Add token parity and missing-variable validation.

Why now: every later visual decision must use validated semantic contracts rather than accumulating raw CSS values.

Exit gate:

- Token generation is deterministic.
- Both brands satisfy the same contract.
- Theme, mode and density switches work without React component changes.

### 2:40–3:20 — Create the styling and provider foundation

- Implement `DesignSystemProvider`.
- Establish cascade layers: reset, tokens, base, components and utilities.
- Add typography defaults, focus treatment, logical properties and reduced motion.
- Use container queries for component-level responsiveness and viewport breakpoints only for page-level layout.
- Prohibit consumers from depending on internal CSS classes or DOM selectors.

Why here: components need a stable styling, theme and focus environment before implementation.

### 3:20–7:30 — Build universal components in dependency order

Build each component with code, types, state matrix and initial Storybook story:

1. `Stack` — 3:20–3:40  
2. `Button` and `IconButton` — 3:40–4:20  
3. `TextField` and `FormField` — 4:20–5:00  
4. `Checkbox` — 5:00–5:25  
5. `Badge` — 5:25–5:45  
6. `StatePanel` — 5:45–6:10  
7. `Dialog` — 6:10–6:45  
8. `DataTable` — 6:45–7:30  

Build order follows dependency and complexity: layout first, then controls, state presentation, overlays and finally the enterprise composite.

Required production states include:

- Default, hover, active and focus-visible
- Disabled and read-only
- Loading and pending
- Empty and no-results
- Invalid and server error
- Indeterminate selection
- Long, missing and localized content
- Responsive overflow
- Reduced motion
- Keyboard-only operation

### 7:30–8:40 — Build the product layer and integration demonstration

- Implement `AccessManagementPage` in `@relay/product-access`.
- Build the application-owned integration container.
- Add deterministic mock HTTP scenarios for every production state.
- Demonstrate sorting, selection, invitation, role changes, removal and retry.
- Add narrow, medium and wide responsive layouts.
- Ensure permission restrictions remove or disable actions with an explanation.
- Test both Relay and Northstar without changing component code.

Why now: the product composition validates whether the universal components actually work together under real asynchronous and domain conditions.

### 8:40–9:50 — Complete Storybook and production documentation

Create system documentation for:

- Getting started
- Principles and architecture
- Brand versus product responsibilities
- Token taxonomy and naming
- Themes, color and density
- Typography
- Layout and responsiveness
- Motion and reduced motion
- Accessibility
- Universal components
- Product-specific components
- Coded and documented patterns
- API-integration boundaries
- Testing strategy
- Contribution workflow
- Versioning and lifecycle
- AI-agent usage
- Changelog

Every component page must contain:

- Status and purpose
- When to use and avoid
- Anatomy and hierarchy
- Public API and slots
- Variants and state matrix
- Interaction and keyboard behavior
- Accessibility requirements
- Responsive behavior
- Token dependencies
- Integration responsibilities
- Edge cases and limitations
- Executable examples
- Test coverage and changelog

Pattern documentation additionally explains the problem, sequence, decision rules, error recovery, permissions and when the pattern should remain a recipe instead of becoming a component.

### 9:50–11:20 — Verify production behavior

- Add Vitest and React Testing Library unit tests.
- Add Storybook interaction tests.
- Run axe against representative stories.
- Add Playwright keyboard and reference-application flows.
- Add visual snapshots for both brands, light/dark modes and key responsive sizes.
- Validate token generation and theme-contract parity.
- Test long labels, empty data, server failures, pending mutations and restricted permissions.
- Perform a manual keyboard pass based on relevant WAI-ARIA interaction patterns.

Why before release tooling: the architecture is only credible when state, accessibility and theme claims are executable.

### 11:20–12:00 — Add AI knowledge, governance and CI/CD

Generate `@relay/knowledge` artifacts from component and token contracts:

- `components.json`
- `tokens.json`
- `patterns.json`
- `constraints.md`
- `examples/*.tsx`
- AI usage instructions describing allowed dependencies, props and composition rules

Configure GitHub Actions to run:

1. Install and cache
2. Token generation and clean-diff validation
3. Lint and typecheck
4. Unit and interaction tests
5. Accessibility tests
6. Playwright tests
7. Package and Storybook builds
8. Changeset validation

Add semantic versioning, Changesets and lifecycle states:

```text
experimental → beta → stable → deprecated → removed
```

Document migration notes for breaking changes and mark all v0.1 components as `beta`.

## 4. Test plan and definition of done

Required test scenarios:

- Every universal component renders in Relay and Northstar.
- Both brands support light/dark and comfortable/compact modes.
- Missing semantic tokens fail validation.
- React component CSS contains no unapproved raw color, spacing, radius or motion values.
- Button loading prevents duplicate activation.
- Text fields expose correct label, hint and error relationships.
- Checkbox supports keyboard and indeterminate behavior.
- Dialog manages initial focus, trapping, Escape dismissal and focus restoration.
- DataTable handles loading, empty, error, ready, refreshing, sorting and selection.
- Access management handles request and mutation failures without importing API logic into design-system packages.
- Keyboard-only workflows remain complete.
- Automated accessibility tests report no serious or critical violations.
- Reduced-motion mode suppresses nonessential animation.
- Layout works at narrow, medium and wide containers.
- AI manifests match the exported TypeScript APIs.
- A clean install can build packages and Storybook without manual intervention.

Definition of done:

- Eight universal component families are implemented, exported and documented.
- One coded product-specific pattern is implemented.
- At least one documented composition pattern remains intentionally non-componentized.
- Two visually different brands work without changing component structure.
- Production integration states are visible and testable in the reference application.
- Component, pattern, system and AI documentation are complete.
- CI, lifecycle metadata and release configuration are present.
- No placeholder components, unfinished stories or undocumented public APIs remain.

## 5. Architectural thinking behind Relay

Relay follows a directed dependency model:

```text
Token contract
├── Brand themes
└── Universal React components
        ↓
Product-specific components
        ↓
Application integration and business logic
```

Core architectural rules:

- **Brand and product are different axes.** Brand controls visual expression; product requirements control specialized anatomy and workflows.
- **The base is neutral but opinionated.** Universal components remain brand-neutral while enforcing correct semantics, accessibility and interaction.
- **Structure follows function.** Brands normally share component anatomy. A product-specific component may introduce new anatomy when its domain requires it.
- **Semantic tokens are contracts.** Components reference meaning, not Relay palette values.
- **State ownership is explicit.** Components own ephemeral interaction state; consumers control reusable UI state; applications own server and business state.
- **No design-system network calls.** API clients, authentication, caching and mutations stay in application containers or optional integration adapters.
- **Production readiness means integration resilience.** Components support the loading, error, empty, pending, permission, overflow and concurrency conditions created by real systems.
- **Composition is preferred over prop explosion.** Stable optional regions become slots; substantially different anatomy becomes a separate component.
- **Patterns have two forms.** Stable implementation becomes coded; reusable guidance with variable structure remains documented.
- **Accessibility is part of the API.** Required labels, keyboard behavior, focus rules and ARIA relationships cannot be optional styling details.
- **Documentation is a system interface.** Storybook serves designers, engineers, QA and product teams; generated manifests serve AI coding agents.
- **Packages follow change boundaries.** Themes can change without rebuilding component logic, product components can evolve without contaminating the universal library, and applications can replace their data layer independently.
- **A second brand is an architectural test.** Northstar exists to prove that Relay-specific visual decisions have not leaked into universal component APIs or structure.
