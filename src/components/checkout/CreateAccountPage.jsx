/**
 * CreateAccountPage
 *
 * New-user flow: registers an edX learner account.
 * Work email, full name, and country are pre-filled (locked) from state.
 *
 * BACKEND integration points:
 *   - On submit: POST /api/v1/auth/register
 *     { email, name, username, password, country }
 *     → on success: update isLoggedIn state, navigate to plan-details
 *   - Username availability check (optional real-time):
 *     GET /api/v1/auth/username-available?username={username}
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Icon } from '@openedx/paragon';
import { Lock, VisibilityOff, Visibility } from '@openedx/paragon/icons';

import CheckoutLayout from '../layout/CheckoutLayout';
import PurchaseSummary from '../layout/PurchaseSummary';
import QuoteBox from '../layout/QuoteBox';
import CountrySelect from './CountrySelect';

import { useCheckout } from '../../data/context/CheckoutContext';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'active'   },
  { label: 'Account Details', status: 'inactive' },
  { label: 'Billing Details', status: 'inactive' },
];

const PASSWORD_FORMAT = /^[a-z0-9-]+$/;

function CreateAccountPage() {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  const [username, setUsername]           = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [errors, setErrors]               = useState({});

  function isPasswordValid(val) {
    return val.length >= 8 && PASSWORD_FORMAT.test(val);
  }

  const isFormReady = (
    username.trim().length > 0
    && isPasswordValid(password)
    && confirmPassword === password
    && confirmPassword.length > 0
  );

  function handlePasswordChange(val) {
    setPassword(val);
    const newErrors = { ...errors };
    if (val.length > 0 && !PASSWORD_FORMAT.test(val)) {
      newErrors.password = 'Password may only contain lowercase letters, numbers, and dashes.';
    } else if (val.length > 0 && val.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else {
      delete newErrors.password;
    }
    if (confirmPassword.length > 0) {
      if (confirmPassword !== val) {
        newErrors.confirmPassword = 'Passwords do not match.';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  }

  function handleConfirmChange(val) {
    setConfirm(val);
    if (val.length > 0 && val !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors((prev) => { const e = { ...prev }; delete e.confirmPassword; return e; });
    }
  }

  function handleSubmit() {
    if (!isFormReady) return;

    // BACKEND: replace with POST /api/v1/auth/register
    //   { email: state.workEmail, name: state.fullName, username, password, country: state.country }
    //   Handle 409 (username taken), 400 (validation errors) responses.
    updateCheckout({ isLoggedIn: true });
    navigate(ROUTES.PLAN_DETAILS_LOGGEDIN);
  }

  const leftContent = (
    <div className="form-card">
      <h2 className="form-section-title" style={{ fontSize: '1.0625rem' }}>
        Register your edX account to start the trial
      </h2>
      <p className="form-section-subtitle">
        Your edX learner account will be granted administrator access to
        manage your organization&apos;s subscription when the trial starts.
      </p>

      {/* Work email – locked */}
      <Form.Group controlId="ca-work-email">
        <div className="input-locked-wrapper">
          <span className="input-lock-icon" aria-label="Read only">
            <Icon src={Lock} />
          </span>
          <Form.Control type="email" value={state.workEmail || ''} readOnly tabIndex={-1} placeholder="Work email" />
        </div>
      </Form.Group>

      {/* Full name – locked */}
      <Form.Group controlId="ca-full-name">
        <div className="input-locked-wrapper">
          <span className="input-lock-icon" aria-label="Read only">
            <Icon src={Lock} />
          </span>
          <Form.Control type="text" value={state.fullName || ''} readOnly tabIndex={-1} placeholder="Full name" />
        </div>
      </Form.Group>

      {/* Username */}
      <Form.Group controlId="ca-username" isInvalid={!!errors.username}>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (e.target.value.trim()) {
              setErrors((prev) => { const err = { ...prev }; delete err.username; return err; });
            }
          }}
          onBlur={() => {
            if (!username.trim()) {
              setErrors((prev) => ({ ...prev, username: 'Please enter a public username.' }));
            }
          }}
          autoComplete="username"
          placeholder="Public username"
        />
        {errors.username && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
      </Form.Group>

      {/* Password */}
      <Form.Group controlId="ca-password" isInvalid={!!errors.password}>
        <div className="input-icon-wrapper">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            autoComplete="new-password"
            placeholder="Password"
          />
          <button
            type="button"
            className="input-icon-right password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon src={showPassword ? VisibilityOff : Visibility} />
          </button>
        </div>
        {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
      </Form.Group>

      {/* Confirm password */}
      <Form.Group controlId="ca-confirm-password" isInvalid={!!errors.confirmPassword}>
        <div className="input-icon-wrapper">
          <Form.Control
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handleConfirmChange(e.target.value)}
            autoComplete="new-password"
            placeholder="Confirm password"
          />
          <button
            type="button"
            className="input-icon-right password-toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            <Icon src={showConfirm ? VisibilityOff : Visibility} />
          </button>
        </div>
        {errors.confirmPassword && (
          <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Country – locked */}
      <CountrySelect
        id="ca-country"
        label="Country/Region"
        value={state.country || ''}
        onChange={() => {}}
        disabled
      />

      <p className="terms-text" style={{ marginTop: 'var(--sp-lg)' }}>
        By creating an account, you agree to the Terms of Service and Honor Code and
        you acknowledge that edX and each Member process your personal data in
        accordance with the Privacy Policy.
      </p>

      <div className="action-row">
        <Button variant="brand" size="lg" disabled={!isFormReady} onClick={handleSubmit}>
          Create an account
        </Button>
      </div>
    </div>
  );

  return (
    <CheckoutLayout
      title="Create your account"
      steps={STEPS}
      left={leftContent}
      right={<><PurchaseSummary /><div className="not-sure-box"><strong>Not sure which plan is right for you?</strong> <a href="#">Compare plans.</a></div><QuoteBox /></>}
      logoHref={ROUTES.PLAN_DETAILS_NEW}
    />
  );
}

export default CreateAccountPage;
