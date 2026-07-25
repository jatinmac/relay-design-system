# ADR-0001: Package Boundaries and Dependency Direction

- Status: Accepted
- Date: 2026-07-24

## Context

Relay must support independently evolving tokens, brands, universal components,
product compositions, and applications. Allowing imports to follow convenience
rather than ownership would couple these layers and make reuse unreliable.

## Decision

Use the package structure and allowlist dependency model defined in
[`dependency-rules.md`](../architecture/dependency-rules.md).

Dependencies flow from token contracts to themes and universal components, then
from universal components to product components, and finally to applications.
Packages import one another only through declared public exports. Tooling is a
development-only dependency.

## Consequences

- Package manifests, export maps, TypeScript references, and lint rules can
  enforce ownership.
- Applications can replace their integration layer without package changes.
- Some convenient deep imports and cross-package test shortcuts are forbidden.
- New dependency edges require an architecture review.

## Rejected alternatives

- A single package: rejected because brand, component, and product changes have
  different ownership and release boundaries.
- Unrestricted workspace imports: rejected because directory layout alone does
  not prevent architectural coupling.
