export type DemoScenario =
  | 'success'
  | 'loading'
  | 'empty'
  | 'request-error'
  | 'refreshing'
  | 'mutation-error'
  | 'restricted'
  | 'edge-cases';

export interface DemoScenarioDefinition {
  id: DemoScenario;
  label: string;
  description: string;
}

export const demoScenarios: ReadonlyArray<DemoScenarioDefinition> = [
  {
    id: 'success',
    label: 'Successful data',
    description:
      'Sort, select, invite, change roles, remove members, and refresh.',
  },
  {
    id: 'loading',
    label: 'Initial loading',
    description: 'Keeps the mock request pending to demonstrate loading.',
  },
  {
    id: 'empty',
    label: 'Empty response',
    description: 'Returns a successful response with no workspace members.',
  },
  {
    id: 'request-error',
    label: 'Request error',
    description: 'Returns HTTP 503 and exposes the retry path.',
  },
  {
    id: 'refreshing',
    label: 'Background refresh',
    description: 'Keeps stale data visible during periodic revalidation.',
  },
  {
    id: 'mutation-error',
    label: 'Failed mutation',
    description: 'Optimistic role and removal updates fail and roll back.',
  },
  {
    id: 'restricted',
    label: 'Restricted permissions',
    description: 'A viewer can inspect members but cannot mutate access.',
  },
  {
    id: 'edge-cases',
    label: 'Long and incomplete data',
    description: 'Exercises long localized names and missing profile data.',
  },
];
