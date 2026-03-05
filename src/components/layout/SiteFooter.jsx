import React from 'react';

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <img src="/svg/edx-enterprise-logo-black.svg" alt="edX Enterprise" />
        </div>
        <ul className="footer-links">
          <li><a href="https://www.edx.org/edx-terms-service">Terms of Service</a></li>
          <li><a href="https://www.edx.org/edx-privacy-policy">Privacy Policy</a></li>
          <li><a href="https://enterprise-support.edx.org/s/contactsupport">Support</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default SiteFooter;
