import React from 'react';
import { Badge } from '../ui/Badge';

export function SimulationCard({ simulation, onOpen }) {
  const categoryLabel = simulation.Subject?.name || 'General';
  const subjectKey = simulation.Subject?.name?.toLowerCase() || 'general';
  const topicLabel = simulation.Topic?.name || '';

  return (
    <div
      className="simulation-card"
      data-subject={subjectKey}
      onClick={() => onOpen(simulation)}
    >
      <div className="simulation-card__image-wrapper">
        {simulation.thumbnail_url ? (
          <img src={simulation.thumbnail_url} alt={simulation.title} className="simulation-card__image" />
        ) : (
          <div className="simulation-card__image-placeholder" />
        )}
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
