/**
 * AdminPortalPage
 *
 * Subscription Management portal — post-purchase admin view.
 *
 * BACKEND integration points:
 *   - On mount: GET /api/v1/enterprise/{enterpriseSlug}/subscription
 *     → fetch real subscription data (status, dates, license counts)
 *   - "Manage Subscription" button: links to subscription management API/UI
 *   - Invite learner: POST /api/v1/enterprise/{enterpriseSlug}/learners/invite
 *     { email: inviteEmail }
 *   - Nav items (Overview, Learners, Reporting, Settings) link to real portal sections
 *
 * Pattern: RBAC (enterprise-access §1) — all portal endpoints require
 *   SYSTEM_ENTERPRISE_ADMIN_ROLE or CONTENT_ASSIGNMENTS_ADMIN_ROLE via JWT claims.
 *   ViewSets inherit PermissionRequiredMixin with @rules.predicate decorators.
 * Pattern: BFF (enterprise-access §7) — subscription endpoint aggregates data from
 *   LicenseManagerApiClient + enterprise-customer into a single response.
 *   Architecture: Context → Handler → ResponseBuilder.
 * Pattern: DRF ViewSet (enterprise-access §3) — subscription retrieval uses a
 *   SubscriptionViewSet with dynamic get_serializer_class(). Invite uses a custom
 *   @action(detail=True, methods=['post']) on LearnerViewSet.
 * Pattern: Service Client (enterprise-access §8) — subscription data fetched via
 *   LicenseManagerApiClient (extends BaseOAuthClient); invite triggers calls to
 *   LmsApiClient for user lookup and BrazeApiClient for invitation email.
 * Pattern: Celery (enterprise-access §4) — learner invite dispatches a background task
 *   (LoggedTaskWithRetry) to send the invite email via BrazeApiClient. Idempotent task
 *   design prevents duplicate invitations.
 * Pattern: Validation (enterprise-access §14) — invite endpoint validates email format
 *   (field-level), checks license availability (cross-field), and verifies the learner
 *   is not already invited (pre-write validation). Error responses use structured codes.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@openedx/paragon';

import SiteHeader from '../layout/SiteHeader';
import SiteFooter from '../layout/SiteFooter';
import { useCheckout } from '../../data/context/CheckoutContext';
import { calcTotal, getSubscriptionDates, formatDate } from '../../data/utils';

function AdminPortalPage() {
  const { state } = useCheckout();
  const [inviteEmail, setInviteEmail]   = useState('');
  const [inviteMsg,   setInviteMsg]     = useState(null);

  const n     = parseInt(state.numLicenses, 10) || 0;
  const total = calcTotal(n);

  const { today, trialEnd, subEnd } = getSubscriptionDates();
  const todayFmt    = formatDate(today);
  const trialEndFmt = formatDate(trialEnd);
  const subEndFmt   = formatDate(subEnd);

  function handleInvite() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inviteEmail || !emailRegex.test(inviteEmail)) {
      setInviteMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    // BACKEND: replace with POST /api/v1/enterprise/{enterpriseSlug}/learners/invite
    //   { email: inviteEmail }
    //   Handle 409 (already invited), 422 (no licenses remaining)
    //
    // Pattern: Celery (enterprise-access §4) — on success, dispatch a background task
    //   (LoggedTaskWithRetry) to send the invite email via BrazeApiClient.
    // Pattern: DRF Spectacular (enterprise-access §2) — @extend_schema with
    //   inline_serializer for 409/422 error responses with structured error codes.
    setInviteMsg({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
    setInviteEmail('');
    setTimeout(() => setInviteMsg(null), 4000);
  }

  const navItems = [
    { label: 'Overview',              icon: 'grid',        active: false },
    { label: 'Subscription Management', icon: 'gift',      active: true  },
    { label: 'Learners',              icon: 'user',        active: false },
    { label: 'Reporting & Analytics', icon: 'activity',    active: false },
    { label: 'Settings',              icon: 'settings',    active: false },
  ];

  // Simple inline SVG icons
  const icons = {
    grid:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    gift:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    user:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    activity: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    settings: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader />

      <div className="portal-layout" style={{ flex: 1 }}>
        {/* Sidebar nav */}
        <nav className="portal-sidebar">
          <div className="portal-org-name">{state.companyName || 'My Organization'}</div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`portal-nav-item${item.active ? ' active' : ''}`}
            >
              <span className="portal-nav-icon">{icons[item.icon]}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Main content */}
        <div className="portal-content">
          <div className="portal-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-md)' }}>
              <h1 className="portal-page-title" style={{ marginBottom: 0 }}>Subscription Management</h1>
              <Button
                variant="tertiary"
                size="sm"
                style={{ background: 'var(--clr-white)', border: '1px solid var(--clr-border)', color: 'var(--clr-primary)' }}
              >
                Manage Subscription
              </Button>
            </div>

            {/* Subscription status card */}
            <div className="subscription-status-card">
              <div className="sub-status-header">
                <div>
                  <div className="sub-plan-name">edX Essentials — AI Academy</div>
                  <div style={{ fontSize: '.875rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
                    Your 14-day free trial will conclude on{' '}
                    <strong>{trialEndFmt}</strong>. Your paid subscription will automatically
                    start, and the{' '}
                    <strong>{total ? `$${total.toLocaleString('en-US')} USD` : '—'}</strong>{' '}
                    subscription fee will be charged to the card on file.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="sub-plan-tag">Active</span>
                  <span className="sub-plan-tag trial">Free Trial</span>
                </div>
              </div>

              <div className="sub-details-grid">
                <div className="sub-detail">
                  <strong>Trial period</strong>
                  <span>{todayFmt} – {trialEndFmt}</span>
                </div>
                <div className="sub-detail">
                  <strong>Subscription start</strong>
                  <span>{trialEndFmt}</span>
                </div>
                <div className="sub-detail">
                  <strong>Subscription end</strong>
                  <span>{subEndFmt}</span>
                </div>
                <div className="sub-detail">
                  <strong>Price per license</strong>
                  <span>$149 USD/yr</span>
                </div>
                <div className="sub-detail">
                  <strong>Total licenses</strong>
                  <span>{n || '—'}</span>
                </div>
                <div className="sub-detail">
                  <strong>Annual total</strong>
                  <span>{total ? `$${total.toLocaleString('en-US')} USD/yr` : '—'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default AdminPortalPage;
