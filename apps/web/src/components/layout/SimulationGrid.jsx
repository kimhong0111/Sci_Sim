import React from 'react';
import { FilterBar } from '../features/FilterBar';
import { SimulationCard } from '../features/SimulationCard';

export function SimulationGrid({
  simulations,
  onSimulationSelect,
  activeFilter,
  onFilterChange,
  subjects,
}) {
  return (
    <main className="simulation-grid">
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        subjects={subjects}
      />

      {simulations.length === 0 ? (
        <div className="simulation-grid__empty">
          <p>No simulations found for this filter.</p>
        </div>
      ) : (
        <div className="simulation-grid__cards">
          {simulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              simulation={sim}
              onOpen={onSimulationSelect}
            />
          ))}
        </div>
      )}

      <div className="simulation-grid__load-more">
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#000',
            color: '#fff',
            border: '2px solid #000',
            padding: '14px 40px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'background 0.1s steps(2)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ff0000'}
          onMouseLeave={e => e.currentTarget.style.background = '#000'}
        >
          ↻ Load Experimental Data
        </button>
      </div>
    </main>
  );
}
