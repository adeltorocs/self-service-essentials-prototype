import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import CheckoutStepper from './CheckoutStepper';

/**
 * CheckoutLayout
 *
 * Wraps all checkout pages with consistent header, stepper, main, and footer.
 *
 * @param {string} title         - Page heading
 * @param {Array}  steps         - Stepper step config
 * @param {React.ReactNode} left - Left column content (form)
 * @param {React.ReactNode} right - Right column content (sidebar)
 * @param {string} [logoHref]    - Logo link destination
 */
function CheckoutLayout({
  title,
  steps,
  left,
  right,
  logoHref,
}) {
  return (
    <div className="page-wrapper">
      <SiteHeader logoHref={logoHref} />
      {steps && <CheckoutStepper steps={steps} />}
      <main className="page-main">
        <div className="page-inner">
          {title && <h1 className="page-title">{title}</h1>}
          <div className="content-grid">
            <div className="left-col">{left}</div>
            <aside className="sidebar">{right}</aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default CheckoutLayout;
