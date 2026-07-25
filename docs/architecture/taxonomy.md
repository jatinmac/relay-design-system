# Taxonomy and v0.1 Catalog

Status: **Accepted for v0.1**

Relay names artifacts by responsibility. Atomic Design terms may be discussed
for comparison, but `atom`, `molecule`, and `organism` are not package or
component classifications.

## Canonical hierarchy

### Foundation

Design decisions expressed through tokens and global rules: color, typography,
space, size, border, radius, elevation, motion, density, focus, and responsive
breakpoints.

Foundations do not render product UI.

### Behavioral primitive

Reusable implementation behavior such as focus management, field-description
relationships, collection selection, or visually hidden content.

Behavioral primitives are internal to their owning package by default. They
become public only after a separate consumer-facing use case and API review.

### Universal component

A public, brand-neutral and domain-neutral UI building block with stable
semantics and interaction behavior. Examples include `Button`, `Checkbox`, and
`Dialog`.

### Universal UI pattern

A stable, reusable composition of universal components with shared interaction
or accessibility requirements. Examples include `FormField` and `StatePanel`.
Patterns with a stable API may be exported from `@relay/react`.

### Product-specific component

A component whose anatomy or language belongs to a product domain but which
remains independent of API clients and application infrastructure.
`AccessManagementPage` is the v0.1 example.

### Product workflow

A domain-specific sequence and decision model involving permissions, recovery,
or mutations. It may be expressed through product components and documentation,
but its server orchestration remains application-owned.

### Application feature

An application-owned implementation containing routing, authentication,
permissions resolution, API clients, server caching, mutations, or product
navigation.

## When a pattern becomes code

A repeated pattern becomes a coded component only when it has:

- A repeated and consistent purpose.
- Stable anatomy.
- Bounded variations.
- Shared interaction or accessibility requirements.
- A public API without business-specific leakage.

A pattern remains a documented recipe when its decision model is reusable but
its structure varies materially between products. API calls, routing, server
state, and business rules never become universal UI patterns.

## Frozen v0.1 universal catalog

The v0.1 scope contains eight universal component families:

| Family             | Public exports           | Classification                  |
| ------------------ | ------------------------ | ------------------------------- |
| Layout             | `Stack`                  | Universal component             |
| Actions            | `Button`, `IconButton`   | Universal components            |
| Fields             | `FormField`, `TextField` | Universal pattern and component |
| Selection          | `Checkbox`               | Universal component             |
| Status             | `Badge`                  | Universal component             |
| State presentation | `StatePanel`             | Universal pattern               |
| Overlay            | `Dialog`                 | Universal component             |
| Collection         | `DataTable`              | Universal component             |

The family count is eight even though a family may contain multiple public
exports. All are `beta` in v0.1.

No additional public universal component will be added during v0.1 unless an
existing family cannot meet its accessibility contract without it. Any such
addition requires an ADR amendment.

## Frozen v0.1 product catalog

`@relay/product-access` exports one coded product pattern:

- `AccessManagementPage`

It composes universal components and accepts data, permissions, state, and
callbacks. It does not fetch, cache, authenticate, route, or mutate server data
directly.

## Intentionally documented recipe

A page header with search, filters, and actions will initially remain a
documented composition recipe rather than a component. Its purpose is reusable,
but action count, filtering anatomy, navigation context, and responsive
priorities are not yet stable enough for a durable public API.

## Naming conventions

- Components and exported types use `PascalCase`.
- Hooks use `useCamelCase`.
- Files follow their primary export, for example `DataTable.tsx`.
- Colocated styles use `<Export>.module.css`.
- Colocated unit tests use `<Export>.test.tsx` or `<Export>.test.ts`.
- Story files use `<Export>.stories.tsx`.
- Props describe semantic intent, such as `tone="critical"`.
- Names that expose a concrete color, shape, thickness, or brand are forbidden
  in universal public APIs.
- Product components may use domain language when it accurately describes their
  responsibility.
