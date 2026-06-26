import React from 'react';
import { Badge } from '../ui/Badge';

// Maps subject_id to display category name
const SUBJECT_MAP = {
  1: 'Physics',
  2: 'Chemistry',
  3: 'Biology',
};

export function SimulationCard({ simulation, onOpen }) {
  const categoryLabel = SUBJECT_MAP[simulation.subject_id] || simulation.Subject?.name || 'General';
  const topicLabel = simulation.Topic?.name || '';

  return (
    <div className="simulation-card" onClick={() => onOpen(simulation)}>
      <div className="simulation-card__image-wrapper">
          <div className="simulation-card__image-placeholder" />
        <Badge label={categoryLabel} variant="category" />
      </div>
      <div className="simulation-card__body">
        <h3 className="simulation-card__title">{simulation.title}</h3>
        <p className="simulation-card__description">
          {simulation.description || 'No description available.'}
        </p>
        {topicLabel && (
          <div className="simulation-card__tags">
            <span className="tag">{topicLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
