import type { DocumentationContent } from './documentationTypes';

export const systemDocumentation = {
  gettingStarted: {
    eyebrow: 'System guide',
    title: 'Getting started',
    status: 'v0.1 beta',
    summary:
      'Install the workspace, provide a brand theme, and compose Relay components without coupling product code to visual values.',
    sections: [
      {
        title: 'Install and build',
        bullets: [
          'Run pnpm install from the repository root.',
          'Run pnpm tokens:build before consuming generated theme artifacts.',
          'Use pnpm storybook for component documentation and pnpm reference for the production-state demo.',
        ],
        code: 'pnpm install\npnpm tokens:build\npnpm storybook',
      },
      {
        title: 'Application setup',
        paragraphs: [
          'Import one or more brand theme styles, the React package styles, and wrap the application in DesignSystemProvider.',
        ],
        code: `import '@relay/theme-relay/theme.css';
import '@relay/react/styles.css';
import { DesignSystemProvider } from '@relay/react';

<DesignSystemProvider theme="relay" colorMode="light">
  <Application />
</DesignSystemProvider>`,
      },
      {
        title: 'Choose the correct layer',
        bullets: [
          'Use @relay/react for brand-neutral controls and layout.',
          'Use @relay/product-access for access-management composition.',
          'Keep API clients, permissions, caching, and routes in the application.',
        ],
      },
    ],
  },
  principlesArchitecture: {
    eyebrow: 'System guide',
    title: 'Principles and architecture',
    summary:
      'Relay uses directed dependencies, semantic contracts, and explicit state ownership to keep brand, product, and application concerns replaceable.',
    sections: [
      {
        title: 'Directed dependency model',
        code: `Token contract
├── Brand themes
└── Universal React components
      ↓
Product-specific components
      ↓
Application integration`,
      },
      {
        title: 'Core principles',
        bullets: [
          'Structure follows function and composition precedes prop expansion.',
          'Accessibility and responsive behavior are public API requirements.',
          'A contrasting second brand is an architectural validation, not a skin.',
          'Documentation is an interface for people and AI agents.',
        ],
      },
      {
        title: 'Source of truth',
        paragraphs: [
          'TypeScript contracts and token source files are authoritative. Storybook, generated CSS, typed exports, and knowledge artifacts are downstream representations.',
        ],
      },
    ],
  },
  brandProduct: {
    eyebrow: 'Architecture',
    title: 'Brand versus product responsibilities',
    summary:
      'Brand controls visual expression; product controls specialized anatomy and workflow meaning. Neither concern belongs in universal components.',
    sections: [
      {
        title: 'Brand owns',
        bullets: [
          'Color, typography, shape, borders, elevation, icon treatment, and motion personality.',
          'Light and dark semantic mappings.',
          'Implementations of the shared --ds-* token contract.',
        ],
      },
      {
        title: 'Product owns',
        bullets: [
          'Domain anatomy, terminology, permission presentation, and workflow sequencing.',
          'Product-specific compositions built exclusively from universal components.',
          'Callbacks and controlled state contracts without network implementations.',
        ],
      },
      {
        title: 'Application owns',
        bullets: [
          'Authentication, API clients, routes, caching, optimistic updates, and rollback.',
          'Permission resolution, business validation, analytics, and persistence.',
        ],
      },
    ],
  },
  tokenTaxonomy: {
    eyebrow: 'Foundations',
    title: 'Token taxonomy and naming',
    summary:
      'Tokens progress from raw scales to semantic meaning and optional component decisions, with a stable --ds- CSS namespace.',
    sections: [
      {
        title: 'Three levels',
        code: `Primitive values
→ Semantic contracts
→ Optional component tokens`,
      },
      {
        title: 'Naming rules',
        bullets: [
          'Primitive: color.blue.600 or space.400.',
          'Semantic: color.text.primary or color.background.canvas.',
          'Component: component.button.primary.background.hover.',
          'Public props use intent such as tone="critical", never palette values.',
        ],
      },
      {
        title: 'Consumption rule',
        paragraphs: [
          'Component CSS consumes semantic --ds-* variables only. Raw hex, pixel spacing, radius, shadow, and motion values are rejected by package tests.',
        ],
        code: `.buttonPrimary {
  color: var(--ds-color-action-primary-label);
  background: var(--ds-color-action-primary-background-default);
}`,
      },
    ],
  },
  themes: {
    eyebrow: 'Foundations',
    title: 'Themes, color, and density',
    summary:
      'The provider applies independent brand, color-mode, and density axes while component structure and props remain unchanged.',
    sections: [
      {
        title: 'Theme contract',
        bullets: [
          'Relay is the primary implementation.',
          'Northstar provides contrasting color, typography, shape, elevation, and motion.',
          'Both themes must implement the complete semantic contract.',
        ],
      },
      {
        title: 'Provider axes',
        code: `<DesignSystemProvider
  theme="northstar"
  colorMode="dark"
  density="compact"
>
  <Application />
</DesignSystemProvider>`,
      },
      {
        title: 'Color requirements',
        bullets: [
          'Use semantic roles for foreground/background pairs.',
          'Validate interaction, status, disabled, and focus states in light and dark.',
          'Do not infer meaning from color alone.',
        ],
      },
    ],
  },
  typography: {
    eyebrow: 'Foundations',
    title: 'Typography',
    summary:
      'Themes provide display, body, and monospace families through the same semantic type scale.',
    sections: [
      {
        title: 'Roles',
        bullets: [
          'Display family: page and section headings.',
          'Body family: interface copy, labels, and controls.',
          'Monospace family: code, identifiers, and technical values.',
        ],
      },
      {
        title: 'Scale',
        bullets: [
          'Heading sizes: small, medium, and large.',
          'Body sizes: small, medium, and large.',
          'Label sizes: small and medium.',
          'Line-height tokens distinguish headings, body, and relaxed copy.',
        ],
      },
      {
        title: 'Content resilience',
        paragraphs: [
          'Layouts must tolerate text zoom, long localized labels, missing content, and wrapping without truncating essential meaning.',
        ],
      },
    ],
  },
  layout: {
    eyebrow: 'Foundations',
    title: 'Layout and responsiveness',
    summary:
      'Components own local responsive behavior while applications own page-level breakpoints and placement.',
    sections: [
      {
        title: 'Layout primitives',
        bullets: [
          'Stack provides semantic spacing, alignment, direction, justification, and wrapping.',
          'Spacing uses layout, component, and control token roles.',
          'Consumers can choose semantic elements through Stack as.',
        ],
      },
      {
        title: 'Responsive ownership',
        bullets: [
          'Universal components handle intrinsic sizing and local overflow.',
          'Product components use container queries for their own anatomy.',
          'Applications decide navigation, columns, and page-shell breakpoints.',
        ],
      },
      {
        title: 'Collection overflow',
        paragraphs: [
          'Data tables retain semantic table structure inside a named, keyboard-focusable horizontal scroll region rather than collapsing into inaccessible cards.',
        ],
      },
    ],
  },
  motion: {
    eyebrow: 'Foundations',
    title: 'Motion and reduced motion',
    summary:
      'Motion communicates state change with semantic duration and easing tokens and becomes effectively immediate when reduced motion is requested.',
    sections: [
      {
        title: 'Motion roles',
        bullets: [
          'Fast for direct control feedback.',
          'Normal for component transitions.',
          'Slow for larger spatial changes.',
          'Standard and emphasized easing describe interaction character.',
        ],
      },
      {
        title: 'Reduced motion',
        paragraphs: [
          'The reduced duration token replaces decorative or spatial animation. Loading indicators may retain minimal state communication without creating unnecessary movement.',
        ],
      },
      {
        title: 'Implementation rule',
        code: `transition:
  background var(--ds-motion-duration-fast)
  var(--ds-motion-easing-standard);`,
      },
    ],
  },
  accessibility: {
    eyebrow: 'Quality standard',
    title: 'Accessibility',
    status: 'WCAG 2.2 AA baseline',
    summary:
      'Semantic HTML, keyboard support, focus behavior, names, descriptions, and state announcements are required parts of every public component contract.',
    sections: [
      {
        title: 'Baseline',
        bullets: [
          'Target WCAG 2.2 AA without claiming blanket AAA compliance.',
          'Axe must report no serious or critical violations in representative coverage.',
          'Color, focus, text zoom, pointer targets, and reduced motion are tested.',
        ],
      },
      {
        title: 'Interaction',
        bullets: [
          'Prefer native buttons, inputs, labels, tables, headings, and landmarks.',
          'All actions are keyboard operable with visible focus.',
          'Dialogs trap focus, support dismissal rules, and restore trigger focus.',
          'Async and error states use appropriate live-region semantics.',
        ],
      },
      {
        title: 'Consumer responsibilities',
        paragraphs: [
          'Consumers provide meaningful labels, logical focus order, localized copy, and product-appropriate announcements. Components enforce required relationships where possible.',
        ],
      },
    ],
  },
  universalComponents: {
    eyebrow: 'Component model',
    title: 'Universal components',
    summary:
      'Eight brand-neutral families provide layout, actions, fields, selection, status, state presentation, overlays, and collections.',
    sections: [
      {
        title: 'Component families',
        bullets: [
          'Stack',
          'Button and IconButton',
          'FormField and TextField',
          'Checkbox',
          'Badge',
          'StatePanel',
          'Dialog',
          'DataTable',
        ],
      },
      {
        title: 'They own',
        bullets: [
          'Semantic structure and ARIA relationships.',
          'Interaction state, keyboard and focus behavior.',
          'Responsive component behavior and stable public APIs.',
        ],
      },
      {
        title: 'They never own',
        bullets: [
          'API endpoints, authentication, permissions, server caching, routing, or domain mutations.',
        ],
      },
    ],
  },
  productComponents: {
    eyebrow: 'Component model',
    title: 'Product-specific components',
    summary:
      'Product packages encode stable domain anatomy while remaining controlled, theme-driven, and API-client agnostic.',
    sections: [
      {
        title: 'AccessManagementPage',
        paragraphs: [
          'The v0.1 product pattern composes the universal collection, action, field, status, overlay, and layout primitives.',
        ],
      },
      {
        title: 'State contract',
        bullets: [
          'Receives collection, permission, invitation, mutation, selection, and sorting state.',
          'Emits invitation, role-change, removal, selection, and sort intents.',
          'Keeps only ephemeral invitation-dialog form state locally.',
        ],
      },
      {
        title: 'Boundary',
        paragraphs: [
          'The product package contains no SWR, fetch, endpoint, authentication, or routing imports. Applications may replace every integration detail without changing the page component.',
        ],
      },
    ],
  },
  patterns: {
    eyebrow: 'Patterns',
    title: 'Coded and documented patterns',
    summary:
      'Stable, bounded anatomy becomes a coded product component; variable workflow guidance remains a documented recipe.',
    sections: [
      {
        title: 'Coded pattern threshold',
        bullets: [
          'Repeated and consistent purpose.',
          'Stable anatomy and bounded variations.',
          'Shared interaction or accessibility requirements.',
          'A clear API without business-specific leakage.',
        ],
      },
      {
        title: 'Documented recipe threshold',
        bullets: [
          'Sequence or content varies substantially by product.',
          'The abstraction would require many boolean props or opaque slots.',
          'The shared value is a decision model rather than fixed anatomy.',
        ],
      },
      {
        title: 'Current examples',
        bullets: [
          'Coded: AccessManagementPage.',
          'Recipe: filter, query, and result-state composition.',
        ],
      },
    ],
  },
  integration: {
    eyebrow: 'Architecture',
    title: 'API-integration boundaries',
    summary:
      'Data crosses a one-way boundary from application infrastructure into controlled product and universal component contracts.',
    sections: [
      {
        title: 'Reference flow',
        code: `Mock HTTP API
→ application query/mutation hooks
→ AccessManagementContainer
→ AccessManagementPage
→ universal components`,
      },
      {
        title: 'Application responsibilities',
        bullets: [
          'Requests, caching, sorting, optimistic updates, rollback, retry, and permissions.',
          'Mapping server records and errors into public component contracts.',
          'Preventing duplicate mutations at the integration boundary.',
        ],
      },
      {
        title: 'Demonstrated conditions',
        bullets: [
          'Loading, ready, empty, request error, retry, and background refresh.',
          'Pending and failed mutations, optimistic rollback, and duplicate submission.',
          'Restricted permissions and long or incomplete data.',
        ],
      },
    ],
  },
  testing: {
    eyebrow: 'Quality standard',
    title: 'Testing strategy',
    summary:
      'Tests follow ownership: token contracts, component behavior, product composition, and application workflows are verified at their respective layers.',
    sections: [
      {
        title: 'Test pyramid',
        bullets: [
          'Token generation and theme parity contract tests.',
          'Vitest and React Testing Library behavior tests beside source.',
          'Storybook examples and interaction checks across global theme controls.',
          'Playwright workflows and visual snapshots in the owning application.',
        ],
      },
      {
        title: 'Required state coverage',
        bullets: [
          'Keyboard, focus, semantics, loading, empty, error, disabled, and read-only.',
          'Light/dark, comfortable/compact, Relay/Northstar, and reduced motion.',
          'Responsive overflow, long labels, missing data, permissions, and mutation failure.',
        ],
      },
      {
        title: 'Root commands',
        code: `pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build`,
      },
    ],
  },
  contribution: {
    eyebrow: 'Governance',
    title: 'Contribution workflow',
    summary:
      'Changes begin in the correct ownership layer, include behavioral and documentation evidence, and use root commands as the canonical interface.',
    sections: [
      {
        title: 'Before coding',
        bullets: [
          'Choose universal, product, theme, application, or recipe ownership.',
          'Confirm the API describes intent and does not leak brand or backend details.',
          'Record architectural changes in an ADR.',
        ],
      },
      {
        title: 'Definition of a component change',
        bullets: [
          'Implementation, colocated tests, Storybook states, accessibility notes, and responsive behavior.',
          'A Changeset for user-facing package changes.',
          'API and changelog documentation.',
        ],
      },
      {
        title: 'Pull-request evidence',
        bullets: [
          'Scope, tests run, accessibility impact, API changes, and linked ADRs.',
          'Storybook or reference-application screenshots for visual work.',
        ],
      },
    ],
  },
  lifecycle: {
    eyebrow: 'Governance',
    title: 'Versioning and lifecycle',
    summary:
      'Semantic versioning, Changesets, and explicit lifecycle labels communicate stability and migration expectations.',
    sections: [
      {
        title: 'Lifecycle states',
        bullets: [
          'Experimental: exploration with no compatibility promise.',
          'Beta: usable but expected to evolve with documented changes.',
          'Stable: supported public API under semantic versioning.',
          'Deprecated: supported temporarily with a migration path.',
        ],
      },
      {
        title: 'v0.1 policy',
        paragraphs: [
          'All current component families and AccessManagementPage begin in beta. Documentation identifies limitations rather than overstating production maturity.',
        ],
      },
      {
        title: 'Release mechanics',
        bullets: [
          'Use Conventional Commit-style subjects.',
          'Add Changesets for public package changes.',
          'Generate package changelogs and publish in dependency order.',
        ],
      },
    ],
  },
  aiAgents: {
    eyebrow: 'System interface',
    title: 'AI-agent usage',
    summary:
      'AI agents follow the same package boundaries and public contracts as human contributors, using generated knowledge as an index rather than inventing APIs.',
    sections: [
      {
        title: 'Allowed behavior',
        bullets: [
          'Import documented exports from their owning package.',
          'Use semantic props and --ds-* variables.',
          'Compose existing primitives before proposing new abstractions.',
          'Preserve controlled state and integration ownership.',
        ],
      },
      {
        title: 'Forbidden behavior',
        bullets: [
          'Import application or product logic into @relay/react.',
          'Use raw visual values in component CSS.',
          'Invent props, token names, variants, or package paths.',
          'Place API calls inside design-system components.',
        ],
      },
      {
        title: 'Verification',
        paragraphs: [
          'Agents must inspect TypeScript exports, Storybook examples, package tests, and AGENTS.md before changing the system. Generated knowledge artifacts will provide machine-readable mirrors in the governance phase.',
        ],
      },
    ],
  },
  changelog: {
    eyebrow: 'Release notes',
    title: 'Changelog',
    status: 'Unreleased',
    summary:
      'The v0.1 foundation now includes token contracts, two themes, universal components, access-management composition, and a production-state reference application.',
    sections: [
      {
        title: 'Added',
        bullets: [
          'Primitive and semantic token generation with Relay and Northstar themes.',
          'Eight universal component families and DesignSystemProvider.',
          'AccessManagementPage product composition.',
          'Deterministic reference integration for production conditions.',
          'System, component, pattern, and governance documentation.',
        ],
      },
      {
        title: 'Compatibility',
        paragraphs: [
          'All public components remain beta. Breaking changes require a Changeset and a documented migration note even before the first stable release.',
        ],
      },
      {
        title: 'Next verification phase',
        bullets: [
          'Storybook interaction coverage, axe runs, Playwright workflows, and representative visual snapshots.',
        ],
      },
    ],
  },
} as const satisfies Record<string, DocumentationContent>;
