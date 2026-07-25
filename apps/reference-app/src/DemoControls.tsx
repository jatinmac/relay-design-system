import type { ColorMode, Density } from '@relay/react';

import { demoScenarios, type DemoScenario } from './api/scenarios';
import styles from './App.module.css';

export type DemoTheme = 'relay' | 'northstar';

export interface DemoControlsProps {
  scenario: DemoScenario;
  theme: DemoTheme;
  colorMode: ColorMode;
  density: Density;
  onScenarioChange: (scenario: DemoScenario) => void;
  onThemeChange: (theme: DemoTheme) => void;
  onColorModeChange: (colorMode: ColorMode) => void;
  onDensityChange: (density: Density) => void;
}

export function DemoControls({
  scenario,
  theme,
  colorMode,
  density,
  onScenarioChange,
  onThemeChange,
  onColorModeChange,
  onDensityChange,
}: DemoControlsProps) {
  const selectedScenario = demoScenarios.find(
    (candidate) => candidate.id === scenario,
  );

  return (
    <aside
      className={styles.controlPanel}
      aria-labelledby="demo-controls-title"
    >
      <div>
        <p className={styles.eyebrow}>Reference application</p>
        <h2 id="demo-controls-title" className={styles.controlTitle}>
          Production states
        </h2>
      </div>

      <label className={styles.controlField}>
        Scenario
        <select
          id="demo-scenario"
          name="scenario"
          value={scenario}
          onChange={(event) =>
            onScenarioChange(event.currentTarget.value as DemoScenario)
          }
        >
          {demoScenarios.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <p className={styles.scenarioDescription}>
        {selectedScenario?.description}
      </p>

      <fieldset className={styles.controlGroup}>
        <legend>Brand theme</legend>
        <label>
          <input
            id="demo-theme-relay"
            type="radio"
            name="theme"
            value="relay"
            checked={theme === 'relay'}
            onChange={() => onThemeChange('relay')}
          />
          Relay
        </label>
        <label>
          <input
            id="demo-theme-northstar"
            type="radio"
            name="theme"
            value="northstar"
            checked={theme === 'northstar'}
            onChange={() => onThemeChange('northstar')}
          />
          Northstar
        </label>
      </fieldset>

      <label className={styles.controlField}>
        Color mode
        <select
          id="demo-color-mode"
          name="color-mode"
          value={colorMode}
          onChange={(event) =>
            onColorModeChange(event.currentTarget.value as ColorMode)
          }
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>

      <label className={styles.controlField}>
        Density
        <select
          id="demo-density"
          name="density"
          value={density}
          onChange={(event) =>
            onDensityChange(event.currentTarget.value as Density)
          }
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </label>

      <div className={styles.boundaryNote}>
        <strong>Integration boundary</strong>
        <span>
          This app owns HTTP scenarios, caching, optimistic updates, and
          permissions. Product and universal packages remain API-client
          agnostic.
        </span>
      </div>
    </aside>
  );
}

DemoControls.displayName = 'DemoControls';
