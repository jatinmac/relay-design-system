import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@relay/theme-relay/theme.css';
import '@relay/theme-northstar/theme.css';
import '@relay/react/styles.css';
import '@relay/product-access/styles.css';
import './global.css';

import { App } from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Reference app root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
