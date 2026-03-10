// BACKEND: replace with GET /api/v1/academy-plans?type=essentials
// Returns the available academy/focus areas for the Essentials plan.
//
// Pattern: DRF ViewSet (enterprise-access §3) — served by an AcademyPlanViewSet with
//   PermissionRequiredMixin. Uses dynamic get_serializer_class() to return
//   AcademyPlanResponseSerializer (read) vs AcademyPlanCreateSerializer (write).
// Pattern: DRF Spectacular (enterprise-access §2) — @extend_schema on the list action
//   defines the response shape including nested academy/plan objects.
// Pattern: Service Client (enterprise-access §8) — academy course counts fetched via
//   EnterpriseCatalogApiClient (extends BaseOAuthClient for service-to-service auth).
// Pattern: Model (enterprise-access §9) — AcademyPlan model extends TimeStampedModel
//   with simple_history for audit trail; PII annotation required (# no_pii).
export const ACADEMY = {
  name: 'Artificial Intelligence',
  shortName: 'AI Academy',
  courseCount: 10,
  tags: ['AI foundations', 'Intermediate AI', 'Advanced AI', 'AI for business'],
  description:
    'This pathway helps your team build a strong foundation in AI, and equips '
    + 'them to skillfully incorporate AI into existing organizational strategies.',
  learnMoreUrl: 'https://business.edx.org/course-library-plans-teams/',
};

// BACKEND: replace with GET /api/v1/plans/essentials
// Pattern: DRF Spectacular (enterprise-access §2) — separate PlanRequestSerializer and
//   PlanResponseSerializer for clear API contracts.
// Pattern: Caching (enterprise-access §13) — plan pricing is semi-static; use 30 min
//   TieredCache timeout (content metadata tier).
export const PLAN = {
  name: 'Essentials Plan',
  pricePerLicense: 149, // USD/yr
  currency: 'USD',
  billingCycle: 'yearly',
  trialDays: 14,
  minLicenses: 5,
  maxLicenses: 50,
  changeAcademyUrl: 'https://business.edx.org/course-library-plans-teams/',
  upgradeToTeamsUrl: 'https://business.edx.org/course-library-plans-teams/',
};

export const TESTIMONIAL = {
  quote:
    'The need for qualified IT workers is at an unprecedented level, and our '
    + 'partnership with edX is providing the skills needed to be successful in '
    + 'an IT career.',
  author: 'Eric Westphal',
  title: 'Leader of Global Workforce Strategy and\nEconomic Development, Cognizant',
};
