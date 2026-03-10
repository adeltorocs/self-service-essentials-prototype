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
 *
 * Pattern: BFF (enterprise-access §7) — this endpoint should aggregate plan metadata
 *   and academy catalog data into a single response using Context → Handler → ResponseBuilder.
 * Pattern: Service Client (enterprise-access §8) — Handler calls EnterpriseCatalogApiClient
 *   (extends BaseOAuthClient for service-to-service auth) with @backoff retry.
 * Pattern: DRF Spectacular (enterprise-access §2) — response uses a dedicated
 *   PlanDetailsResponseSerializer with @extend_schema decorator for OpenAPI docs.
 * Pattern: Caching (enterprise-access §13) — plan/academy metadata uses 30 min TieredCache
 *   timeout (content metadata tier). Frontend mirrors with staleTime: Infinity for static data.
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
 *   (or use @edx/i18n-module country list — preferred for static data)
 *
 * Pattern: Caching (enterprise-access §13) — country lists are static; use Infinity staleTime
 *   on the frontend and long-TTL TieredCache on the backend.
 * Note: Belarus (BY) and Russia (RU) exclusions should be enforced server-side via
 *   a compliance filter, not solely on the client.
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
 *
 * Pattern: DRF ViewSet with custom @action (enterprise-access §3) — implement as a
 *   @action(detail=False, methods=['get']) on the EnterpriseCustomerViewSet.
 * Pattern: Validation (enterprise-access §14) — slug format validation (field-level:
 *   regex, length) should happen both client-side and in the serializer.
 * Pattern: Caching (enterprise-access §13) — short TTL (30s staleTime here); backend
 *   should NOT cache availability checks since slug ownership changes on writes.
 */
export function useUrlAvailability(slug) {
  return useQuery({
    queryKey: ['urlAvailability', slug],
    queryFn: () => ({ available: slug.length > 0 }), // mock: always available
    enabled: slug.length > 0,
    staleTime: 30_000,
  });
}
