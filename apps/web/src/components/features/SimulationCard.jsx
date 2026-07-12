import React from 'react';
import { Badge } from '../ui/Badge';

const SUBJECT_MAP = {
  1: 'Physics',
  2: 'Chemistry',
  3: 'Biology',
};

const SUBJECT_KEY = {
  1: 'physics',
  2: 'chemistry',
  3: 'biology',
};

export function SimulationCard({ simulation, onOpen }) {
  const categoryLabel = SUBJECT_MAP[simulation.subject_id] || simulation.Subject?.name || 'General';
  const subjectKey = SUBJECT_KEY[simulation.subject_id] || 'general';
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
