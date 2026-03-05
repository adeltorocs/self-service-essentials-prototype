## **Reusable Patterns in `edx/frontend-app-admin-portal`**
Repository: https://github.com/openedx/frontend-enterprise

This frontend React application employs several well-established architectural patterns. Here's a concise reference guide:

### **1\. Async Data Fetching & Caching with React Query**

* Pattern: Use `@tanstack/react-query` (`useQuery`) for server state management instead of manually handling loading/error states  
* Key Points:  
  * Caches API responses automatically with configurable `staleTime` (default 1 minute in this app)  
  * Implement `useQuery` hooks directly in components that consume the data  
  * Use a query key factory pattern to simplify cache invalidation (`invalidateQueries`)  
  * Avoid mixing API data from `useQuery` with local context state—keep them separate  
* Example: `useBudgetRedemptions`, `useBudgetContentAssignments`

### **2\. Centralized API Service Classes**

* Pattern: Create static class-based API service wrappers (e.g., `EnterpriseAccessApiService`, `EcommerceApiService`)  
* Key Points:  
  * Each service wraps authenticated HTTP calls via `getAuthenticatedHttpClient()`  
  * Handle request/response transformations (camelCase ↔ snake\_case) consistently  
  * Static methods for each endpoint  
  * Pass options/filters as URLSearchParams for cleaner URLs  
* Example Services: `EnterpriseAccessApiService.ts`, `EcommerceApiService.js`, `EnterpriseDataApiService.js`

### **3\. Redux for Legacy Local State (with deprecation path)**

* Pattern: Redux \+ Redux-Form for older features; gradually migrating to React Query \+ Context  
* Key Points:  
  * Reducers follow standard action → state transformation pattern  
  * Redux containers map state/dispatch to props via `connect()`  
  * Schema: `data/actions/`, `data/reducers/`, `data/store.js`  
  * Being phased out in favor of React Query (ADR \#6 & \#8)

### **4\. Context API for Feature-Specific State**

* Pattern: Create context providers with `useReducer` for complex local state  
* Key Points:  
  * Separate "application state" (UI toggles, form state) from "server state" (API data)  
  * Custom hooks expose context value (e.g., `useFormContext()`, `useValidatedEmailsContext()`)  
  * Wrap feature sections with context providers  
  * Use `useMemo` to prevent unnecessary re-renders  
* Examples: `EnterpriseAppContextProvider`, `SubscriptionDetailContextProvider`, `FormContext`, `SSOConfigContext`

### **5\. Multi-Step Form Workflows**

* Pattern: Custom form reducer \+ context for handling multi-page forms with validation  
* Key Points:  
  * Define form fields, validation rules, and workflow steps  
  * `FormReducer` manages field values, errors, and navigation state  
  * `ValidatedFormControl` and `ValidatedFormRadio` components read/write to form context  
  * Validators are pure functions: `(fields) => errorMessage | false`  
  * Support for async operations (e.g., authorization) between steps  
* Location: `src/components/forms/` (FormContext.tsx, data/reducer.ts, etc.)

### **6\. Table Component with Redux-Connected Data**

* Pattern: Class-based `TableComponent` connected to Redux for pagination/sorting  
* Key Points:  
  * `TableContainer` (Redux-connected) provides data, pagination, and sort handlers  
  * `TableComponent` renders table \+ loading/error/empty states  
  * Pagination and sorting update URL query params  
  * Uses `@openedx/paragon` Table component  
  * Newer tables use `DataTable` from Paragon (v2 pattern)  
* Migration: Moving toward hook-based DataTable with manual pagination

### **7\. Role-Based Access Control (RBAC)**

* Pattern: Use `edx-rbac` library for permission checks  
* Key Points:  
  * Check user roles/permissions before rendering protected features  
  * Roles attached to authenticated user from JWT/backend  
  * Gate routes and components based on role

### **8\. Internationalization (i18n)**

* Pattern: `@edx/frontend-platform/i18n` with FormattedMessage and defineMessages  
* Key Points:  
  * Define message objects with IDs and placeholders: `defineMessages({ msgId: { id: '...', defaultMessage: '...' } })`  
  * Use `<FormattedMessage />` component or `useIntl()` hook  
  * Extract strings for translation via `npm run i18n_extract`  
  * Pull translations from Transifex

### **9\. Utility Functions (Pure & Reusable)**

* Pattern: Centralize helper functions in `src/utils.js` and feature-specific utils  
* Key Points:  
  * Form validators: `isRequired`, `maxLength512`, `isValidEmail`, etc.  
  * Data transformers: `camelCaseDict`, `snakeCaseDict`, `snakeCaseObjectToForm`  
  * UI helpers: `downloadCsv`, `truncateString`, `capitalizeFirstLetter`  
  * Date/time: `i18nFormatTimestamp`, `isTodayBetweenDates`  
  * Export from `src/utils.js` for widespread reuse

### **10\. Higher-Order Components (HOCs) for Props Injection**

* Pattern: Inject router location/params/navigate without strict dependency  
* Key Points:  
  * `withLocation`, `withParams`, `withNavigate` wrap components  
  * Useful for class components predating React Router v6 hooks  
  * Gradually being replaced by functional components with hooks

### **11\. Error Handling & Logging**

* Pattern: Consistent use of `logError()` from `@edx/frontend-platform/logging`  
* Key Points:  
  * Log API errors and validation failures  
  * QueryClient has a `QueryCache` with error handler for async errors  
  * Display user-friendly error alerts via `@openedx/paragon` Alert component

### **12\. Component Organization**

* Structure:  
* Code

```
src/
  components/          # Presentational components
  containers/          # Redux-connected containers (legacy)
  data/
    services/          # API service classes
    actions/           # Redux actions
    reducers/          # Redux reducers
    constants/         # Shared constants & enums
    hooks.js           # Custom React hooks
  utils.js             # Global utility functions
  hoc/                 # Higher-order components
```

*   
* Naming:  
  * Feature folders: `learner-credit-management/`, `settings/`, `subscriptions/`  
  * Sub-folders: `data/`, `components/`, with `hooks.js`, `constants.js`, `utils.js`

### **13\. Code Quality & Testing**

* Testing Libraries: Jest \+ React Testing Library  
* Patterns:  
  * Mock API services via `jest.mock()`  
  * Wrap components with Redux Provider \+ QueryClientProvider in tests  
  * Use `renderHook` for testing custom hooks  
  * Test reducers independently from components  
* CI/CD: Makefile targets for `i18n.extract`, `validate-no-uncommitted-package-lock-changes`, etc.

### **14\. Configuration & Features**

* Pattern: Feature flags via `src/config.js` (imported as `{ features }`)  
* Key Points:  
  * Conditionally render features based on config  
  * Environment variables injected at build time

---

### **Quick Checklist for New Code**

When implementing a new feature in this repo:

*  Create API service class in `src/data/services/` if needed (static methods, handle camelCase/snake\_case)  
*  Use `useQuery` from React Query for server state (or `useReducer` \+ Context for UI state)  
*  Define validators as pure functions for forms  
*  Use `@openedx/paragon` components (Table → DataTable, Form, Button, etc.)  
*  Wrap feature state in Context if needed; keep separate from server state  
*  Add i18n messages with `defineMessages()` and `<FormattedMessage />`  
*  Export reusable utilities/hooks from `data/` subfolders  
*  Test with Jest \+ RTL; mock services and providers  
*  Avoid nested context providers (use ADR \#8 guidance)  
*  Log errors via `logError()`

