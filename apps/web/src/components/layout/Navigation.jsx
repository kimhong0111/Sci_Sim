import React from 'react';
import { NavDropdown } from '../features/NavDropdown';

const SUBJECT_ID_MAP = {
  physics: 1,
  chemistry: 2,
  biology: 3,
};

export function Navigation({
  onPhysicsClick,
  onChemistryClick,
  onBiologyClick,
  activeFilter,
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const physicsItems = [
    { label: 'Mechanics', topic: 'Mechanics', onClick: () => onPhysicsClick('Mechanics') },
    { label: 'Thermodynamics', topic: 'Thermodynamics', onClick: () => onPhysicsClick('Thermodynamics') },
    { label: 'Electromagnetism', topic: 'Electromagnetism', onClick: () => onPhysicsClick('Electromagnetism') },
    { label: 'All Physics', topic: null, onClick: () => onPhysicsClick(null) },
  ];

  const chemistryItems = [
    { label: 'Organic', topic: 'Organic', onClick: () => onChemistryClick('Organic') },
    { label: 'Inorganic', topic: 'Inorganic', onClick: () => onChemistryClick('Inorganic') },
    { label: 'Physical', topic: 'Physical', onClick: () => onChemistryClick('Physical') },
    { label: 'All Chemistry', topic: null, onClick: () => onChemistryClick(null) },
  ];

  const biologyItems = [
    { label: 'Cellular', topic: 'Cellular', onClick: () => onBiologyClick('Cellular') },
    { label: 'Genetics', topic: 'Genetics', onClick: () => onBiologyClick('Genetics') },
    { label: 'Ecology', topic: 'Ecology', onClick: () => onBiologyClick('Ecology') },
    { label: 'All Biology', topic: null, onClick: () => onBiologyClick(null) },
  ];

  return (
    <nav className="navigation">
      <div className="navigation__logo-section" onClick={scrollToTop}>
        <span className="navigation__logo">SS</span>
        <span className="navigation__brand">Science Simulation</span>
      </div>

      <div className="navigation__menu">
        <NavDropdown
          label="Physics"
          items={physicsItems}
          isActive={activeFilter === 'physics'}
        />
        <NavDropdown
          label="Chemistry"
          items={chemistryItems}
          isActive={activeFilter === 'chemistry'}
        />
        <NavDropdown
          label="Biology"
          items={biologyItems}
          isActive={activeFilter === 'biology'}
        />
      </div>

      <div className="navigation__search-actions">
        <input
          className="navigation__search"
          type="text"
          placeholder="Search simulations..."
          aria-label="Search simulations"
        />
      </div>
    </nav>
  );
}
