import React from 'react';

export function FilterChip({ label, isActive, onClick }) {
  const subjectKey = label.toLowerCase();
  return (
    <button
      className={`filter-chip filter-chip--${subjectKey} ${isActive ? 'filter-chip--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
