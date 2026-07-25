import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DesignSystemProvider } from './DesignSystemProvider.js';

describe('DesignSystemProvider', () => {
  it('applies safe defaults and the requested theme', () => {
    render(
      <DesignSystemProvider theme="relay">
        <span>Provider content</span>
      </DesignSystemProvider>,
    );

    const boundary = screen.getByText('Provider content').parentElement;

    expect(boundary).toHaveAttribute('data-ds-theme', 'relay');
    expect(boundary).toHaveAttribute('data-ds-color-mode', 'system');
    expect(boundary).toHaveAttribute('data-ds-density', 'comfortable');
  });

  it('supports an open theme name and explicit mode and density', () => {
    render(
      <DesignSystemProvider
        theme="custom-brand"
        colorMode="dark"
        density="compact"
      >
        <span>Custom theme</span>
      </DesignSystemProvider>,
    );

    const boundary = screen.getByText('Custom theme').parentElement;

    expect(boundary).toHaveAttribute('data-ds-theme', 'custom-brand');
    expect(boundary).toHaveAttribute('data-ds-color-mode', 'dark');
    expect(boundary).toHaveAttribute('data-ds-density', 'compact');
  });

  it('supports nested theme boundaries without changing child markup', () => {
    render(
      <DesignSystemProvider theme="relay" colorMode="light">
        <DesignSystemProvider theme="northstar" density="compact">
          <span>Nested content</span>
        </DesignSystemProvider>
      </DesignSystemProvider>,
    );

    const innerBoundary = screen.getByText('Nested content').parentElement;
    const outerBoundary = innerBoundary?.parentElement;

    expect(innerBoundary).toHaveAttribute('data-ds-theme', 'northstar');
    expect(innerBoundary).toHaveAttribute('data-ds-density', 'compact');
    expect(outerBoundary).toHaveAttribute('data-ds-theme', 'relay');
    expect(outerBoundary).toHaveAttribute('data-ds-color-mode', 'light');
  });

  it('rejects an empty theme name', () => {
    expect(() =>
      render(
        <DesignSystemProvider theme="   ">
          <span>Invalid theme</span>
        </DesignSystemProvider>,
      ),
    ).toThrow('DesignSystemProvider requires a non-empty theme name.');
  });
});
