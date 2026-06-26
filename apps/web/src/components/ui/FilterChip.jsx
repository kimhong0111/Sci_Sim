import React from 'react';

export function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
