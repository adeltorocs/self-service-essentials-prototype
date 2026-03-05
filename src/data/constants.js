export const PRICE_PER_LICENSE = 149; // USD/yr
export const TRIAL_DAYS = 14;
export const MIN_LICENSES = 5;
export const MAX_LICENSES = 50;
export const STORAGE_KEY = 'essentials_checkout';

export const CHECKOUT_STEPS = [
  { id: 'plan-details',    label: 'Plan Details' },
  { id: 'account-details', label: 'Account Details' },
  { id: 'billing-details', label: 'Billing Details' },
];

export const ROUTES = {
  PLAN_DETAILS_NEW:      '/',
  PLAN_DETAILS_EXISTING: '/existing',
  CREATE_ACCOUNT:        '/create-account',
  LOGIN:                 '/login',
  PLAN_DETAILS_LOGGEDIN: '/plan-details',
  ACCOUNT_DETAILS:       '/account-details',
  BILLING_DETAILS:       '/billing-details',
  SUCCESS:               '/success',
  ADMIN:                 '/admin',
};
