# Production verification

Status: automated gates passing on 2026-07-24.

This matrix turns the production-behavior requirements in `PLAN.md` into
repeatable repository checks. Run every command from the repository root.

## Automated gates

| Contract                           | Evidence                                                                                                                                   | Command                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Token generation and theme parity  | Token generator and Relay/Northstar contract tests                                                                                         | `pnpm tokens:check`                                              |
| Universal and product behavior     | Colocated Vitest and React Testing Library tests                                                                                           | `pnpm test`                                                      |
| Story interactions and axe         | Storybook play functions in Chromium; serious/critical axe violations fail the run                                                         | `pnpm test:storybook`                                            |
| Application and keyboard workflows | Loading, empty, request failure, pending invitation, rollback, permissions, dialog focus, sorting, selection, overflow, and reduced motion | `pnpm test:e2e`                                                  |
| Visual regression                  | Relay/Northstar, light/dark, compact/comfortable, narrow/medium/wide, restricted, and long/incomplete content baselines                    | `pnpm test:e2e`                                                  |
| Static and production output       | Formatting, lint, strict TypeScript, and all package/application builds                                                                    | `pnpm format:check && pnpm lint && pnpm typecheck && pnpm build` |

The checked-in reference baselines live in
`apps/reference-app/e2e/__screenshots__`. Update them intentionally with:

```sh
pnpm --filter @relay/reference-app exec playwright test --update-snapshots
```

Review every changed image before accepting a new baseline.

## Manual keyboard release check

The browser workflow automates this sequence in Chromium, but a human keyboard
pass remains a release sign-off because visual focus quality and interaction
clarity require judgment.

1. Run `pnpm reference` and open `http://127.0.0.1:4173`.
2. Tab to **Invite member** and press Enter. Focus must enter the dialog on
   **Close dialog**.
3. Tab forward and backward through the dialog. Focus must remain inside it.
4. Press Escape. The dialog must close and focus must return to
   **Invite member**.
5. Focus the **Member** sort control and press Enter. The sort indicator and row
   order must change.
6. Focus **Select Morgan Lee** and press Space. The checkbox and selected-count
   summary must update.
7. At a narrow viewport, focus the named **Scrollable table** region. Its focus
   indicator must be visible and horizontal content must remain reachable.
8. Repeat the focus-visibility check for Relay and Northstar in light and dark
   modes.

Record the browser, operating system, date, reviewer, and any exceptions in the
release pull request. Automated axe results supplement this pass; they do not
replace it.
