// BACKEND: replace with GET /api/v1/academy-plans?type=essentials
// Returns the available academy/focus areas for the Essentials plan
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
