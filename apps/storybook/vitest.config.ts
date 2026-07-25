import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(directory, '.storybook'),
      initialGlobals: {
        theme: 'relay',
        colorMode: 'light',
        density: 'comfortable',
      },
    }),
  ],
  test: {
    name: 'storybook',
    fileParallelism: false,
    browser: {
      enabled: true,
      provider: playwright({}),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
