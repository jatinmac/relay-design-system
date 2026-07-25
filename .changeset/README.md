# Changesets in Relay

Add a Changeset for every user-facing change to a publishable package:

```sh
pnpm changeset
pnpm changeset:status
```

Use:

- `patch` for backward-compatible fixes.
- `minor` for backward-compatible additions.
- `major` for incompatible APIs, behavior, semantics, or token contracts.

Summaries describe consumer impact. Breaking changes also require an ADR and a
new entry in `MIGRATIONS.md`. Documentation-only repository changes do not need
a Changeset unless the published `@relay/knowledge` contract changes.
