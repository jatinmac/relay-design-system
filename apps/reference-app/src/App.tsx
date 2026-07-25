import { useState } from 'react';
import { SWRConfig, type SWRConfiguration } from 'swr';
import {
  DesignSystemProvider,
  type ColorMode,
  type Density,
} from '@relay/react';

import { AccessManagementContainer } from './AccessManagementContainer';
import { resetMockApi } from './api/mockApi';
import type { DemoScenario } from './api/scenarios';
import { DemoControls, type DemoTheme } from './DemoControls';
import styles from './App.module.css';

const swrConfiguration: SWRConfiguration = {
  dedupingInterval: 0,
  errorRetryCount: 0,
  provider: () => new Map(),
  shouldRetryOnError: false,
};

export function App() {
  const [scenario, setScenario] = useState<DemoScenario>('success');
  const [theme, setTheme] = useState<DemoTheme>('relay');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [density, setDensity] = useState<Density>('comfortable');

  function handleScenarioChange(nextScenario: DemoScenario) {
    resetMockApi();
    setScenario(nextScenario);
  }

  return (
    <SWRConfig key={scenario} value={swrConfiguration}>
      <DesignSystemProvider
        theme={theme}
        colorMode={colorMode}
        density={density}
      >
        <a className={styles.skipLink} href="#main-content">
          Skip to access management
        </a>
        <div className={styles.shell}>
          <DemoControls
            scenario={scenario}
            theme={theme}
            colorMode={colorMode}
            density={density}
            onScenarioChange={handleScenarioChange}
            onThemeChange={setTheme}
            onColorModeChange={setColorMode}
            onDensityChange={setDensity}
          />
          <main id="main-content" className={styles.main}>
            <AccessManagementContainer scenario={scenario} />
          </main>
        </div>
      </DesignSystemProvider>
    </SWRConfig>
  );
}

App.displayName = 'App';
