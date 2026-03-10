import React from 'react';
import { TESTIMONIAL } from '../../mocks/academyData';

// BACKEND: replace with GET /api/v1/testimonials?context=essentials-checkout
// Pattern: DRF ViewSet (enterprise-access §3) — TestimonialViewSet with Pagination
//   (PaginationWithPageCount) and Filtering (django-filters) by context parameter.
// Pattern: Caching (enterprise-access §13) — testimonials are semi-static content;
//   use 30 min TieredCache timeout (content metadata tier).
function QuoteBox() {
  return (
    <div className="quote-box">
      <div className="quote-marks" aria-hidden="true">&ldquo;</div>
      <p className="quote-text">{TESTIMONIAL.quote}</p>
      <div className="quote-author">
        <div className="quote-author-line" aria-hidden="true" />
        <div>
          <div className="quote-author-name">{TESTIMONIAL.author}</div>
          <div className="quote-author-title">
            {TESTIMONIAL.title.split('\n').map((line, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={i}>{line}{i < TESTIMONIAL.title.split('\n').length - 1 && <br />}</React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteBox;
