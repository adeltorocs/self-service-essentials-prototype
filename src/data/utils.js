import { PRICE_PER_LICENSE, TRIAL_DAYS } from './constants';

// ── Pricing ─────────────────────────────────────────────────────────────────

export function calcTotal(numLicenses) {
  const n = parseInt(numLicenses, 10);
  if (!n || n < 1) return null;
  return n * PRICE_PER_LICENSE;
}

export function fmtUSD(amount) {
  return `$${Number(amount).toLocaleString('en-US')} USD`;
}

// ── Dates ───────────────────────────────────────────────────────────────────

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getSubscriptionDates() {
  const today    = new Date();
  const trialEnd = addDays(today, TRIAL_DAYS);
  const subEnd   = addYears(trialEnd, 1);
  return { today, trialEnd, subEnd };
}

// ── Validation ──────────────────────────────────────────────────────────────

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function emailError(email) {
  if (!email || email.length < 6) return 'Please enter a valid email (too short)';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
}

// ── URL / Slug ───────────────────────────────────────────────────────────────

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Card input formatters ────────────────────────────────────────────────────

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export function formatCvc(value) {
  return value.replace(/\D/g, '').slice(0, 4);
}
