import React from 'react';
import { Button } from '../ui/Button';

export function Hero({ onExploreClick }) {
  return (
    <section className="hero">

      <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
        <div className="hero__version-tag">Science Simulation v1</div>

        <h1 className="hero__headline">
          Interactive Science at the{' '}
          <span className="hero__accent">Edge of Discovery</span>
        </h1>

        <p className="hero__body">
          Explore high-fidelity mathematical simulations designed for researchers and educators.
          Experience the mechanics of the universe through data-driven visualization.
        </p>

        <Button variant="primary" onClick={onExploreClick}>
          Explore Simulations
        </Button>
      </div>
    </section>
  );
}
