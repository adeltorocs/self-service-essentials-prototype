/**
 * SuccessPage
 *
 * Order confirmation — shown after successful subscription.
 *
 * BACKEND integration points:
 *   - On mount: GET /api/v1/subscriptions/latest  → fetch order confirmation data
 *     (replaces reading from in-memory state)
 *   - Confirmation email is triggered server-side on purchase completion.
 *   - "Go to Dashboard" link should navigate to the real admin portal URL:
 *     https://enterprise.edx.org/{state.urlName}/admin/
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@openedx/paragon';

import CheckoutLayout from '../layout/CheckoutLayout';
import PurchaseSummary from '../layout/PurchaseSummary';

import { useCheckout } from '../../data/context/CheckoutContext';
import { calcTotal, getSubscriptionDates, formatDate } from '../../data/utils';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'done' },
  { label: 'Account Details', status: 'done' },
  { label: 'Billing Details', status: 'done' },
];

function SuccessPage() {
  const { state } = useCheckout();
  const firstName = (state.fullName || '').split(' ')[0] || 'there';
  const n         = parseInt(state.numLicenses, 10);
  const total     = calcTotal(n);

  const { today, trialEnd, subEnd } = getSubscriptionDates();
  const trialEndFmt  = formatDate(trialEnd);
  const subEndFmt    = formatDate(subEnd);
  const subStartFmt  = trialEndFmt;

  const billingParts = [
    state.billingAddress1,
    state.billingAddress2,
    [state.billingCity, state.billingState, state.billingZip].filter(Boolean).join(', '),
    state.billingCountry,
  ].filter(Boolean);

  // View Receipt replaces Upgrade to Teams in sidebar on this page
  const sidebarFooter = (
    <Link to={ROUTES.ADMIN} className="btn btn-full" style={{ marginTop: 'var(--sp-md)', background: 'var(--clr-white)', border: '1px solid var(--clr-border)', color: 'var(--clr-primary)', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
      View Receipt
    </Link>
  );

  const leftContent = (
    <>
      {/* Hero */}
      <div className="success-hero">
        <div className="success-emoji" aria-hidden="true">🎉</div>
        <h1 className="success-title">Thank you, {firstName}.</h1>
      </div>

      <p className="success-subtitle">
        Welcome to edX Essentials! Your account is currently being configured.
        We&apos;ll send you an email once everything is ready and you can begin
        onboarding and inviting your team members to start learning.
      </p>

      <div className="action-row" style={{ marginTop: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', justifyContent: 'center' }}>
        <Button as={Link} to={ROUTES.ADMIN} variant="brand" size="lg" style={{ textDecoration: 'none' }}>
          Go to Dashboard →
        </Button>
      </div>

      {/* Trial + subscription notice */}
      <div className="form-card">
        <p>
          <strong style={{ color: 'var(--clr-primary)' }}>
            Your free 14-day trial for edX Essentials subscription has started.
          </strong>
        </p>
        <p style={{ marginTop: 'var(--sp-sm)', fontSize: '.875rem', lineHeight: 1.6 }}>
          Your trial expires on <strong>{trialEndFmt}</strong>. When your free trial ends, your
          subscription will begin, and we will charge your payment method on file{' '}
          ${total ? total.toLocaleString('en-US') : '0'} USD per year. To avoid being charged,
          you must cancel before your trial expires. This subscription will automatically renew
          every year unless you cancel from the <Link to={ROUTES.ADMIN}>Subscription Management</Link> page.
        </p>
        <div className="plan-dates" style={{ marginTop: 'var(--sp-md)', paddingTop: 'var(--sp-md)' }}>
          <strong>Your subscription plan</strong>
          <div style={{ marginTop: 4, fontSize: '.875rem', color: 'var(--clr-text)' }}>
            {subStartFmt} – {subEndFmt}
          </div>
        </div>
      </div>

      {/* Order details */}
      <div className="form-card" style={{ marginTop: 'var(--sp-md)' }}>
        <div style={{ fontWeight: 700, fontSize: '.9375rem', marginBottom: 'var(--sp-md)' }}>Order details</div>
        <p style={{ fontSize: '.875rem', color: 'var(--clr-text-muted)', marginBottom: 'var(--sp-lg)' }}>
          You have purchased an edX Essentials subscription.
        </p>
        <div className="order-info-grid">
          <div className="order-info-section">
            <strong>Admin contact information</strong>
            <p>{state.workEmail || '—'}</p>
          </div>
          <div className="order-info-section">
            <strong>Payment method</strong>
            <p>
              {state.cardLast4
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="card-icon visa">VISA</span> Ending with {state.cardLast4} – $0</span>
                : '—'}
            </p>
          </div>
          <div className="order-info-section" style={{ gridColumn: '1 / -1' }}>
            <strong>Billing address</strong>
            <address style={{ fontStyle: 'normal' }}>
              {billingParts.length > 0
                ? billingParts.map((part, i) => <React.Fragment key={i}>{part}<br /></React.Fragment>)
                : '—'}
            </address>
          </div>
        </div>
      </div>

      <p className="success-contact-note" style={{ marginTop: 'var(--sp-xl)' }}>
        For questions about your subscription or our cancellation procedures, please{' '}
        <a href="https://enterprise-support.edx.org/s/contactsupport" target="_blank" rel="noopener noreferrer">
          contact support
        </a>.
      </p>
    </>
  );

  return (
    <CheckoutLayout
      steps={STEPS}
      left={leftContent}
      right={<PurchaseSummary showUpgrade={false} footerSlot={sidebarFooter} />}
    />
  );
}

export default SuccessPage;
