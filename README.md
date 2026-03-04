# edX Enterprise Essentials — Self-Service Checkout Prototype

A static HTML/CSS/JS prototype for the edX Enterprise Essentials subscription checkout flow. No build step or server required — open any HTML file directly in a browser, or serve locally with `npx serve`.

---

## Getting Started

```bash
# Option 1: open directly
open index-new-user.html

# Option 2: serve locally (recommended to avoid CORS quirks)
npx serve .
# then visit http://localhost:3000
```

---

## User Flows

There are two entry points, each representing a different user type:

### Flow 1 — New User (`index-new-user.html`)
The user does not yet have an edX account.

```
index-new-user.html        Plan Details (unauthenticated)
  └─ create-account.html   Create account (Step 1b)
       └─ account-details.html   Company name & URL (Step 2)
            └─ billing-details.html   Payment & billing (Step 3)
                 └─ success.html        Order confirmation
                      └─ admin-portal.html  Subscription management
```

### Flow 2 — Existing User (`index-existing-user.html`)
The user already has an edX account.

```
index-existing-user.html   Plan Details (unauthenticated)
  └─ login.html            Log in (Step 1b)
       └─ plan-details-logged-in.html   Plan Details (authenticated)
            └─ account-details.html     Company name & URL (Step 2)
                 └─ billing-details.html    Payment & billing (Step 3)
                      └─ success.html        Order confirmation
                           └─ admin-portal.html  Subscription management
```

---

## File Structure

```
index-new-user.html          Flow 1 entry point
index-existing-user.html     Flow 2 entry point
create-account.html          New user account creation
login.html                   Existing user login
plan-details-logged-in.html  Plan details after authentication
account-details.html         Company name & URL (checkout step 2)
billing-details.html         Payment & billing address (checkout step 3)
success.html                 Order confirmation
admin-portal.html            Subscription management portal
error.html                   Generic error page

css/
  styles.css                 All styles (Paragon-inspired design system)

js/
  app.js                     Shared state, rendering, and utility functions
  countries.js               Country list (excludes Belarus & Russia; US listed first)

svg/
  edx-enterprise-logo-white.svg
  edx-enterprise-logo-black.svg
  quotation-mark.svg
  shopping-bag.svg

mockups/                     Reference PNG mockups used during design
```

---

## State Management

State is persisted across pages using `sessionStorage` under the key `essentials_checkout`.

```js
{
  flow,             // 'new' | 'existing'
  numLicenses,      // number of licenses selected
  fullName,         // user's full name
  workEmail,        // user's work email
  country,          // user's country
  isLoggedIn,       // boolean

  // Account details
  companyName,
  urlName,          // auto-generated slug from companyName

  // Billing
  billingFirstName,
  billingLastName,
  billingAddress1,
  billingAddress2,
  billingCity,
  billingCountry,
  billingState,
  billingZip,
  cardLast4
}
```

Key state functions in `js/app.js`:
- `saveState(updates)` — merges updates into stored state
- `loadState()` — returns the full current state object

---

## Key JS Utilities (`js/app.js`)

| Function | Description |
|---|---|
| `renderPurchaseSummary(containerId)` | Renders the right-sidebar purchase summary |
| `updatePurchaseSummaryLicenses(num)` | Live-updates license count and total in sidebar |
| `buildStepper(steps)` | Renders the 3-step checkout stepper into `#checkout-stepper` |
| `showFieldError(fieldId, msg)` | Shows inline validation error on a form field |
| `clearFieldError(fieldId)` | Clears inline validation error on a field |
| `clearAllErrors(formId)` | Clears all errors within a form |
| `getSubscriptionDates()` | Returns `{ trialEnd, subEnd }` Date objects |
| `calcTotal(numLicenses)` | Returns the annual total in USD, or `null` |
| `populateCountrySelect(selectId, selected)` | Fills a `<select>` from the COUNTRIES array |
| `slugify(text)` | Lowercases text and replaces spaces/special chars to produce a URL slug |
| `initPasswordToggle(toggleId, inputId)` | Wires up show/hide password button |
| `initCardNumberInput(inputId)` | Formats card number input with spaces |
| `initExpiryInput(inputId)` | Formats expiry input as MM/YY |
| `initCvcInput(inputId)` | Restricts CVC to 3–4 digits |

---

## Design System

Paragon-inspired. Defined via CSS custom properties in `css/styles.css`.

| Token | Value | Usage |
|---|---|---|
| `--clr-primary` | `#0a2b25` | Dark teal — header, primary buttons, text |
| `--clr-brand` | `#ffc433` | Yellow — brand accent |
| `--clr-form-card-bg` | `#f7f7f5` | Grey — form box backgrounds (`.form-card`) |
| `--clr-card-bg` | `#ffffff` | White — white card backgrounds (`.card`) |
| `--clr-border` | `#e0dfe0` | Light grey — borders, secondary button outlines |
| `--clr-error` | `#c00` | Red — validation errors |
| `--clr-success` | `#1a7a4a` | Green — success states |

Font: **Nunito Sans** via Google Fonts.

### Component Classes

| Class | Description |
|---|---|
| `.form-card` | Grey-background form box |
| `.card` | White-background card |
| `.btn-primary` | Dark teal filled button |
| `.btn-outline` | Teal-bordered transparent button |
| `.btn-brand` | Yellow filled button |
| `.btn-lg` | Large button (52px height) |
| `.btn-sm` | Small button (36px height) |
| `.btn-full` | Full-width button |
| `.pgn-form-group` | Form field wrapper with floating label support |
| `.has-error` | Applied to `.pgn-form-group` to show inline error |

---

## Business Rules

- **Price:** $149 USD per license per year
- **Trial:** 14 days from today; $0 due at checkout
- **Subscription start:** Day after trial ends
- **Subscription end:** 1 year after subscription start
- **Academy:** AI Academy (hardcoded for this prototype)
- **Password rules:** Minimum 8 characters; only lowercase letters, numbers, and dashes (`-`)
- **Country list:** All countries except Belarus (BY) and Russia (RU); United States listed first

---

## Validation Pattern

Inline field errors follow this pattern:

```html
<div class="pgn-form-group has-error">
  <label for="field-id">Label</label>
  <input type="text" id="field-id" />
  <p class="form-error-msg">Error message here.</p>
</div>
```

The `.has-error` class is toggled by `showFieldError(id, msg)` / `clearFieldError(id)`.
