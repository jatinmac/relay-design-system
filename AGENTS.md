# Repository Guidelines

## Project Structure & Module Organization

Relay is a pnpm/Turborepo React design-system monorepo. Keep shared code within its intended ownership boundary:

- `packages/tokens`: primitive and semantic token sources plus generation.
- `packages/theme-relay` and `packages/theme-northstar`: brand implementations of the shared token contract.
- `packages/react`: brand-neutral universal React components.
- `packages/product-access`: access-management compositions built from universal components.
- `packages/knowledge`: generated AI-readable contracts and examples.
- `packages/tooling`: shared TypeScript, lint, test, and build configuration.
- `apps/storybook`: documentation and component inspection.
- `apps/reference-app`: mock API integration and production-state demonstrations.

Place unit tests beside source files as `*.test.ts(x)`. Keep Playwright flows under the owning app's `e2e/` directory. Never import application or product logic into `packages/react`.

## Build, Test, and Development Commands

Run commands from the repository root:

- `pnpm install`: install all workspace dependencies.
- `pnpm build`: build packages and applications through Turbo.
- `pnpm storybook`: run component documentation locally.
- `pnpm test`: run Vitest and React Testing Library tests.
- `pnpm test:e2e`: run Playwright workflows.
- `pnpm lint` / `pnpm typecheck`: check style and TypeScript contracts.
- `pnpm tokens:build`: regenerate CSS variables and typed token exports.

Root scripts must remain the canonical interface even when package-specific scripts are added.

## Coding Style & Naming Conventions

Use React with strict TypeScript, two-space indentation, and CSS Modules. Components and exported types use `PascalCase`; hooks use `useCamelCase`; files follow their primary export, such as `DataTable.tsx` and `DataTable.module.css`.

Public props describe intent (`tone="critical"`), never appearance (`color="red"`). Component CSS must consume semantic `--ds-` variables rather than raw color, spacing, radius, or motion values. Prefer composition and discriminated unions over boolean-heavy APIs.

## Testing Guidelines

Cover behavior, accessibility, keyboard operation, loading/error/empty states, reduced motion, and responsive overflow. Test every universal component with both themes; representative visual tests must include light/dark and comfortable/compact modes. Axe checks must report no serious or critical violations.

## Commits & Pull Requests

No Git history exists yet; use Conventional Commit-style subjects such as `feat(react): add dialog focus management`. Add a Changeset for user-facing package changes. Pull requests should explain scope, tests run, accessibility impact, and API changes; include Storybook or reference-app screenshots for visual work and link relevant issues or ADRs.
