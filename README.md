# edX Enterprise Essentials — Self-Service Checkout Prototype

A React prototype for the edX Enterprise Essentials subscription checkout flow. Built with [Paragon](https://paragon-openedx.netlify.app/) (the Open edX design system) and mocked data — no backend required.

---

## Getting Started

**Requirements:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start
# → http://localhost:3000
```

---

## User Flows

Two entry points represent different user types. All routing is client-side via React Router.

### Flow 1 — New User (`/`)

```
/                   Plan Details (unauthenticated)
  └─ /create-account    Create account (Step 1b)
       └─ /plan-details     Plan Details (authenticated)
            └─ /account-details   Company name & URL (Step 2)
                 └─ /billing-details   Payment & billing (Step 3)
                      └─ /success        Order confirmation
                           └─ /admin       Subscription management
```

### Flow 2 — Existing User (`/existing`)

```
/existing           Plan Details (unauthenticated)
  └─ /login             Log in (Step 1b)
       └─ /plan-details     Plan Details (authenticated)
            └─ /account-details   Company name & URL (Step 2)
                 └─ /billing-details   Payment & billing (Step 3)
                      └─ /success        Order confirmation
                           └─ /admin       Subscription management
```

---

## File Structure

```
index.html                       Vite entry point
public/
  svg/
    edx-enterprise-logo-white.svg
    edx-enterprise-logo-black.svg

src/
  index.jsx                      App bootstrap (providers + ReactDOM.render)
  App.jsx                        Route definitions

  components/
    checkout/
      PlanDetailsPage.jsx        Step 1a — plan + license selection
      CreateAccountPage.jsx      Step 1b — new user account creation
      LoginPage.jsx              Step 1b — existing user login
      PlanDetailsLoggedInPage.jsx  Step 1 (post-auth) — confirm plan
      AccountDetailsPage.jsx     Step 2 — company name & URL slug
      BillingDetailsPage.jsx     Step 3 — card & billing address
      SuccessPage.jsx            Order confirmation
      CountrySelect.jsx          Reusable country dropdown
    layout/
      CheckoutLayout.jsx         Two-column page shell (form + sidebar)
      CheckoutStepper.jsx        3-step progress indicator
      PurchaseSummary.jsx        Right-sidebar pricing summary
      EssentialsPlanCard.jsx     Plan description card
      QuoteBox.jsx               Testimonial / pull-quote block
      SiteHeader.jsx             Top navigation bar
      SiteFooter.jsx             Footer with legal links
    portal/
      AdminPortalPage.jsx        Post-purchase subscription management

  data/
    constants.js                 Price, trial days, route paths, min/max licenses
    utils.js                     calcTotal, getSubscriptionDates, formatters
    hooks.js                     useAcademyData (mocked React Query hook)
    context/
      CheckoutContext.jsx        Global checkout state (Context + useReducer)

  mocks/
    academyData.js               Mocked academy/plan data
    countriesData.js             Country list (excludes BY & RU; US first)

  styles/
    app.css                      Custom styles supplementing Paragon tokens
    paragon.css                  Local Paragon CSS (tilde-import stripped for Vite)
```

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI framework | React | 18 |
| Build tool | Vite | 5 |
| Design system | @openedx/paragon | 22 |
| Routing | react-router-dom | 6 |
| Server state | @tanstack/react-query | 5 |
| Global state | React Context + useReducer | — |

---

## State Management

Checkout state lives in `CheckoutContext` (Context API + `useReducer`) and is accessible from any component via `useCheckout()`.

```js
// Shape of checkout state
{
  flow,             // 'new' | 'existing'
  numLicenses,      // number
  fullName,         // string
  workEmail,        // string
  country,          // ISO 3166-1 alpha-2 code
  isLoggedIn,       // boolean

  // Step 2 — Account Details
  companyName,
  urlName,          // auto-generated slug from companyName

  // Step 3 — Billing Details
  billingFirstName,
  billingLastName,
  billingAddress1,
  billingAddress2,
  billingCity,
  billingCountry,
  billingState,
  billingZip,
  cardLast4,
}
```

State is also mirrored to `sessionStorage` (key: `essentials_checkout`) so it survives page reloads during development.

---

## Backend Annotation Pattern

Every mock data fixture and simulated API call is annotated with a `// BACKEND:` comment describing what real endpoint or SDK call should replace it. Example:

```js
// BACKEND: replace with GET /api/v1/academies/:academyId
const academyData = { ... };

// BACKEND: replace with POST /api/v1/subscriptions/purchase
//   Payment card should be tokenized here via Stripe/Braintree SDK
//   before sending to the backend. Do NOT send raw card data.
setTimeout(() => { navigate(ROUTES.SUCCESS); }, 800);
```

Search for `// BACKEND` across the `src/` tree to find all integration points.

---

## Business Rules

| Rule | Value |
|---|---|
| Price | $149 USD / license / year |
| Trial length | 14 days |
| Due at checkout | $0 |
| Subscription start | Day after trial ends |
| Subscription end | 1 year after subscription start |
| License range | 5 – 50 |
| Academy | AI Academy (hardcoded for prototype) |
| Country exclusions | Belarus (BY) and Russia (RU) omitted |
