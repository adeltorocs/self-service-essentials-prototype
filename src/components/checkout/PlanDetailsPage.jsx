/**
 * PlanDetailsPage
 *
 * Step 1 of the checkout flow — used by BOTH new and existing users.
 * - flow='new'      → submits to /create-account
 * - flow='existing' → submits to /login
 *
 * Uses Paragon Form components for all inputs and inline validation.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from '@openedx/paragon';

import CheckoutLayout from '../layout/CheckoutLayout';
import EssentialsPlanCard from '../layout/EssentialsPlanCard';
import PurchaseSummary from '../layout/PurchaseSummary';
import QuoteBox from '../layout/QuoteBox';
import CountrySelect from './CountrySelect';

import { useCheckout } from '../../data/context/CheckoutContext';
import { isValidEmail, emailError } from '../../data/utils';
import { PLAN } from '../../mocks/academyData';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'active'   },
  { label: 'Account Details', status: 'inactive' },
  { label: 'Billing Details', status: 'inactive' },
];

function PlanDetailsPage({ flow = 'new' }) {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  // Local form state
  const [numLicenses, setNumLicenses] = useState(state.numLicenses || '');
  const [fullName,    setFullName]    = useState(state.fullName    || '');
  const [workEmail,   setWorkEmail]   = useState(state.workEmail   || '');
  const [country,     setCountry]     = useState(state.country     || '');

  // Validation errors
  const [errors, setErrors] = useState({});

  // ── Derived ──────────────────────────────────────────────────────────────

  const licensesInt = parseInt(numLicenses, 10);
  const isFormReady = (
    licensesInt >= PLAN.minLicenses
    && licensesInt <= PLAN.maxLicenses
    && fullName.trim().length > 0
    && isValidEmail(workEmail.trim())
    && country !== ''
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleLicensesChange(e) {
    const val = e.target.value;
    setNumLicenses(val);
    updateCheckout({ numLicenses: val });

    const n = parseInt(val, 10);
    if (val !== '' && n < PLAN.minLicenses) {
      setErrors((prev) => ({ ...prev, numLicenses: `Must be at least ${PLAN.minLicenses} licenses.` }));
    } else if (n > PLAN.maxLicenses) {
      setErrors((prev) => ({
        ...prev,
        numLicenses: `You can only have up to ${PLAN.maxLicenses} licenses on the Essentials plan. Either decrease the number of licenses or choose a different plan.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, numLicenses: undefined }));
    }
  }

  function handleEmailBlur() {
    const err = emailError(workEmail.trim());
    if (err && workEmail.trim()) {
      setErrors((prev) => ({ ...prev, workEmail: err }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    const n = parseInt(numLicenses, 10);
    if (!n || n < PLAN.minLicenses) {
      newErrors.numLicenses = `Must be at least ${PLAN.minLicenses} licenses.`;
    } else if (n > PLAN.maxLicenses) {
      newErrors.numLicenses = `You can only have up to ${PLAN.maxLicenses} licenses on the Essentials plan. Either decrease the number of licenses or choose a different plan.`;
    }
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    const emailErr = emailError(workEmail.trim());
    if (emailErr) {
      newErrors.workEmail = emailErr;
    }
    if (!country) {
      newErrors.country = 'Please select your country of residence.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateCheckout({ numLicenses, fullName: fullName.trim(), workEmail: workEmail.trim(), country, flow });

    // BACKEND: before navigating, check if the email already has an edX account:
    //   POST /api/v1/auth/email-exists  { email: workEmail }
    //   → if exists AND flow='new', redirect to /login (existing account found)
    //   → if not exists AND flow='existing', show "no account" error
    if (flow === 'new') {
      navigate(ROUTES.CREATE_ACCOUNT);
    } else {
      navigate(ROUTES.LOGIN);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const leftContent = (
    <>
      <EssentialsPlanCard />

      <form id="plan-details-form" onSubmit={handleSubmit} noValidate>
        {/* Licenses */}
        <div className="form-card">
          <h2 className="form-section-title">How many licenses will you need?</h2>
          <p className="form-section-subtitle">
            Enter in the number of licenses you want to purchase. As an
            administrator, you can issue and swap licenses between employees.
          </p>

          <Form.Group controlId="num-licenses" isInvalid={!!errors.numLicenses}>
            <Form.Label>Number of licenses</Form.Label>
            <Form.Control
              type="number"
              value={numLicenses}
              onChange={handleLicensesChange}
              min={PLAN.minLicenses}
              max={PLAN.maxLicenses}
              autoComplete="off"
            />
            {errors.numLicenses && (
              <Form.Control.Feedback type="invalid">
                {errors.numLicenses}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </div>

        {/* Name & Email */}
        <div className="form-card">
          <h2 className="form-section-title">What&apos;s your name and email?</h2>
          <p className="form-section-subtitle">
            Please use your work email to build your Essentials subscription trial.
          </p>

          <Form.Group controlId="full-name" isInvalid={!!errors.fullName}>
            <Form.Label>Full name</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); updateCheckout({ fullName: e.target.value }); }}
              autoComplete="name"
            />
            {errors.fullName && (
              <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="work-email" isInvalid={!!errors.workEmail}>
            <Form.Label>Work email</Form.Label>
            <Form.Control
              type="email"
              value={workEmail}
              onChange={(e) => { setWorkEmail(e.target.value); setErrors((prev) => ({ ...prev, workEmail: undefined })); updateCheckout({ workEmail: e.target.value }); }}
              onBlur={handleEmailBlur}
              autoComplete="email"
            />
            {errors.workEmail && (
              <Form.Control.Feedback type="invalid">{errors.workEmail}</Form.Control.Feedback>
            )}
          </Form.Group>

          <CountrySelect
            id="country-of-residence"
            label="Country of residence"
            value={country}
            onChange={(val) => { setCountry(val); updateCheckout({ country: val }); }}
            error={errors.country}
          />
        </div>

        <p className="terms-text">
          By submitting your info in the form above, you agree to our{' '}
          <a href="https://www.edx.org/edx-terms-service" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          {' '}and{' '}
          <a href="https://www.edx.org/edx-privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Notice</a>.
          {' '}We may use this info to contact you and/or use data from third parties to personalize your experience.
        </p>

        <div className="action-row">
          <Button type="submit" variant="brand" size="lg" disabled={!isFormReady}>
            Continue
          </Button>
        </div>
      </form>
    </>
  );

  const rightContent = (
    <>
      <PurchaseSummary />
      <div className="not-sure-box">
        <strong>Not sure which plan is right for you?</strong>{' '}
        <a href="#">Compare plans.</a>
      </div>
      <QuoteBox />
    </>
  );

  return (
    <CheckoutLayout
      title="Plan Details"
      steps={STEPS}
      left={leftContent}
      right={rightContent}
    />
  );
}

export default PlanDetailsPage;
