import type { DocumentationContent } from './documentationTypes';

export const filteringRecipeDocumentation = {
  eyebrow: 'Documented composition pattern',
  title: 'Filter, query, and result-state recipe',
  status: 'Guidance · not a component',
  summary:
    'A decision model for combining search, filters, result counts, collection states, and recovery without freezing product-specific anatomy into a universal API.',
  sections: [
    {
      title: 'Problem',
      paragraphs: [
        'Users need to narrow a collection while understanding which criteria are active, whether results are current, and how to recover from no-results or request failures.',
      ],
    },
    {
      title: 'Sequence',
      bullets: [
        'Enter a query or change a bounded filter.',
        'The application derives request parameters and preserves usable results when possible.',
        'The collection reports refreshing, ready, no-results, or error.',
        'The user clears criteria, retries, or acts on a result.',
      ],
    },
    {
      title: 'Decision rules',
      bullets: [
        'Use immediate local filtering for small in-memory collections.',
        'Debounce and cancel server queries when input drives network requests.',
        'Show no-results when criteria exclude otherwise available data; show empty when no data exists.',
        'Keep prior results visible during safe background refresh.',
      ],
    },
    {
      title: 'Error recovery',
      bullets: [
        'Preserve the query and filter values after failure.',
        'Explain whether displayed results are stale.',
        'Place retry near the failed result surface.',
        'Never clear user criteria as a side effect of retry.',
      ],
    },
    {
      title: 'Permissions',
      bullets: [
        'Hide filters that reveal categories the user cannot know exist.',
        'Disable unavailable result actions with an explanation when their visibility is useful.',
        'Apply permission checks again on the server; presentation is not authorization.',
      ],
    },
    {
      title: 'Why this remains a recipe',
      paragraphs: [
        'Products vary in URL synchronization, filter count, query syntax, result layout, server behavior, and mobile presentation. A coded component would either leak business rules or require opaque slots and boolean-heavy APIs.',
      ],
    },
    {
      title: 'Composition ingredients',
      bullets: [
        'TextField for query input.',
        'Checkbox or product-specific controls for bounded filters.',
        'Stack for layout.',
        'StatePanel for no-results and failure.',
        'DataTable or a semantic list for results.',
      ],
    },
    {
      title: 'Test expectations',
      bullets: [
        'Keyboard access, clear criteria, request cancellation, stale results, retry, permissions, empty/no-results distinction, and narrow overflow.',
      ],
    },
  ],
} as const satisfies DocumentationContent;
