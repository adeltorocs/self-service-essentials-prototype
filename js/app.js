/* =============================================================
   edX Enterprise Essentials – Checkout Prototype
   Shared state management and utility functions
   ============================================================= */

'use strict';

// ── CONSTANTS ──────────────────────────────────────────────────
const PRICE_PER_LICENSE = 149; // USD/yr
const ACADEMY_NAME      = 'AI Academy';
const STORAGE_KEY       = 'essentials_checkout';

// ── STATE ──────────────────────────────────────────────────────
const defaultState = {
  flow:          'new',      // 'new' | 'existing'
  numLicenses:   '',
  fullName:      '',
  workEmail:     '',
  country:       '',
  isLoggedIn:    false,
  // Account details
  companyName:   '',
  urlName:       '',
  // Billing
  billingFirstName: '',
  billingLastName:  '',
  billingAddress1:  '',
  billingAddress2:  '',
  billingCity:      '',
  billingCountry:   '',
  billingState:     '',
  billingZip:       '',
  cardLast4:        '',
};

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch (_) { return { ...defaultState }; }
}

function saveState(updates) {
  const current = loadState();
  const next = { ...current, ...updates };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function clearState() { sessionStorage.removeItem(STORAGE_KEY); }

// ── DATE HELPERS ───────────────────────────────────────────────
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getSubscriptionDates() {
  const today     = new Date();
  const trialEnd  = addDays(today, 14);      // trial starts 14 days from today
  const subEnd    = addYears(trialEnd, 1);   // subscription runs 1 year from trial start
  return { trialEnd, subEnd };
}

// ── PRICING HELPERS ────────────────────────────────────────────
function calcTotal(numLicenses) {
  const n = parseInt(numLicenses, 10);
  if (!n || n < 1) return null;
  return n * PRICE_PER_LICENSE;
}

function fmtUSD(amount) {
  return '$' + amount.toLocaleString('en-US') + ' USD';
}

// ── PURCHASE SUMMARY RENDERER ──────────────────────────────────
function renderPurchaseSummary(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const state = loadState();
  const n     = parseInt(state.numLicenses, 10);
  const total = calcTotal(n);
  const { trialEnd, subEnd } = getSubscriptionDates();

  const licensesDisplay = n && n > 0 ? `x${n}` : '—';
  const totalDisplay    = total ? `$${(total).toLocaleString('en-US')} USD` : '—';
  const autoRenew       = total ? `Auto-renews annually at $${total.toLocaleString('en-US')}/yr. Cancel at any time.` : '';

  el.innerHTML = `
    <div class="ps-title">Purchase summary</div>
    <div class="ps-academy">${ACADEMY_NAME}</div>
    <div class="ps-row">
      <span class="ps-label">Essentials subscription,<br>price per user, paid yearly</span>
      <span class="ps-value">$${PRICE_PER_LICENSE} USD</span>
    </div>
    <div class="ps-row">
      <span class="ps-label">Number of licenses</span>
      <span class="ps-value" id="ps-licenses-val">${licensesDisplay}</span>
    </div>
    <hr class="ps-divider">
    <div class="ps-row">
      <span class="ps-label">
        Total after 14-day<br>free trial
        ${autoRenew ? `<small>${autoRenew}</small>` : ''}
      </span>
      <span class="ps-value"><span id="ps-total-val">${totalDisplay}</span><small class="ps-value-unit">/yr</small></span>
    </div>
    <div class="ps-row ps-total">
      <span class="ps-label">Due today</span>
      <span class="ps-value">$0</span>
    </div>
    <div class="upgrade-notice">
      <img src="svg/shopping-bag.svg" width="14" height="14" alt="">
      Upgrade to Teams
    </div>
  `;
}

function updatePurchaseSummaryLicenses(numLicenses) {
  const n     = parseInt(numLicenses, 10);
  const total = calcTotal(n);
  const lEl   = document.getElementById('ps-licenses-val');
  const tEl   = document.getElementById('ps-total-val');
  if (lEl) lEl.textContent = n && n > 0 ? `x${n}` : '—';
  if (tEl) {
    tEl.textContent = total
      ? `$${total.toLocaleString('en-US')} USD`
      : '—';
  }
  // Update auto-renew sub-note
  document.querySelectorAll('.ps-row .ps-label').forEach(label => {
    if (label.innerHTML.includes('Total after')) {
      let small = label.querySelector('small');
      if (total) {
        if (!small) {
          small = document.createElement('small');
          label.appendChild(small);
        }
        small.textContent = `Auto-renews annually at $${total.toLocaleString('en-US')}/yr. Cancel at any time.`;
      } else if (small) {
        small.remove();
      }
    }
  });
}

// ── VALIDATION HELPERS ─────────────────────────────────────────
function showFieldError(fieldId, msg) {
  const group = document.getElementById(fieldId)?.closest('.pgn-form-group');
  if (!group) return;
  group.classList.add('has-error');
  let err = group.querySelector('.form-error-msg');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error-msg';
    group.appendChild(err);
  }
  err.textContent = msg;
}

function clearFieldError(fieldId) {
  const group = document.getElementById(fieldId)?.closest('.pgn-form-group');
  if (!group) return;
  group.classList.remove('has-error');
  const err = group.querySelector('.form-error-msg');
  if (err) err.textContent = '';
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.pgn-form-group.has-error').forEach(g => {
    g.classList.remove('has-error');
    const err = g.querySelector('.form-error-msg');
    if (err) err.textContent = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailError(email) {
  if (!email || email.length < 6) return 'Please enter valid email (too short)';
  if (!isValidEmail(email)) return 'Please enter valid email';
  return null;
}

// ── PASSWORD VISIBILITY TOGGLE ─────────────────────────────────
function initPasswordToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.innerHTML = isText ? eyeIcon() : eyeOffIcon();
  });
}

function eyeIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function eyeOffIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

// ── CARD NUMBER FORMATTER ──────────────────────────────────────
function initCardNumberInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
}

function initExpiryInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });
}

function initCvcInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });
}

// ── URL SLUG HELPERS ───────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── STEPPER BUILDER ────────────────────────────────────────────
// steps: array of {label, status} where status is 'done'|'active'|'inactive'
function buildStepper(steps) {
  const container = document.getElementById('checkout-stepper');
  if (!container) return;
  container.innerHTML = steps.map((step, i) => `
    <div class="stepper-step ${step.status}">
      <div class="step-circle">
        <span class="step-num">${i + 1}</span>
      </div>
      <span class="step-label">${step.label}</span>
    </div>
  `).join('');
}

// ── DOM READY HELPER ───────────────────────────────────────────
function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}
