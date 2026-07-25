# Relay

Relay is a brand-neutral React design system with replaceable themes and a
separate product-composition layer.

The accepted architecture is documented in
[`docs/architecture`](docs/architecture/README.md), with decisions recorded in
[`docs/adr`](docs/adr/README.md).

The production handbook and documentation map live in
[`docs`](docs/README.md). Storybook is the executable system reference, while
the reference application demonstrates application-owned API integration.

## Requirements

- Node.js 22.12 or newer
- pnpm 10.26

## Root commands

```sh
pnpm install
pnpm build
pnpm tokens:build
pnpm tokens:check
pnpm knowledge:build
pnpm knowledge:check
pnpm storybook
pnpm reference
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

Root scripts are the canonical interface for workspace tasks.

## CI/CD and hosted Storybook

GitHub Actions runs the complete production gate for pull requests and `main`:
generated-contract drift checks, formatting, linting, typechecking, unit and
Storybook accessibility/interaction tests, Playwright workflows, builds, and
Changeset validation.

After the gate passes on `main`, the same workflow publishes
`apps/storybook/storybook-static` to GitHub Pages. Changesets also creates or
updates a version pull request; package publishing remains an explicit release
decision and does not require a registry token in CI.

## Documentation surfaces

- `pnpm storybook`: system guidance, complete component contracts, state
  matrices, and executable patterns.
- `pnpm reference`: loading, empty, error, refresh, permission, mutation, and
  responsive integration scenarios.
- [`docs/production-handbook.md`](docs/production-handbook.md): production
  responsibilities and operating guidance.
- [`packages/knowledge/dist`](packages/knowledge/dist): generated AI-readable
  component, token, pattern, constraint, and example contracts.
- [`docs/governance`](docs/governance/README.md): decision ownership,
  lifecycle, versioning, and migration rules.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): contribution and review workflow.
- [`CHANGELOG.md`](CHANGELOG.md): release-level changes and migration notes.
- [`MIGRATIONS.md`](MIGRATIONS.md): durable breaking-change guidance.
