# Contributing to Relay

## Choose ownership first

- Tokens define shared semantic decisions.
- Theme packages implement the token contract.
- `@relay/react` owns universal, brand-neutral behavior.
- Product packages own stable domain compositions.
- Applications own API, authentication, routing, cache, and business state.
- Variable compositions remain documented recipes.

Changes that alter these boundaries require an ADR.

## Implement a component change

1. Define intent-oriented TypeScript API and lifecycle status.
2. Implement with strict TypeScript, CSS Modules, and semantic `--ds-*` tokens.
3. Add colocated behavior and accessibility tests.
4. Add Storybook state matrices and complete component documentation.
5. Verify Relay/Northstar, light/dark, comfortable/compact, long content,
   reduced motion, and responsive overflow as applicable.
6. Regenerate AI contracts with `pnpm knowledge:build` when exports, props,
   tokens, patterns, examples, or lifecycle metadata change.
7. Add a Changeset for user-facing package changes.

## Canonical checks

Run from the repository root:

```sh
pnpm format:check
pnpm tokens:check
pnpm knowledge:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm changeset:status
```

Pull requests and `main` run the same gates in GitHub Actions. A passing `main`
build publishes Storybook to GitHub Pages, while Changesets creates or updates
the version pull request.

## Change governance

- Architectural or ownership changes require a new ADR.
- Breaking changes require an ADR, a major Changeset, and a migration entry in
  [`MIGRATIONS.md`](MIGRATIONS.md).
- Lifecycle changes require the evidence defined in
  [`component-lifecycle.md`](docs/architecture/component-lifecycle.md).
- Review ownership and exception rules in
  [`docs/governance`](docs/governance/README.md).

## Pull requests

Explain scope, tests run, accessibility impact, and API changes. Link relevant
issues and ADRs. Include Storybook or reference-app screenshots for visual work.
Use Conventional Commit-style subjects such as
`feat(product-access): document access states`.

## Documentation contract

Every component page includes status/purpose, use/avoid guidance, anatomy,
public API/slots, variants/states, interaction/keyboard behavior, accessibility,
responsive behavior, token dependencies, integration responsibilities, edge
cases, executable examples, tests, and changelog.

The generated `@relay/knowledge` manifest must match every public component
value export and props type before review.
