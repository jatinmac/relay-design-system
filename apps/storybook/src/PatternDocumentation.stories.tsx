import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DocumentationPage } from './docs/DocumentationPage';
import { FilteringRecipeExample } from './docs/examples/FilteringRecipeExample';
import { filteringRecipeDocumentation } from './docs/patternDocumentation';

const meta = {
  title: 'Documentation/Patterns',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterQueryAndResults: Story = {
  name: 'Filter, query, and results',
  render: () => (
    <DocumentationPage
      content={filteringRecipeDocumentation}
      example={<FilteringRecipeExample />}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const search = canvas.getByRole('searchbox', { name: 'Search members' });
    await userEvent.type(search, 'not-a-member');
    await expect(
      canvas.getByText('No members match the current query and filters.'),
    ).toBeVisible();

    await userEvent.clear(search);
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Active members only' }),
    );
    await expect(
      canvas.queryByText('Pending invitation'),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('table', { name: 'Filtered workspace members' }),
    ).toBeVisible();
  },
};
