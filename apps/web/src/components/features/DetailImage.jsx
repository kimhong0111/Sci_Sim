import React from 'react';
import { Button } from '../ui/Button';

export function DetailImage({ onBack }) {
  return (
    <div className="detail-image">
      <div className="detail-image__placeholder" />
      <div className="detail-image__back">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
