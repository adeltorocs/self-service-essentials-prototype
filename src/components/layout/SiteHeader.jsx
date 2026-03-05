import React from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '../../data/context/CheckoutContext';

/**
 * SiteHeader
 * Dark teal header (#0a2b25) with edX Enterprise logo.
 * When the user is logged in, shows first name + chevron in the top right.
 */
function SiteHeader({ logoHref = '/' }) {
  const { state } = useCheckout();
  const firstName = state.fullName ? state.fullName.split(' ')[0] : null;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to={logoHref} className="logo" aria-label="edX Enterprise home">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img src="/svg/edx-enterprise-logo-white.svg" alt="edX Enterprise" />
        </Link>

        {state.isLoggedIn && firstName && (
          <div className="header-user-indicator" aria-label={`Signed in as ${state.fullName}`}>
            {/* User icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{firstName}</span>
            {/* Chevron */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
