# ADR-0004: Universal and Product-Specific Component Boundary

- Status: Accepted
- Date: 2026-07-24

## Context

Some UI anatomy is reusable across products, while other anatomy exists only
because of a specific domain. Treating both as universal either leaks business
concepts into the base library or forces product teams to rebuild shared
behavior.

## Decision

`@relay/react` owns brand-neutral, domain-neutral components and stable
universal patterns. `@relay/product-access` owns access-management anatomy and
workflows composed from public universal components.

Universal components own semantic DOM, ARIA relationships, keyboard and focus
behavior, interaction state, stable slots, responsive component behavior, and
UI presentation states. They do not own endpoints, authentication, permissions,
server caching, business validation, routing, or domain mutations.

The v0.1 catalogs are frozen in
[`taxonomy.md`](../architecture/taxonomy.md).

## Consequences

- Product language may exist in the product package without contaminating the
  universal API.
- Product components remain reusable across applications with different data
  layers.
- Similar-looking product anatomy is not automatically promoted to the
  universal library.

## Rejected alternatives

- Put all components in `@relay/react`: rejected because access-management
  concepts are not domain-neutral.
- Keep all compositions in applications: rejected because stable product
  anatomy and behavior would be duplicated.
