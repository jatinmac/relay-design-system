# ADR-0005: State and API-Integration Ownership

- Status: Accepted
- Date: 2026-07-24

## Context

Real applications introduce loading, failure, concurrency, permissions, and
mutation states. If design-system components own these integrations, they
become tied to one API client and application architecture.

## Decision

Components own ephemeral interaction state. Consumers control reusable UI
state. Applications own server state, authentication, routing, permissions
resolution, caching, mutations, optimistic updates, and rollback.

Universal and product components receive serializable state and callbacks.
Mutually exclusive collection conditions use discriminated unions. The
reference application owns the mock API, query/mutation hooks, and integration
container.

## Consequences

- Components can demonstrate production states without performing network
  calls.
- Applications may choose or replace their server-state library.
- Component APIs must make loading, pending, refreshing, failure, and retry
  states explicit.
- Integration examples require an application container rather than hidden
  component effects.

## Rejected alternatives

- Fetch data inside `DataTable` or `AccessManagementPage`: rejected because it
  couples UI contracts to endpoints, authentication, and caching.
- Hide all async state behind booleans: rejected because invalid combinations
  are easy to express.
