/**
 * BillingDetailsPage
 *
 * Step 3 — Card holder info, payment card, and terms acceptance.
 *
 * BACKEND integration points:
 *   - On subscribe: POST /api/v1/subscriptions/purchase
 *     {
 *       numLicenses, companyName, urlName,
 *       billing: { firstName, lastName, address1, address2, city, country, state, zip },
 *       payment: { cardToken }  ← card details tokenized client-side via Stripe/Braintree
 *     }
 *     → 200: navigate to success
 *     → 402: show payment declined error
 *   - Card tokenization: integrate Stripe Elements or Braintree Drop-in
 *     replacing the plain card inputs below.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from '@openedx/paragon';

import CheckoutLayout from '../layout/CheckoutLayout';
import PurchaseSummary from '../layout/PurchaseSummary';
import CountrySelect from './CountrySelect';

import { useCheckout } from '../../data/context/CheckoutContext';
import {
  calcTotal, getSubscriptionDates, formatDate,
  formatCardNumber, formatExpiry, formatCvc,
} from '../../data/utils';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'done'   },
  { label: 'Account Details', status: 'done'   },
  { label: 'Billing Details', status: 'active' },
];

function BillingDetailsPage() {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  // Billing address fields
  const [firstName,  setFirstName]  = useState(state.billingFirstName  || '');
  const [lastName,   setLastName]   = useState(state.billingLastName   || '');
  const [address1,   setAddress1]   = useState(state.billingAddress1   || '');
  const [address2,   setAddress2]   = useState(state.billingAddress2   || '');
  const [city,       setCity]       = useState(state.billingCity       || '');
  const [country,    setCountry]    = useState(state.billingCountry || state.country || '');
  const [stateField, setStateField] = useState(state.billingState      || '');
  const [zip,        setZip]        = useState(state.billingZip        || '');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvc,        setCvc]        = useState('');

  // Terms checkboxes
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

  const [errors,       setErrors]       = useState({});
  const [termsError,   setTermsError]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived
  const n = parseInt(state.numLicenses, 10);
  const total = calcTotal(n);
  const { trialEnd, subEnd } = getSubscriptionDates();

  const isFormReady = (
    cardNumber.replace(/\s/g, '').length > 0
    && expiry.trim().length > 0
    && cvc.trim().length > 0
    && check1 && check2 && check3
  );

  function validate() {
    const newErrors = {};
    if (!firstName.trim())  newErrors.firstName  = 'First name is required.';
    if (!lastName.trim())   newErrors.lastName   = 'Last name is required.';
    if (!address1.trim())   newErrors.address1   = 'Address is required.';
    if (!city.trim())       newErrors.city       = 'City is required.';
    if (!country)           newErrors.country    = 'Country is required.';
    if (!expiry.trim())     newErrors.expiry     = 'Please enter a valid expiry date.';
    if (!cvc.trim())        newErrors.cvc        = 'Please enter the CVC.';
    if (!cardNumber.replace(/\s/g, '').trim()) newErrors.cardNumber = 'Please enter a valid card number.';
    return newErrors;
  }

  function handleSubscribe() {
    const newErrors = validate();
    setErrors(newErrors);
    setTermsError(!check1 || !check2 || !check3);
    if (Object.keys(newErrors).length > 0 || !check1 || !check2 || !check3) return;

    const rawCard = cardNumber.replace(/\s/g, '');
    const last4   = rawCard.slice(-4);

    setIsSubmitting(true);

    // BACKEND: replace with POST /api/v1/subscriptions/purchase
    //   Payment card should be tokenized here via Stripe/Braintree SDK
    //   before sending to the backend. Do NOT send raw card data.
    setTimeout(() => {
      updateCheckout({
        billingFirstName: firstName.trim(),
        billingLastName:  lastName.trim(),
        billingAddress1:  address1.trim(),
        billingAddress2:  address2.trim(),
        billingCity:      city.trim(),
        billingCountry:   country,
        billingState:     stateField.trim(),
        billingZip:       zip.trim(),
        cardLast4:        last4,
      });
      navigate(ROUTES.SUCCESS);
    }, 800);
  }

  const finePrintText = total
    ? `By signing up for a subscription or starting a 14-day free trial, you authorize edX to charge your card at $${total.toLocaleString('en-US')} USD per year. Your subscription will automatically renew each year at $${total.toLocaleString('en-US')}/yr until you cancel. After your 14-day free trial ends, your subscription will automatically renew each year at $${total.toLocaleString('en-US')}/yr until you cancel your subscription.`
    : '';

  const leftContent = (
    <>
      {/* Card holder */}
      <div className="form-card" style={{ marginBottom: 'var(--sp-md)' }}>
        <h2 className="form-section-title" style={{ marginBottom: 'var(--sp-md)' }}>
          Card holder information
        </h2>
        <div className="form-row">
          <Form.Group controlId="b-first-name" isInvalid={!!errors.firstName}>
            <Form.Label>First Name (required)</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
            {errors.firstName && <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="b-last-name" isInvalid={!!errors.lastName}>
            <Form.Label>Last Name (required)</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
            {errors.lastName && <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>}
          </Form.Group>
        </div>
        <Form.Group controlId="b-address1" isInvalid={!!errors.address1} style={{ gridColumn: '1 / -1' }}>
          <Form.Label>Address (required)</Form.Label>
          <Form.Control type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} autoComplete="address-line1" />
          {errors.address1 && <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group controlId="b-address2">
          <Form.Label>Address 2</Form.Label>
          <Form.Control type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} autoComplete="address-line2" />
        </Form.Group>
        <Form.Group controlId="b-city" isInvalid={!!errors.city}>
          <Form.Label>City (required)</Form.Label>
          <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
          {errors.city && <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>}
        </Form.Group>
        <CountrySelect
          id="b-country"
          label="Country (required)"
          value={country}
          onChange={setCountry}
          error={errors.country}
        />
        <div className="form-row">
          <Form.Group controlId="b-state">
            <Form.Label>State/Province</Form.Label>
            <Form.Control type="text" value={stateField} onChange={(e) => setStateField(e.target.value)} autoComplete="address-level1" />
          </Form.Group>
          <Form.Group controlId="b-zip">
            <Form.Label>ZIP/Postal Code</Form.Label>
            <Form.Control type="text" value={zip} onChange={(e) => setZip(e.target.value)} autoComplete="postal-code" />
          </Form.Group>
        </div>
      </div>

      {/* Billing / card info */}
      <div className="form-card" style={{ marginBottom: 'var(--sp-md)' }}>
        <h2 className="form-section-title" style={{ marginBottom: 4 }}>Billing information</h2>
        <p className="form-section-subtitle" style={{ marginBottom: 'var(--sp-md)' }}>
          By providing your card information, you allow edX to charge your
          card for future payments in accordance with their terms.
        </p>

        {/* Card number */}
        {/* BACKEND: replace this input block with Stripe Elements <CardNumberElement>
                     or Braintree Drop-in UI for PCI-compliant card tokenization */}
        <div style={{ marginBottom: 'var(--sp-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--clr-text-muted)' }}>Card Number</span>
            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              <span className="card-icon visa">VISA</span>
              <span className="card-icon mc">MC</span>
              <span className="card-icon amex">AMEX</span>
            </div>
          </div>
          <input
            id="card-number"
            type="text"
            className={`card-number-input${errors.cardNumber ? ' is-invalid' : ''}`}
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            inputMode="numeric"
            maxLength={19}
          />
          {errors.cardNumber && (
            <p style={{ color: 'var(--clr-error)', fontSize: '.8125rem', marginTop: 4 }}>{errors.cardNumber}</p>
          )}
        </div>

        <div className="form-row">
          <Form.Group controlId="card-expiry" isInvalid={!!errors.expiry}>
            <Form.Label>Expiration</Form.Label>
            <Form.Control
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              autoComplete="cc-exp"
              maxLength={5}
              inputMode="numeric"
            />
            {errors.expiry && <Form.Control.Feedback type="invalid">{errors.expiry}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="card-cvc" isInvalid={!!errors.cvc}>
            <Form.Label>CVC</Form.Label>
            <Form.Control
              type="text"
              value={cvc}
              onChange={(e) => setCvc(formatCvc(e.target.value))}
              placeholder="CVC"
              autoComplete="cc-csc"
              maxLength={4}
              inputMode="numeric"
            />
            {errors.cvc && <Form.Control.Feedback type="invalid">{errors.cvc}</Form.Control.Feedback>}
          </Form.Group>
        </div>
      </div>

      {/* Terms */}
      <div className="form-card">
        <h2 className="form-section-title" style={{ marginBottom: 'var(--sp-md)' }}>edX Enterprise Terms</h2>
        <p className="form-section-subtitle">
          By subscribing, you and your organization agree to the edX Enterprise
          Product Descriptions and Terms and edX Enterprise Sales Terms and
          Conditions listed below.
        </p>

        <div className="pgn-checkbox-group">
          <label className="pgn-checkbox">
            <input type="checkbox" checked={check1} onChange={(e) => setCheck1(e.target.checked)} />
            <span>
              I have read and accept the{' '}
              <a href="https://business.edx.org/product-descriptions-and-terms/" target="_blank" rel="noopener noreferrer">
                edX Enterprise Product Descriptions and Terms
              </a>{' '}and{' '}
              <a href="https://business.edx.org/enterprise-sales-terms/" target="_blank" rel="noopener noreferrer">
                edX Enterprise Sales Terms and Conditions
              </a>.
            </span>
          </label>

          <label className="pgn-checkbox">
            <input type="checkbox" checked={check2} onChange={(e) => setCheck2(e.target.checked)} />
            <span>
              I confirm I am subscribing on behalf of my employer, school or other
              professional organization for use by my organization&apos;s employees,
              students and/or other sponsored learners.
            </span>
          </label>

          <label className="pgn-checkbox">
            <input type="checkbox" checked={check3} onChange={(e) => setCheck3(e.target.checked)} />
            <span>
              I agree to enroll in a recurring annual subscription for{' '}
              <strong>{total ? `$${total.toLocaleString('en-US')}` : '$0'} USD</strong>.
            </span>
          </label>
        </div>

        {termsError && (
          <Alert variant="danger" className="mt-3">
            Please accept all terms to continue.
          </Alert>
        )}
      </div>

      {/* Fine print */}
      <p style={{ marginTop: 'var(--sp-lg)', fontSize: '.8125rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
        {finePrintText}
        {total && (
          <>
            <br /><br />
            <strong>
              After your 14-day free trial ends, your subscription will automatically renew each year at
              ${total.toLocaleString('en-US')}/yr until you cancel your subscription.
            </strong>
          </>
        )}
      </p>

      <div className="action-row" style={{ marginTop: 'var(--sp-lg)' }}>
        <Button
          variant="brand"
          size="lg"
          disabled={!isFormReady || isSubmitting}
          onClick={handleSubscribe}
        >
          {isSubmitting ? 'Processing…' : 'Subscribe'}
        </Button>
      </div>
    </>
  );

  return (
    <CheckoutLayout
      title="Billing Details"
      steps={STEPS}
      left={leftContent}
      right={<PurchaseSummary />}
    />
  );
}

export default BillingDetailsPage;
