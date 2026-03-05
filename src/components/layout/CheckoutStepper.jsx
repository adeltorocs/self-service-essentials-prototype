import React from 'react';

/**
 * CheckoutStepper
 *
 * Renders a 3-step progress indicator.
 * Paragon does not have a built-in Stepper component, so this is a custom
 * component styled to match Paragon's design language.
 *
 * @param {Array<{label: string, status: 'done'|'active'|'inactive'}>} steps
 */
function CheckoutStepper({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <nav className="checkout-stepper" aria-label="Checkout steps">
      <div className="stepper-inner">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`stepper-step ${step.status}`}
            aria-current={step.status === 'active' ? 'step' : undefined}
          >
            <div className="step-circle">
              {step.status === 'done' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="step-num">{i + 1}</span>
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default CheckoutStepper;
