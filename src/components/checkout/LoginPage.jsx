/**
 * LoginPage
 *
 * Existing-user flow: user has an edX account — ask for password.
 *
 * BACKEND integration points:
 *   - On sign-in: POST /api/v1/auth/login  { email, password }
 *     → 200: set isLoggedIn, navigate to plan-details
 *     → 401: show "Incorrect password" error
 *     → 403: show account locked / MFA required message
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Icon } from '@openedx/paragon';
import { Visibility, VisibilityOff } from '@openedx/paragon/icons';

import CheckoutLayout from '../layout/CheckoutLayout';
import PurchaseSummary from '../layout/PurchaseSummary';
import QuoteBox from '../layout/QuoteBox';

import { useCheckout } from '../../data/context/CheckoutContext';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'active'   },
  { label: 'Account Details', status: 'inactive' },
  { label: 'Billing Details', status: 'inactive' },
];

function LoginPage() {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');

  function handleSignIn() {
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');

    // BACKEND: replace with POST /api/v1/auth/login { email: state.workEmail, password }
    //   Handle 401 → setError('Incorrect password. Please try again.')
    updateCheckout({ isLoggedIn: true });
    navigate(ROUTES.PLAN_DETAILS_LOGGEDIN);
  }

  const leftContent = (
    <div className="form-card">
      <h2 className="form-section-title" style={{ fontSize: '1.0625rem' }}>
        Looks like you already have an account with this email
      </h2>
      <p className="form-section-subtitle">
        Please sign in or go back and use a different email.
      </p>

      <p style={{ fontSize: '.9rem', marginBottom: 'var(--sp-md)', color: 'var(--clr-text)' }}>
        Email: <strong>{state.workEmail}</strong>
      </p>

      <Form.Group controlId="login-password" isInvalid={!!error}>
        <Form.Label>Password</Form.Label>
        <div className="input-icon-wrapper">
          <Form.Control
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="input-icon-right password-toggle"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            <Icon src={showPwd ? VisibilityOff : Visibility} />
          </button>
        </div>
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </Form.Group>

      <div className="action-row space-between" style={{ marginTop: 'var(--sp-lg)' }}>
        <Link to={ROUTES.PLAN_DETAILS_EXISTING} className="btn btn-outline">Back</Link>
        <Button variant="brand" onClick={handleSignIn}>Sign in</Button>
      </div>
    </div>
  );

  return (
    <CheckoutLayout
      title="Log in to your account"
      steps={STEPS}
      left={leftContent}
      right={<><PurchaseSummary /><QuoteBox /></>}
      logoHref={ROUTES.PLAN_DETAILS_EXISTING}
    />
  );
}

export default LoginPage;
