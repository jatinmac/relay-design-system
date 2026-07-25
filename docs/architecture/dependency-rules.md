# Dependency Rules

Status: **Accepted for v0.1**

Relay uses an allowlist dependency model. If a dependency is not explicitly
allowed here, it is forbidden.

## Package dependency direction

| Owner                    | May depend on                                                    | Must not depend on                                           |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `@relay/tokens`          | Build-time tooling                                               | React, themes, product packages, applications                |
| `@relay/theme-relay`     | Public token contracts                                           | React components, product packages, applications             |
| `@relay/theme-northstar` | Public token contracts                                           | React components, product packages, applications             |
| `@relay/react`           | Public token contracts, React, approved accessibility utilities  | Concrete themes, product packages, applications, API clients |
| `@relay/product-access`  | Public exports from `@relay/react` and token types when required | Concrete themes, applications, API clients                   |
| `@relay/knowledge`       | Build-time readers of public contracts                           | Application implementation or internal component modules     |
| `@relay/tooling`         | Third-party build and test tools                                 | Runtime application or component code                        |
| `apps/storybook`         | Public exports from all publishable packages                     | Reference-app business or data logic                         |
| `apps/reference-app`     | Public package exports and its own application layer             | Package internals                                            |

`packages/tooling` is a development dependency. Depending on its configuration
does not create a runtime dependency edge.

## Import boundaries

- Packages import other packages only through declared package exports.
- Deep imports into another package's `src/` directory are forbidden.
- `packages/react` must never import from `packages/product-access` or `apps/`.
- `packages/product-access` must never import from `apps/`.
- Theme packages must never import React components.
- Applications may compose public packages but may not make application code
  available to a package through aliases or relative paths.
- Tests may use test helpers from shared tooling, but production source may not.
- Type-only imports follow the same ownership rules as runtime imports.

These rules will be enforced through package export maps, TypeScript project
references, workspace dependency declarations, and lint restrictions.

## Theme loading and activation

Each theme package owns a CSS implementation of the shared semantic token
contract. Applications explicitly import the themes they make available.

`DesignSystemProvider` sets stable attributes on its boundary:

```html
<div
  data-ds-theme="relay"
  data-ds-color-mode="light"
  data-ds-density="comfortable"
>
  ...
</div>
```

Theme styles target those public attributes and assign `--ds-*` semantic
variables. `@relay/react` consumes the variables but does not import or map a
concrete brand name. The open `theme: string` provider contract permits future
theme packages without a release of `@relay/react`.

System color mode remains visible as `data-ds-color-mode="system"`. Theme CSS
uses the light mapping by default and applies the dark mapping through
`prefers-color-scheme: dark`; concrete values remain owned by theme packages.

## Responsive contract

Foundation breakpoint tokens use the following page-layout thresholds:

| Token           |   Value |
| --------------- | ------: |
| `breakpoint.sm` | `30rem` |
| `breakpoint.md` | `48rem` |
| `breakpoint.lg` | `64rem` |
| `breakpoint.xl` | `80rem` |

These tokens support viewport-level application layout. Universal components
prefer named container conditions derived from their own content requirements;
they must not assume that a wide viewport implies a wide component container.

## Token ownership

The token system has three layers:

1. **Primitive tokens** contain raw brand values.
2. **Semantic tokens** define the cross-theme contract used by components.
3. **Component tokens** are optional aliases for stable, component-specific
   needs that cannot be expressed clearly with the shared semantic layer.

Generated CSS variables use the `--ds-` prefix. Universal component CSS may use
semantic or approved component variables only. Raw color, spacing, radius, and
motion values are forbidden in component CSS.

Token names describe meaning:

```text
color.blue.600                              primitive
color.background.canvas                    semantic
color.action.primary.background.default    semantic
component.button.primary.background.hover  component
```

Concrete brand names are forbidden in semantic and component token names.

## State ownership

| State or behavior                                               | Owner                                     |
| --------------------------------------------------------------- | ----------------------------------------- |
| Hover, active, focus-visible, and internal disclosure state     | Universal component                       |
| Accessible relationships, focus trapping, and focus restoration | Universal component                       |
| Controlled sorting, selection, open state, and field values     | Consumer                                  |
| Loading, empty, error, ready, and refreshing presentation       | Universal component receiving typed state |
| Permissions and product validation                              | Product or application layer              |
| Authentication, routing, API requests, caching, and retries     | Application                               |
| Optimistic updates, rollback, and mutation concurrency          | Application                               |
| Theme, mode, and density selection                              | Provider consumer                         |
| Visual values for theme, mode, and density                      | Theme package                             |

Product packages may translate domain state into universal component props, but
they do not acquire server-state ownership.

## Application integration boundary

The required integration flow is:

```text
Mock HTTP API
→ application query and mutation hooks
→ AccessManagementContainer
→ AccessManagementPage
→ universal components
```

Neither `@relay/react` nor `@relay/product-access` may import the mock API, an
application query library, authentication code, or application routes.
