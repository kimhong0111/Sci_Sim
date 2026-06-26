import React from 'react';
import { FilterBar } from '../features/FilterBar';
import { SimulationCard } from '../features/SimulationCard';
import { Button } from '../ui/Button';

export function SimulationGrid({
  simulations,
  onSimulationSelect,
  activeFilter,
  onFilterChange,
}) {
  return (
    <main className="simulation-grid">
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
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
        <Button variant="secondary">Load More</Button>
      </div>
    </main>
  );
}
