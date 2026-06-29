import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/layout/Hero';
import { SimulationGrid } from '../components/layout/SimulationGrid';
import { DetailOverlay } from '../components/layout/DetailOverlay';
import { Footer } from '../components/layout/Footer';
import { useSimulations } from '../hooks/useSimulations';

// Maps category filter string to subject_id from the real API
const CATEGORY_TO_SUBJECT_ID = {
  physics: 1,
  chemistry: 2,
  biology: 3,
};

export default function SimulationHub() {
  const { simulations, loading, error } = useSimulations();

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const gridRef = useRef(null);

  // Computed filtered list using real API's subject_id
  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const matchesCategory =
        activeFilter === 'all' ||
        sim.subject_id === CATEGORY_TO_SUBJECT_ID[activeFilter];

      // Topic sub-filter: match Topic.name if provided
      const matchesTopic =
        !activeSubFilter || sim.Topic?.name === activeSubFilter;

      return matchesCategory && matchesTopic;
    });
  }, [simulations, activeFilter, activeSubFilter]);

  // Handlers
  const handleFilterChange = (filter, subFilter = null) => {
    setActiveFilter(filter);
    setActiveSubFilter(subFilter);
  };

  const handleSimulationSelect = (simulation) => {
    setSelectedSimulation(simulation);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedSimulation(null);
  };

  const handleExploreClick = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Nav subject handlers — set filter + optional topic sub-filter
  const handlePhysicsClick = (topic) => {
    handleFilterChange('physics', topic);
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChemistryClick = (topic) => {
    handleFilterChange('chemistry', topic);
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBiologyClick = (topic) => {
    handleFilterChange('biology', topic);
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = detailOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailOpen]);

  return (
    <div className="simulation-hub">
      <Navigation
        onPhysicsClick={handlePhysicsClick}
        onChemistryClick={handleChemistryClick}
        onBiologyClick={handleBiologyClick}
        activeFilter={activeFilter}
        activeSubFilter={activeSubFilter}
      />

      <Hero onExploreClick={handleExploreClick} />

      <div ref={gridRef}>
        {loading && (
          <div className="simulation-hub__status">
            <p>Loading simulations...</p>
          </div>
        )}
        {error && (
          <div className="simulation-hub__status simulation-hub__status--error">
            <p>Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <SimulationGrid
            simulations={filteredSimulations}
            onSimulationSelect={handleSimulationSelect}
            activeFilter={activeFilter}
            activeSubFilter={activeSubFilter}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      <Footer />

      <DetailOverlay
        isOpen={detailOpen}
        simulation={selectedSimulation}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
