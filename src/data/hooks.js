/**
 * Custom React hooks for the Essentials checkout.
 *
 * Following enterprise-frontend-arch-patterns.md §1 (React Query) and §4 (Context).
 * Each useQuery call has a "BACKEND:" comment indicating the real API it should call.
 */

import { useQuery } from '@tanstack/react-query';
import { ACADEMY, PLAN } from '../mocks/academyData';
import { COUNTRIES } from '../mocks/countriesData';

// ── Plan / Academy data ───────────────────────────────────────────────────

/**
 * Returns academy and plan details.
 *
 * BACKEND: replace mock with:
 *   GET /api/v1/plans/essentials
 *   returns { plan: {...}, academy: {...} }
 */
export function usePlanDetails() {
  return useQuery({
    queryKey: ['plan', 'essentials'],
    queryFn: () => ({ plan: PLAN, academy: ACADEMY }),
    staleTime: Infinity, // static data — no refetch needed
  });
}

// ── Countries list ────────────────────────────────────────────────────────

/**
 * Returns the list of selectable countries.
 *
 * BACKEND: replace mock with:
 *   GET /api/v1/countries
 *   (or use @edx/i18n-module country list)
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => COUNTRIES,
    staleTime: Infinity,
  });
}

// ── URL availability check ────────────────────────────────────────────────

/**
 * Checks whether a given enterprise URL slug is available.
 *
 * BACKEND: replace mock with:
 *   GET /api/v1/enterprise-customer/url-availability?slug={slug}
 *   returns { available: boolean }
 */
export function useUrlAvailability(slug) {
  return useQuery({
    queryKey: ['urlAvailability', slug],
    queryFn: () => ({ available: slug.length > 0 }), // mock: always available
    enabled: slug.length > 0,
    staleTime: 30_000,
  });
}
