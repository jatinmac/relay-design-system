# Filter, Query, and Results Recipe

Status: **documented recipe**

## Problem

Users need to narrow collections while understanding active criteria, result
freshness, and recovery from no-results or request failure.

## Sequence

1. Enter a query or change a bounded filter.
2. The application derives request parameters and preserves usable results
   where safe.
3. The collection reports refreshing, ready, no-results, or error.
4. The user clears criteria, retries, or acts on a result.

## Decision rules

- Filter locally for small in-memory collections.
- Debounce and cancel server requests for query-driven network filtering.
- Use no-results when criteria exclude existing data; use empty when no data
  exists.
- Keep prior results visible during safe background refresh.
- Synchronize criteria to the URL only when sharing or browser navigation is a
  product requirement.

## Error recovery

Preserve the query and filters. Explain whether visible results are stale. Put
retry beside the failed result surface. Never clear criteria as a retry side
effect.

## Permissions

Do not reveal filter categories the user cannot know exist. Explain disabled
result actions when their visibility is useful. Presentation is not
authorization; the server must enforce permissions again.

## Composition

Use `TextField` for search, `Checkbox` or product-specific controls for bounded
filters, `Stack` for layout, `StatePanel` for no-results/errors, and `DataTable`
or a semantic list for results.

## Why this is not a component

Products vary in URL synchronization, filter count, query syntax, result
layout, request behavior, and mobile presentation. A shared component would
require business leakage, opaque slots, or boolean-heavy APIs. Storybook
contains an executable composition under `Documentation/Patterns`.

## Test expectations

Cover keyboard access, clear criteria, request cancellation, stale results,
retry, permission differences, empty/no-results distinction, localization, and
narrow overflow.
