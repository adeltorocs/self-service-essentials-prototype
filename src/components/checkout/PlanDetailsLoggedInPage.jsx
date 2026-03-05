/**
 * PlanDetailsLoggedInPage
 *
 * Step 1 variant for already-authenticated users.
 * Allows editing the license count. Shows "Signed in as" info.
 * Navigates to Account Details on continue.
 *
 * BACKEND integration points:
 *   - On mount: GET /api/v1/current-user → populate state.fullName, state.workEmail
 *   - License count update may call PATCH /api/v1/quotes/{quoteId} { numLicenses }
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from '@openedx/paragon';

import CheckoutLayout from '../layout/CheckoutLayout';
import EssentialsPlanCard from '../layout/EssentialsPlanCard';
import PurchaseSummary from '../layout/PurchaseSummary';
import QuoteBox from '../layout/QuoteBox';

import { useCheckout } from '../../data/context/CheckoutContext';
import { PLAN } from '../../mocks/academyData';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'active'   },
  { label: 'Account Details', status: 'inactive' },
  { label: 'Billing Details', status: 'inactive' },
];

function PlanDetailsLoggedInPage() {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  const [numLicenses, setNumLicenses] = useState(state.numLicenses || '');
  const [error, setError]             = useState('');

  const n = parseInt(numLicenses, 10);
  const isValid = n >= PLAN.minLicenses && n <= PLAN.maxLicenses;

  function handleLicensesChange(e) {
    const val = e.target.value;
    setNumLicenses(val);
    updateCheckout({ numLicenses: val });
    const num = parseInt(val, 10);
    if (val !== '' && num < PLAN.minLicenses) {
      setError(`Must be at least ${PLAN.minLicenses} licenses.`);
    } else if (num > PLAN.maxLicenses) {
      setError(`You can only have up to ${PLAN.maxLicenses} licenses on the Essentials plan. Either decrease the number of licenses or choose a different plan.`);
    } else {
      setError('');
    }
  }

  function handleContinue() {
    const num = parseInt(numLicenses, 10);
    if (!num || num < PLAN.minLicenses) {
      setError(`Must be at least ${PLAN.minLicenses} licenses.`);
      return;
    }
    if (num > PLAN.maxLicenses) {
      setError(`You can only have up to ${PLAN.maxLicenses} licenses on the Essentials plan.`);
      return;
    }
    updateCheckout({ numLicenses });
    navigate(ROUTES.ACCOUNT_DETAILS);
  }

  const leftContent = (
    <>
      <EssentialsPlanCard />

      {/* Licenses */}
      <div className="form-card">
        <h2 className="form-section-title">How many licenses will you need?</h2>
        <p className="form-section-subtitle">
          Enter in the number of licenses you want to purchase. As an
          administrator, you can issue and swap licenses between employees.
        </p>
        <Form.Group controlId="num-licenses" isInvalid={!!error}>
          <Form.Label>Number of licenses</Form.Label>
          <div className="input-icon-wrapper">
            <Form.Control
              type="number"
              value={numLicenses}
              onChange={handleLicensesChange}
              min={PLAN.minLicenses}
              max={PLAN.maxLicenses}
              autoComplete="off"
            />
            {isValid && (
              <span className="input-check-icon" aria-label="Valid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>
          {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </Form.Group>
      </div>

      {/* Signed-in indicator */}
      <div className="signed-in-box">
        <div className="sib-title">Account Details</div>
        <div className="sib-user">
          Signed in as: <strong>{state.fullName} ({state.workEmail})</strong>
        </div>
      </div>

      <div className="action-row" style={{ marginTop: 'var(--sp-xl)' }}>
        <Button variant="brand" size="lg" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </>
  );

  return (
    <CheckoutLayout
      title="Plan Details"
      steps={STEPS}
      left={leftContent}
      right={<><PurchaseSummary /><div className="not-sure-box"><strong>Not sure which plan is right for you?</strong> <a href="#">Compare plans.</a></div><QuoteBox /></>}
    />
  );
}

export default PlanDetailsLoggedInPage;
