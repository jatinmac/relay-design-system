# @relay/react

Brand-neutral React components and styling foundations for Relay.

## Provider setup

Load the foundation CSS and one or more theme implementations, then place a
provider around the UI:

```tsx
import '@relay/react/styles.css';
import '@relay/theme-relay/theme.css';

import { DesignSystemProvider } from '@relay/react';

export function App() {
  return (
    <DesignSystemProvider
      theme="relay"
      colorMode="system"
      density="comfortable"
    >
      <main>Application content</main>
    </DesignSystemProvider>
  );
}
```

The foundation CSS declares the stable cascade order:

```text
reset → tokens → base → components → utilities
```

Theme CSS assigns semantic `--ds-*` variables to the provider's public
`data-ds-theme`, `data-ds-color-mode`, and `data-ds-density` attributes.
`@relay/react` does not import or map concrete themes.

Nested providers may switch theme, mode, or density for a subtree. Consumers
must not target the provider's generated CSS Module class.
