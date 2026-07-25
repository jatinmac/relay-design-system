# Universal Components

Status: **beta** for v0.1

`@relay/react` exports eight brand-neutral component families. Applications
provide a conforming theme through `DesignSystemProvider`; components consume
semantic `--ds-*` variables and contain no product, API, permission, or routing
logic.

| Family             | Public exports           | Owned production states                                                                        |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------------------- |
| Layout             | `Stack`                  | Direction, alignment, justification, wrapping, responsive content                              |
| Actions            | `Button`, `IconButton`   | Default, hover, active, focus-visible, disabled, loading                                       |
| Fields             | `FormField`, `TextField` | Hint, required, invalid, disabled, read-only, long content                                     |
| Selection          | `Checkbox`               | Checked, unchecked, indeterminate, required, disabled, read-only                               |
| Status             | `Badge`                  | Neutral, info, success, warning, critical                                                      |
| State presentation | `StatePanel`             | Loading, empty, no-results, error, no-access                                                   |
| Overlay            | `Dialog`                 | Controlled open, focus trap, Escape/outside dismissal, fixed dismissal, focus restoration      |
| Collection         | `DataTable`              | Loading, empty, error/retry, ready, refreshing, sorting, multiple selection, actions, overflow |

## Dependency order

`Stack` is independent. Actions depend only on shared styling utilities. Fields,
selection, and status build the control vocabulary. `StatePanel` composes action
content. `Dialog` composes `IconButton` and React Aria overlay behavior.
`DataTable` composes `Button`, `Checkbox`, and `StatePanel`.

## Keyboard contract

- Native buttons activate with <kbd>Enter</kbd> and <kbd>Space</kbd>.
- Checkboxes toggle with <kbd>Space</kbd>; read-only and disabled checkboxes do
  not change.
- Dialog moves focus inside, cycles focus within the modal, closes with
  <kbd>Escape</kbd> when dismissible, and restores focus to the trigger.
- Sort headers and selection controls use native buttons and checkboxes.
- The table overflow region is named and keyboard-focusable.

## Stories

Initial state matrices live under `apps/storybook/src`. The Storybook toolbar
switches Relay/Northstar, light/dark/system mode, and comfortable/compact
density without changing component props.
