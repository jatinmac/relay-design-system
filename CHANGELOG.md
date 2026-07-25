# Changelog

Relay uses Changesets for package release notes. This file records system-level
milestones and migration guidance.

## Unreleased

### Added

- Primitive and semantic token generation with Relay and Northstar theme
  implementations.
- `DesignSystemProvider` with brand, light/dark/system mode, and
  comfortable/compact density.
- Eight beta universal component families in `@relay/react`.
- Beta `AccessManagementPage` product pattern in `@relay/product-access`.
- Deterministic reference application covering production request, permission,
  mutation, content, and responsive states.
- Complete Storybook system handbook, component contracts, product state
  matrix, and documented filter/query recipe.
- Production handbook and contribution workflow.
- Storybook Chromium interaction tests with representative axe enforcement.
- Playwright production-state and keyboard workflows plus cross-brand,
  light/dark, density, and responsive visual baselines.
- Production verification matrix and manual keyboard release checklist.
- Generated `@relay/knowledge` component, token, pattern, constraint, and
  type-checked example artifacts with public-export drift validation.
- Governance documentation for decision ownership, semantic versioning,
  lifecycle transitions, Changesets, exceptions, and breaking migrations.

### Compatibility

All v0.1 public components remain beta. Breaking changes require a Changeset and
migration note.
