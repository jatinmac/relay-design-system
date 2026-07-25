import type { Preview } from '@storybook/react-vite';

import '@relay/theme-relay/theme.css';
import '@relay/theme-northstar/theme.css';
import '@relay/react/styles.css';
import '@relay/product-access/styles.css';
import './preview.css';

import { DesignSystemProvider } from '@relay/react';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Brand theme',
      defaultValue: 'relay',
      toolbar: {
        icon: 'paintbrush',
        items: ['relay', 'northstar'],
      },
    },
    colorMode: {
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'contrast',
        items: ['light', 'dark', 'system'],
      },
    },
    density: {
      description: 'Interface density',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'component',
        items: ['comfortable', 'compact'],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <DesignSystemProvider
        theme={context.globals.theme}
        colorMode={context.globals.colorMode}
        density={context.globals.density}
      >
        <main className="story-canvas">
          <Story />
        </main>
      </DesignSystemProvider>
    ),
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Documentation', 'Universal'],
      },
    },
  },
};

export default preview;
