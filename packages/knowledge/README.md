# `@relay/knowledge`

Generated, AI-readable contracts for Relay. Files under `dist/` are build
artifacts and must not be edited directly.

## Artifacts

| Artifact          | Purpose                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| `components.json` | Public component ownership, lifecycle, props, variants, slots, composition, and consumer responsibilities |
| `tokens.json`     | Semantic token names, types, and `--ds-*` variables                                                       |
| `patterns.json`   | Coded product patterns and intentionally documented recipes                                               |
| `constraints.md`  | Architecture, styling, state, accessibility, and change constraints                                       |
| `AI_USAGE.md`     | Agent reading order and component-selection workflow                                                      |
| `examples/*.tsx`  | Type-checked universal, table, and product integration examples                                           |

## Sources of truth

- Public exports from `@relay/react` and `@relay/product-access`.
- Generated token contract from `@relay/tokens`.
- Curated intent contracts under `src/contracts/`.
- Type-checked examples under `src/examples/`.
- Durable pattern and governance documentation under `docs/`.

Generation fails when a public component value export is undocumented, a props
type is not public, a composition violates package direction, a v0.1 component
is not beta, a token violates naming rules, or an example is missing.

## Commands

Run from the repository root:

```sh
pnpm knowledge:build
pnpm knowledge:check
```

`knowledge:build` deterministically regenerates `dist/`.
`knowledge:check` compares the generated result to the checked-in artifacts and
validates it against public APIs.
