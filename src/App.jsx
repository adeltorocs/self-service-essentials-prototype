/**
 * App.jsx
 *
 * Main application shell.
 * Defines all routes and wraps the app in providers:
 *   - CheckoutProvider (Context + useReducer for multi-step form state)
 *   - QueryClientProvider (React Query for server state)
 *   - BrowserRouter (React Router v6)
 *
 * Route structure:
 *   /              → PlanDetailsPage  (new user flow, step 1a)
 *   /existing      → PlanDetailsPage  (existing user flow, step 1a)
 *   /create-account → CreateAccountPage (new user, step 1b)
 *   /login          → LoginPage        (existing user, step 1b)
 *   /plan-details   → PlanDetailsLoggedInPage (step 1, post-auth)
 *   /account-details → AccountDetailsPage (step 2)
 *   /billing-details → BillingDetailsPage (step 3)
 *   /success        → SuccessPage
 *   /admin          → AdminPortalPage
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PlanDetailsPage           from './components/checkout/PlanDetailsPage';
import CreateAccountPage         from './components/checkout/CreateAccountPage';
import LoginPage                 from './components/checkout/LoginPage';
import PlanDetailsLoggedInPage   from './components/checkout/PlanDetailsLoggedInPage';
import AccountDetailsPage        from './components/checkout/AccountDetailsPage';
import BillingDetailsPage        from './components/checkout/BillingDetailsPage';
import SuccessPage               from './components/checkout/SuccessPage';
import AdminPortalPage           from './components/portal/AdminPortalPage';

import { ROUTES } from './data/constants';

function App() {
  return (
    <Routes>
      {/* New user entry */}
      <Route path={ROUTES.PLAN_DETAILS_NEW}      element={<PlanDetailsPage flow="new" />} />
      {/* Existing user entry */}
      <Route path={ROUTES.PLAN_DETAILS_EXISTING} element={<PlanDetailsPage flow="existing" />} />
      {/* Auth sub-steps */}
      <Route path={ROUTES.CREATE_ACCOUNT}        element={<CreateAccountPage />} />
      <Route path={ROUTES.LOGIN}                 element={<LoginPage />} />
      {/* Logged-in checkout steps */}
      <Route path={ROUTES.PLAN_DETAILS_LOGGEDIN} element={<PlanDetailsLoggedInPage />} />
      <Route path={ROUTES.ACCOUNT_DETAILS}       element={<AccountDetailsPage />} />
      <Route path={ROUTES.BILLING_DETAILS}       element={<BillingDetailsPage />} />
      {/* Post-checkout */}
      <Route path={ROUTES.SUCCESS}               element={<SuccessPage />} />
      <Route path={ROUTES.ADMIN}                 element={<AdminPortalPage />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.PLAN_DETAILS_NEW} replace />} />
    </Routes>
  );
}

export default App;
