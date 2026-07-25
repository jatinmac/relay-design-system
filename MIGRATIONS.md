# Relay migrations

No breaking migrations have been released yet.

Breaking changes must add a new section without rewriting previously released
guidance.

## Migration entry template

```md
## <target version> — <short change name>

- Affected packages:
- Lifecycle impact:
- Deprecation/removal timeline:

### What changed

Describe the removed, renamed, or behaviorally incompatible public contract.

### Why

Link the accepted ADR and summarize the user or architectural reason.

### Before

Show the previous supported usage.

### After

Show the replacement usage.

### Rollout

Document compatibility bridges, codemods, sequencing, and verification.
```
