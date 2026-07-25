import { useState, type ReactNode } from 'react';

import styles from './DesignSystemProvider.module.css';
import { PortalContainerProvider } from './PortalContainerContext';

export type ColorMode = 'light' | 'dark' | 'system';
export type Density = 'comfortable' | 'compact';

export interface DesignSystemProviderProps {
  /**
   * Name of a loaded theme implementation. The open string permits themes
   * outside this repository without changing @relay/react.
   */
  theme: string;
  colorMode?: ColorMode;
  density?: Density;
  children: ReactNode;
}

/**
 * Establishes the theme, color mode, density, and container-query boundary for
 * Relay components. Applications must load the matching theme CSS separately.
 */
export function DesignSystemProvider({
  theme,
  colorMode = 'system',
  density = 'comfortable',
  children,
}: DesignSystemProviderProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const themeName = theme.trim();

  if (themeName.length === 0) {
    throw new Error('DesignSystemProvider requires a non-empty theme name.');
  }

  return (
    <PortalContainerProvider value={portalContainer}>
      <div
        ref={setPortalContainer}
        className={styles.root}
        data-ds-color-mode={colorMode}
        data-ds-density={density}
        data-ds-theme={themeName}
      >
        {children}
      </div>
    </PortalContainerProvider>
  );
}

DesignSystemProvider.displayName = 'DesignSystemProvider';
