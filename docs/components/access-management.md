# Access Management Product Pattern

Status: **beta** for v0.1

`AccessManagementPage` is the coded product pattern in
`@relay/product-access`. It composes universal components into a stable access
management experience without importing an API client, cache, authentication
system, route, or mock server.

## When to use and avoid

Use it for workspace member invitation and role/removal management when the
application can supply the controlled state contract. Do not use it as a
generic people directory, organization chart, or wrapper around a
product-specific API client.

## Anatomy and hierarchy

1. Page heading, description, and invite action.
2. Permission, mutation, and selection notices.
3. Member `DataTable` with status and row actions.
4. Controlled invitation `Dialog`.

## Ownership boundary

```text
Mock HTTP API
→ request adapter and SWR hooks
→ AccessManagementContainer
→ AccessManagementPage
→ @relay/react components
```

The application owns requests, permissions resolution, sorting data, mutation
execution, optimistic cache updates, rollback, and retry. The product pattern
owns the page anatomy, invitation form, role and removal controls, permission
presentation, selection summary, and accessible labels.

## Public API and slots

The page receives:

- `CollectionState<AccessMember>` for loading, empty, error, ready, and
  refreshing states.
- Controlled `selection` and `sort` values with change callbacks.
- Resolved `AccessPermissions`.
- External invitation and member-mutation state.
- Callbacks for invitation, role changes, and removal.
- Optional localized labels, including role and member-status labels.

The invitation callback returns whether the application operation succeeded.
The dialog stays open on failure, prevents duplicate submission while pending,
and closes after success.

## Variants and state matrix

The reference application provides deterministic controls for successful data,
initial loading, empty response, HTTP 503 with retry, background refresh, failed
mutations with optimistic rollback, restricted permissions, and long or
incomplete data. Inviting an existing email demonstrates server validation.

## Interaction and keyboard behavior

Sorting and selection inherit the `DataTable` keyboard contract. The invite
action opens a focus-managed dialog. Pending invitation locks cancellation and
duplicate submission. Role and removal controls disable only for the affected
pending member.

## Accessibility requirements

The page is a named region with one page heading. Permission restrictions remain
visible and describe disabled controls. Owner role restrictions have accessible
descriptions. Pending mutations use status semantics and failures use alerts.
Dialog focus is trapped and restored to the invite trigger.

## Responsive behavior

Wide layouts use a sticky scenario panel. Medium layouts move controls into a
two-column panel above the content. Narrow layouts stack controls and preserve
the table through a named horizontal overflow region.

The product header itself stacks through a container query; the application
owns page-shell breakpoints.

## Token dependencies

The package consumes semantic text, status, selection, input, border,
typography, radius, control-size, and spacing tokens. It also inherits the
semantic dependencies of `Button`, `Badge`, `Stack`, `Dialog`, `TextField`, and
`DataTable`. No raw visual values or brand variables are permitted.

## Integration responsibilities

Applications map API state into `CollectionState`, resolve permissions, control
sorting/selection, execute mutations, prevent duplicate requests, and implement
optimistic cache rollback. The component owns only ephemeral invitation form
state and presentation.

## Edge cases and limitations

- The workspace owner role cannot be changed.
- Missing email and activity values use explicit localized fallbacks.
- Long localized names and addresses wrap.
- Bulk mutation, pagination, virtualization, and organization-specific roles
  are outside v0.1.

## Executable examples

Storybook provides interactive, loading, empty, error, refreshing, restricted,
pending, failed, and long-content stories under `Product/Access management`.
The reference app adds a real HTTP-shaped adapter:

Run the demonstration from the repository root:

```bash
pnpm reference
```

## Test coverage and changelog

Colocated tests cover sorting, selection, role/removal callbacks, permissions,
invitation success/error/pending behavior, duplicate locks, and focus
restoration. Reference-app tests cover request states and optimistic rollback.

Introduced as the first beta product pattern in `@relay/product-access`; see the
root changelog and package Changeset for release notes.
