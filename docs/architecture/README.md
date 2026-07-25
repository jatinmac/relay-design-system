# Relay Architecture

Status: **Accepted for v0.1**

This directory is the canonical architecture contract for Relay. `PLAN.md`
describes the intended delivery; these documents define the boundaries that
implementation must obey.

## System shape

Relay is a pnpm/Turborepo monorepo with four ownership layers:

```text
Token contract
├── Brand themes
└── Universal React components
        ↓
Product-specific components
        ↓
Application integration and business logic
```

The repository contains:

```text
apps/
├── storybook/              Documentation and component inspection
└── reference-app/          API integration and production-state demonstrations

packages/
├── tokens/                 Token contract, sources, generation, and validation
├── theme-relay/            Relay implementation of the token contract
├── theme-northstar/        Northstar implementation of the token contract
├── react/                  Brand-neutral, domain-neutral React components
├── product-access/         Access-management product compositions
├── knowledge/              Generated AI-readable contracts and examples
└── tooling/                Shared build, lint, test, and TypeScript configuration
```

## Technology baseline

- React with strict TypeScript.
- pnpm workspaces and Turborepo.
- Vite library builds.
- CSS Modules and CSS custom properties.
- DTCG-compatible token sources with Style Dictionary generation.
- Storybook using its React/Vite integration.
- React Aria utilities for complex accessibility behavior where native HTML is
  insufficient.
- Vitest and React Testing Library for component behavior.
- Playwright for application and keyboard workflows.
- Axe for automated accessibility checks.
- Changesets and GitHub Actions for release governance.

Exact dependency versions will be pinned during scaffolding. Changing one of
these technologies requires an ADR when it changes an architectural boundary;
routine version upgrades do not.

## Fixed architectural decisions

- Code and token files are the source of truth.
- Universal components are brand-neutral and domain-neutral.
- Brand and product are independent axes: themes control visual expression;
  product packages control specialized anatomy and workflows.
- Theme packages implement a common semantic token contract.
- `@relay/react` never imports a concrete theme.
- Design-system packages do not fetch product data or own authentication,
  routing, server caching, or domain mutations.
- Components own ephemeral interaction state. Consumers control reusable UI
  state. Applications own server and business state.
- Accessibility behavior is part of each public component contract.
- Stable patterns may become components; variable patterns remain documented
  recipes.
- Public component APIs express intent rather than visual implementation.
- All v0.1 components begin with `beta` lifecycle status.

## Canonical documents

- [Dependency rules](dependency-rules.md)
- [Taxonomy and v0.1 catalog](taxonomy.md)
- [Public API conventions](public-api-conventions.md)
- [Component lifecycle](component-lifecycle.md)
- [Architecture Decision Records](../adr/README.md)

## Change control

These contracts may be changed only through a new or superseding Architecture
Decision Record. A change that affects a published package API also requires a
Changeset. Generated files must never be edited to introduce architectural
changes.

## Architecture exit gate

Architecture is considered locked for scaffolding when:

- [x] Every package and application has one stated owner and responsibility.
- [x] Allowed and forbidden dependency directions are explicit.
- [x] The eight universal families and one product pattern are frozen.
- [x] Theme activation does not couple React components to a brand.
- [x] UI, product, and server state ownership is explicit.
- [x] Token layers and naming rules are defined.
- [x] Public API and CSS boundary conventions are defined.
- [x] Lifecycle states have entry and exit expectations.
- [x] Authored and generated sources are identified.
- [x] Accepted ADRs record the structural decisions.
