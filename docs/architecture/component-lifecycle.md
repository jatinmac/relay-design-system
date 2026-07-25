# Component Lifecycle

Status: **Accepted for v0.1**

Relay uses the following lifecycle:

```text
experimental → beta → stable → deprecated → removed
```

Lifecycle status applies to a public export and is recorded in Storybook,
generated knowledge artifacts, and release documentation.

## Experimental

- The problem is understood, but anatomy or API is still being explored.
- Production use is not recommended.
- Breaking changes may occur in any release.
- Basic behavior and accessibility exploration must still be documented.

## Beta

- Purpose, ownership, and initial API are defined.
- Representative behavior, accessibility, theme, and responsive tests exist.
- Production use is allowed with awareness that feedback may cause changes.
- Breaking changes follow semantic versioning and include migration notes.
- Known limitations are documented.

All v0.1 universal components and `AccessManagementPage` begin here.

## Stable

- The component has demonstrated repeated product use.
- Public API, anatomy, keyboard behavior, and token dependencies are durable.
- Required state, theme, mode, density, accessibility, and responsive coverage
  is complete.
- No serious or critical automated accessibility violations remain.
- Breaking changes are exceptional and require an ADR plus migration guidance.

## Deprecated

- A supported replacement or migration path is documented.
- Documentation and development warnings identify the deprecation.
- The export remains functional for the stated deprecation window.
- New use is discouraged.

## Removed

- The deprecation window has elapsed.
- Removal is released as a breaking change.
- Migration notes remain available in the changelog.
- Knowledge manifests no longer recommend the removed API.

## Promotion requirements

Lifecycle promotion is an explicit release decision, not a function of time.
Promotion requires:

- Documented purpose, usage guidance, anatomy, API, and limitations.
- Passing unit, interaction, accessibility, and representative visual tests.
- Verification in Relay and Northstar.
- Verification in light/dark and comfortable/compact modes.
- Keyboard and reduced-motion review.
- A Changeset recording the status change.
