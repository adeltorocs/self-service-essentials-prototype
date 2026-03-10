/**
 * src/index.jsx
 * Application entry point.
 *
 * Provider hierarchy (outermost → innermost):
 *   BrowserRouter         – client-side routing
 *   QueryClientProvider   – React Query server-state management
 *   CheckoutProvider      – multi-step form context
 *   App                   – routes
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CheckoutProvider } from './data/context/CheckoutContext';
import App from './App';

// Import Paragon design system CSS (local copy with ~-import stripped for Vite compat)
import './styles/paragon.css';
// Custom overrides and Paragon-compatible styles for prototype-specific layout
import './styles/app.css';

// BACKEND: configure staleTime, retry policy etc. to match production settings.
// Pattern: Caching Strategy (enterprise-access §13) — use TieredCache-aligned timeouts:
//   - 5 min default for most data, 30 min for content metadata (staleTime: Infinity for static).
//   - Explicit cache invalidation on writes (queryClient.invalidateQueries on mutations).
// Pattern: Service Client (enterprise-access §8) — queryFn implementations should call
//   dedicated API client classes (e.g., EnterpriseCatalogApiClient, LicenseManagerApiClient)
//   with @backoff retry decorators for transient failures.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,  // 1 minute
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
