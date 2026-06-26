import React from 'react';

export function Badge({ label, variant = 'category' }) {
  return (
    <span className={`badge badge--${variant}`}>
      {label}
    </span>
  );
}
