# Relay Documentation

Status: **v0.1 beta**

Storybook is the executable source for system guidance, component contracts,
state matrices, and recipes. These Markdown documents are the durable
production and governance reference.

## Start here

- [Production handbook](production-handbook.md)
- [Architecture](architecture/README.md)
- [Architecture decisions](adr/README.md)
- [Universal component catalog](components/universal-components.md)
- [Access-management product pattern](components/access-management.md)
- [Filter, query, and results recipe](patterns/filter-query-results.md)
- [Production verification](testing/production-verification.md)
- [Governance](governance/README.md)
- [Release and migration governance](governance/release-and-migrations.md)
- [AI knowledge package](../packages/knowledge/README.md)
- [Contribution workflow](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
- [Migrations](../MIGRATIONS.md)

## Storybook map

The `Documentation/System` section contains one executable page for every
required system topic:

1. Getting started
2. Principles and architecture
3. Brand versus product responsibilities
4. Token taxonomy and naming
5. Themes, color, and density
6. Typography
7. Layout and responsiveness
8. Motion and reduced motion
9. Accessibility
10. Universal components
11. Product-specific components
12. Coded and documented patterns
13. API-integration boundaries
14. Testing strategy
15. Contribution workflow
16. Versioning and lifecycle
17. AI-agent usage
18. Changelog

`Documentation/Components` applies one required template to every universal
component family and `AccessManagementPage`. `Product/Access management`
provides the complete product state matrix. `Documentation/Patterns` contains
guidance that intentionally remains a recipe.

Run it from the repository root:

```sh
pnpm storybook
```
