import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function DetailPanel({ simulation }) {
  const navigate = useNavigate();
  const categoryLabel = simulation.Subject?.name || 'General';
  const topicLabel = simulation.Topic?.name || null;

  const handleInitialize = () => {
    navigate(`/simulations/${simulation.id}`);
  };

  return (
    <div className="detail-panel">

      {/* Header */}
      <div className="detail-panel__header">
        <Badge label={categoryLabel} variant="category" />
        {topicLabel && <Badge label={topicLabel} variant="tag" />}
      </div>

      <h2 className="detail-panel__title">{simulation.title}</h2>

      {/* Lesson description */}
      <div className="lesson-card">
        <div className="lesson-card__label">About This Lesson</div>
        <p className="lesson-card__description">
          {simulation.description || 'No description available for this simulation.'}
        </p>
      </div>

      {/* Lesson meta info */}
      <div className="lesson-meta">
        <div className="lesson-meta__item">
          <span className="lesson-meta__key">Subject</span>
          <span className="lesson-meta__value">{categoryLabel}</span>
        </div>

        {topicLabel && (
          <div className="lesson-meta__item">
            <span className="lesson-meta__key">Topic</span>
            <span className="lesson-meta__value">{topicLabel}</span>
          </div>
        )}

        <div className="lesson-meta__item">
          <span className="lesson-meta__key">Type</span>
          <span className="lesson-meta__value">Interactive Simulation</span>
        </div>
      </div>

      {/* CTA */}
      <div className="detail-panel__cta">
        <Button variant="primary" onClick={handleInitialize}>
          Start Simulation
        </Button>
      </div>

    </div>
  );
}
