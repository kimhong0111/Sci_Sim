import React from 'react';
import { Button } from '../ui/Button';

export function Hero({ onExploreClick }) {
  return (
    <section className="hero">
      <h1 className="hero__headline">
        Explore the Universe<br />
        <span className="hero__accent">Through Science</span>
      </h1>
      <p className="hero__body">
        Interactive simulations for physics, chemistry, and biology.
        Visualize complex concepts in real time.
      </p>
      <Button variant="primary" onClick={onExploreClick}>
        Explore Simulations
      </Button>
    </section>
  );
}
