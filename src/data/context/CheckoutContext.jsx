/**
 * CheckoutContext
 *
 * Manages multi-step checkout form state using React Context + useReducer,
 * following the pattern in enterprise-frontend-arch-patterns.md §4 & §5.
 *
 * State is intentionally kept in-memory (no sessionStorage) to match the
 * React-first architecture. In production this would be backed by server
 * state fetched via useQuery (React Query).
 */

import React, { createContext, useContext, useReducer, useMemo } from 'react';

// ── Default state ─────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  // Flow discriminator
  flow: 'new', // 'new' | 'existing'

  // Step 1 – Plan Details
  numLicenses: '',
  fullName: '',
  workEmail: '',
  country: '',

  // Auth
  isLoggedIn: false,

  // Step 2 – Account Details
  companyName: '',
  urlName: '',

  // Step 3 – Billing
  billingFirstName: '',
  billingLastName: '',
  billingAddress1: '',
  billingAddress2: '',
  billingCity: '',
  billingCountry: '',
  billingState: '',
  billingZip: '',
  cardLast4: '',
};

// ── Reducer ───────────────────────────────────────────────────────────────

function checkoutReducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, DEFAULT_STATE);

  // Stable helpers exposed to consumers
  const updateCheckout = (updates) => dispatch({ type: 'UPDATE', payload: updates });
  const resetCheckout  = ()        => dispatch({ type: 'RESET' });

  const value = useMemo(
    () => ({ state, updateCheckout, resetCheckout }),
    [state],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

// ── Custom hook ───────────────────────────────────────────────────────────

/**
 * useCheckout() — access checkout state and updater from any component.
 *
 * BACKEND integration note:
 * In production the initial state would be hydrated from authenticated user
 * data fetched via:
 *   // BACKEND: replace with useQuery(['currentUser'], fetchCurrentUser)
 *   //          to pre-fill fullName, workEmail, country for logged-in users.
 *
 * Pattern: BFF (enterprise-access §7) — use a BFF endpoint that aggregates user profile
 *   data from multiple services (LMS user API + enterprise-customer) in a single call.
 *   Architecture: Context (request data) → Handler (business logic) → ResponseBuilder (output).
 * Pattern: RBAC (enterprise-access §1) — JWT claims provide implicit access; verify
 *   SYSTEM_ENTERPRISE_ADMIN_ROLE or SYSTEM_ENTERPRISE_OPERATOR_ROLE before returning
 *   enterprise-specific user context.
 * Pattern: Service Client (enterprise-access §8) — fetchCurrentUser should use LmsApiClient
 *   (extends BaseUserApiClient) to forward the user's JWT for user-context requests.
 */
export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used inside CheckoutProvider');
  return ctx;
}
