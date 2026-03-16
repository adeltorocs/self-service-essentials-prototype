import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '../../data/context/CheckoutContext';

/**
 * SiteHeader
 * Dark teal header (#0a2b25) with edX Enterprise logo.
 * When the user is logged in, shows avatar + username + chevron with dropdown menu.
 */
function SiteHeader({ logoHref = '/' }) {
  const { state } = useCheckout();
  const firstName = state.fullName ? state.fullName.split(' ')[0] : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleEscape(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to={logoHref} className="logo" aria-label="edX Enterprise home">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img src="/svg/edx-enterprise-logo-white.svg" alt="edX Enterprise" />
        </Link>

        {state.isLoggedIn && firstName && (
          <div className="header-user-menu" ref={menuRef}>
            <button
              type="button"
              className="header-user-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label={`User menu for ${state.fullName}`}
            >
              {/* Avatar circle */}
              <span className="header-avatar" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="header-user-name">{firstName}</span>
              {/* Chevron */}
              <svg className={`header-chevron${menuOpen ? ' open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {menuOpen && (
              <div className="header-dropdown" role="menu">
                <div className="header-dropdown-info">
                  <div className="header-dropdown-name">{state.fullName}</div>
                  <div className="header-dropdown-email">{state.workEmail}</div>
                </div>
                <div className="header-dropdown-divider" />
                <a href="#" className="header-dropdown-item" role="menuitem" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>Profile</a>
                <a href="#" className="header-dropdown-item" role="menuitem" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>Account</a>
                <div className="header-dropdown-divider" />
                <a href="#" className="header-dropdown-item" role="menuitem" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>Sign Out</a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
