import React from 'react';
import { useCheckout } from '../../data/context/CheckoutContext';
import { calcTotal } from '../../data/utils';
import { PLAN, ACADEMY } from '../../mocks/academyData';

/**
 * PurchaseSummary
 *
 * Sidebar purchase summary card. Renders pricing details reactively
 * based on the current checkout state.
 *
 * @param {boolean} showUpgrade - show "Upgrade to Teams" notice (default true)
 * @param {React.ReactNode} footerSlot - replaces the upgrade notice (e.g. on success page)
 */
function PurchaseSummary({ showUpgrade = true, footerSlot }) {
  const { state } = useCheckout();
  const n = parseInt(state.numLicenses, 10);
  const total = calcTotal(n);

  const licensesDisplay = n && n > 0 ? `×${n}` : '—';
  const totalDisplay    = total ? `$${total.toLocaleString('en-US')} USD` : '—';
  const autoRenewNote   = total
    ? `Auto-renews annually at $${total.toLocaleString('en-US')}/yr. Cancel at any time.`
    : null;

  return (
    <div className="purchase-summary">
      <div className="ps-title">Purchase summary</div>
      <div className="ps-academy">{ACADEMY.shortName}</div>

      <div className="ps-row">
        <span className="ps-label">
          Essentials subscription,<br />price per user, paid yearly
        </span>
        <span className="ps-value">${PLAN.pricePerLicense} USD</span>
      </div>

      <div className="ps-row">
        <span className="ps-label">Number of licenses</span>
        <span className="ps-value">{licensesDisplay}</span>
      </div>

      <hr className="ps-divider" />

      <div className="ps-row">
        <span className="ps-label">
          Total after 14-day<br />free trial
          {autoRenewNote && <small>{autoRenewNote}</small>}
        </span>
        <span className="ps-value">
          {totalDisplay}
          <small className="ps-value-unit">/yr</small>
        </span>
      </div>

      <div className="ps-row ps-total">
        <span className="ps-label">Due today</span>
        <span className="ps-value">$0</span>
      </div>

      {footerSlot ?? (
        showUpgrade && (
          <div className="upgrade-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Upgrade to Teams
          </div>
        )
      )}
    </div>
  );
}

export default PurchaseSummary;
