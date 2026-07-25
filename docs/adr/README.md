# Architecture Decision Records

ADRs record decisions that affect package ownership, public contracts, or the
ability to evolve Relay safely.

## Status values

- **Proposed**: under review and not yet binding.
- **Accepted**: binding for implementation.
- **Superseded**: replaced by a newer ADR.
- **Rejected**: considered but not adopted.

Accepted ADRs are immutable except for correcting links or typographical errors.
A changed decision is recorded in a new ADR that supersedes the old one.

## Register

| ADR                                               | Decision                                          | Status   |
| ------------------------------------------------- | ------------------------------------------------- | -------- |
| [0001](0001-package-boundaries.md)                | Package boundaries and dependency direction       | Accepted |
| [0002](0002-code-and-tokens-source-of-truth.md)   | Code and tokens as source of truth                | Accepted |
| [0003](0003-semantic-token-theme-contract.md)     | Semantic token contract and replaceable themes    | Accepted |
| [0004](0004-universal-and-product-boundary.md)    | Universal and product-specific component boundary | Accepted |
| [0005](0005-state-and-integration-ownership.md)   | State and API-integration ownership               | Accepted |
| [0006](0006-accessibility-is-public-api.md)       | Accessibility behavior as public API              | Accepted |
| [0007](0007-coded-components-and-recipes.md)      | Coded components versus documented recipes        | Accepted |
| [0008](0008-lifecycle-and-versioning.md)          | Component lifecycle and semantic versioning       | Accepted |
| [0009](0009-styling-and-responsive-boundaries.md) | Styling and responsive boundaries                 | Accepted |
