/**
 * AccountDetailsPage
 *
 * Step 2 — Company name and custom enterprise URL.
 *
 * BACKEND integration points:
 *   - URL availability check: GET /api/v1/enterprise/url-available?slug={slug}
 *     Currently mocked to always-available.
 *   - On continue: this data will be submitted as part of enterprise customer creation:
 *     POST /api/v1/enterprise-customer/  { name: companyName, slug: urlName, ... }
 *
 * Pattern: DRF ViewSet (enterprise-access §3) — EnterpriseCustomerViewSet extends
 *   ModelViewSet with PermissionRequiredMixin + UserDetailsFromJwtMixin.
 *   URL availability is a custom @action(detail=False, methods=['get']).
 *   Enterprise customer creation uses EnterpriseCustomerCreateSerializer (request) and
 *   EnterpriseCustomerResponseSerializer (response) via dynamic get_serializer_class().
 * Pattern: RBAC (enterprise-access §1) — creating an enterprise customer requires
 *   SYSTEM_ENTERPRISE_OPERATOR_ROLE or the JWT-implied admin role; enforce via
 *   @permission_required decorator on the viewset.
 * Pattern: Validation (enterprise-access §14) — field-level: slug format (regex, length);
 *   cross-field: slug uniqueness against existing customers; pre-write validation in serializer.
 * Pattern: Model (enterprise-access §9) — EnterpriseCustomer extends TimeStampedModel +
 *   SoftDeletableModel with simple_history; slug field has unique constraint. PII annotation
 *   required on companyName (# has_pii).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Badge } from '@openedx/paragon';

import CheckoutLayout from '../layout/CheckoutLayout';
import PurchaseSummary from '../layout/PurchaseSummary';

import { useCheckout } from '../../data/context/CheckoutContext';
import { slugify } from '../../data/utils';
import { useUrlAvailability } from '../../data/hooks';
import { ROUTES } from '../../data/constants';

const STEPS = [
  { label: 'Plan Details',    status: 'done'     },
  { label: 'Account Details', status: 'active'   },
  { label: 'Billing Details', status: 'inactive' },
];

function AccountDetailsPage() {
  const navigate = useNavigate();
  const { state, updateCheckout } = useCheckout();

  const [companyName, setCompanyName] = useState(state.companyName || '');
  const [urlName,     setUrlName]     = useState(state.urlName     || '');
  const [errors,      setErrors]      = useState({});

  // BACKEND: replace with real availability API call via useUrlAvailability hook
  // Pattern: DRF ViewSet @action (enterprise-access §3) — see useUrlAvailability in hooks.js
  const { data: urlCheck } = useUrlAvailability(urlName);
  const isUrlAvailable = urlCheck?.available ?? false;

  // Auto-slug company name
  useEffect(() => {
    if (companyName) {
      const slug = slugify(companyName);
      setUrlName(slug);
      updateCheckout({ urlName: slug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName]);

  function handleUrlChange(e) {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    setUrlName(raw);
    updateCheckout({ urlName: raw });
  }

  function handleContinue() {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = 'Please enter your company name.';
    if (!urlName.trim())     newErrors.urlName     = 'Please enter a valid access link name.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateCheckout({ companyName: companyName.trim(), urlName: urlName.trim() });
    navigate(ROUTES.BILLING_DETAILS);
  }

  const leftContent = (
    <>
      {/* Company name */}
      <div className="form-card" style={{ marginBottom: 'var(--sp-md)' }}>
        <h2 className="form-section-title">
          What&apos;s the name of your company or organization?
        </h2>
        <Form.Group controlId="company-name" isInvalid={!!errors.companyName} style={{ marginTop: 'var(--sp-md)' }}>
          <Form.Control
            type="text"
            value={companyName}
            onChange={(e) => { setCompanyName(e.target.value); updateCheckout({ companyName: e.target.value }); }}
            autoComplete="organization"
            placeholder="Company name"
          />
          {errors.companyName && (
            <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
          )}
        </Form.Group>
      </div>

      {/* Custom URL */}
      <div className="form-card">
        <h2 className="form-section-title">Create a custom URL for your team</h2>
        <p className="form-section-subtitle">
          This is how your colleagues will access your Team subscription on
          edX. This access link name cannot be changed after your trial
          subscription starts.
        </p>

        <div className="url-builder">
          <div className="url-prefix">https://enterprise.edx.org/</div>
          <Form.Group controlId="url-name" isInvalid={!!errors.urlName} style={{ marginBottom: 0 }}>
            <div className="input-icon-wrapper">
              <Form.Control
                type="text"
                value={urlName}
                onChange={handleUrlChange}
                autoComplete="off"
                pattern="[a-z0-9\-]+"
                placeholder="Access link"
              />
              {isUrlAvailable && urlName.length > 0 && (
                <span className="input-check-icon" aria-label="Available">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
            {errors.urlName && (
              <Form.Control.Feedback type="invalid">{errors.urlName}</Form.Control.Feedback>
            )}
          </Form.Group>
        </div>

        <p className="url-hint">
          Your link must be alphanumeric, lowercase, and may include hyphens.
        </p>
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
      title="Account Details"
      steps={STEPS}
      left={leftContent}
      right={<PurchaseSummary />}
    />
  );
}

export default AccountDetailsPage;
