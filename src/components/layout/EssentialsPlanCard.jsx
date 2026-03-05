import React from 'react';
import { ACADEMY, PLAN } from '../../mocks/academyData';

// BACKEND: replace with data from usePlanDetails() hook once API is live

/**
 * EssentialsPlanCard
 * Two-tone red card showing the selected academy info.
 */
function EssentialsPlanCard() {
  return (
    <div className="essentials-plan-card">
      {/* Dark section */}
      <div className="epc-dark">
        <div className="plan-title-row">
          <span className="plan-name">{PLAN.name}</span>
          <span className="plan-price">
            From <strong>${PLAN.pricePerLicense}/yr</strong>
          </span>
        </div>
        <p className="plan-subtitle">
          You have picked <strong>{ACADEMY.name}</strong> as your focus area.{' '}
          Changed your mind?{' '}
          <a href={PLAN.changeAcademyUrl} target="_blank" rel="noopener noreferrer">
            Pick a different academy.
          </a>
        </p>

        {/* White academy inner card */}
        <div className="academy-white-card">
          <div className="awc-header">
            <div className="awc-title-group">
              <span className="awc-name">{ACADEMY.name}</span>
              <span className="awc-count">{ACADEMY.courseCount} courses</span>
            </div>
            <a href={PLAN.changeAcademyUrl} className="awc-learn-more" target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </div>
          <p className="awc-tags">{ACADEMY.tags.join(' • ')}</p>
          <p className="awc-description">{ACADEMY.description}</p>
        </div>
      </div>

      {/* Light section */}
      <div className="epc-light">
        Need to upskill your team in more than one focus area?{' '}
        <a href={PLAN.upgradeToTeamsUrl} target="_blank" rel="noopener noreferrer">
          Switch to Teams.
        </a>
      </div>
    </div>
  );
}

export default EssentialsPlanCard;
