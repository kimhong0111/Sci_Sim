import React from 'react';
import { FilterChip } from '../ui/FilterChip';

export function FilterBar({ activeFilter, onFilterChange, subjects = [] }) {
  const filters = [
    { label: 'ALL', value: 'all' },
    ...subjects.map((s) => ({
      label: s.name.toUpperCase(),
      value: s.name.toLowerCase(),
    })),
  ];

  const activeLabel = activeFilter === 'all'
    ? 'All Modules'
    : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);

  return (
    <div className="filter-bar">
      <div className="filter-bar__header">
        <h2 className="filter-bar__title">Available Modules</h2>
        <p className="filter-bar__active-label">
          Filter: <span>{activeLabel}</span>
        </p>
      </div>
      <div className="filter-bar__chips">
        {filters.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            isActive={activeFilter === f.value}
            onClick={() => onFilterChange(f.value)}
          />
        ))}
      </div>
    </div>
  );
}
