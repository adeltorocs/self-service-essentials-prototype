/**
 * CountrySelect
 * Reusable country dropdown using Paragon Form.Group + Form.Control (select).
 * Country list comes from the mock; in production use useCountries() hook.
 */

import React from 'react';
import { Form } from '@openedx/paragon';
import { COUNTRIES } from '../../mocks/countriesData';

// BACKEND: replace COUNTRIES import with data from useCountries() hook.
// Pattern: Caching (enterprise-access §13) — country data is static; useCountries() hook
//   should have staleTime: Infinity and backend uses long-TTL TieredCache.

function CountrySelect({
  id,
  label = 'Country',
  value,
  onChange,
  error,
  disabled = false,
}) {
  return (
    <Form.Group controlId={id} isInvalid={!!error}>
      <Form.Control
        as="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{label}</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.name}>{c.name}</option>
        ))}
      </Form.Control>
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}

export default CountrySelect;
