# Release and migration governance

## Change classification

| Change                                                                                                       | SemVer | Required artifacts                                                                |
| ------------------------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------- |
| Internal refactor with no observable package change                                                          | None   | Tests; no Changeset                                                               |
| Documentation correction not shipped in a package                                                            | None   | Documentation review                                                              |
| Backward-compatible fix to behavior, accessibility, or tokens                                                | Patch  | Changeset and regression test                                                     |
| New backward-compatible component, prop, token, or pattern                                                   | Minor  | Changeset, documentation, tests, and generated knowledge                          |
| Removed/renamed export, incompatible prop or behavior, token contract removal, or changed required semantics | Major  | ADR, major Changeset, `MIGRATIONS.md` entry, examples, and consumer impact review |

Pre-1.0 packages still classify incompatible changes as breaking. Changesets
may apply pre-1.0 version behavior, but the review evidence and migration
obligation do not weaken.

## Lifecycle

```text
experimental → beta → stable → deprecated → removed
```

All v0.1 public components are `beta`. Promotion is evidence-based and follows
[`component-lifecycle.md`](../architecture/component-lifecycle.md).

- Experimental APIs may change quickly but remain documented and accessible.
- Beta APIs permit production use; breaking changes require migration guidance.
- Stable APIs require durable anatomy, semantics, keyboard behavior, and token
  dependencies.
- Deprecation requires a replacement or explicit migration path and a stated
  support window.
- Removal is a breaking release after the deprecation window.

## Breaking-change workflow

1. Add a proposed ADR describing the incompatibility and rejected alternatives.
2. Identify known consumers and a staged rollout or compatibility bridge.
3. Add a migration entry using the template in `MIGRATIONS.md`.
4. Update implementation, tests, Storybook, generated knowledge, and examples.
5. Add a major Changeset and call out accessibility or token impact.
6. Accept the ADR only after ownership and migration review.

## Changesets

Every user-facing publishable-package change adds one focused file under
`.changeset/`. Summaries describe consumer impact, not internal implementation.
Multiple packages may share a Changeset when one coherent public change spans
them.

Generated `@relay/knowledge` changes accompany the API change. Add a separate
Changeset for `@relay/knowledge` only when its published consumer contract
changes independently.

GitHub Actions validates Changesets after generated-contract drift checks,
formatting, linting, typechecking, tests, and builds pass. On `main`, the
Changesets action creates or updates a version pull request. Publishing packages
to a registry remains an explicit release decision until registry ownership and
provenance are configured.

The same gated `main` workflow deploys the built Storybook artifact to GitHub
Pages. Deployments never run for pull requests or when an earlier quality gate
fails.
