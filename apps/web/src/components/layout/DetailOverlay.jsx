import React, { useEffect } from 'react';
import { DetailImage } from '../features/DetailImage';
import { DetailPanel } from '../features/DetailPanel';

export function DetailOverlay({ isOpen, simulation, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !simulation) return null;

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <div className="detail-overlay__content">
        <DetailImage onBack={onClose} />
        <DetailPanel simulation={simulation} onInitialize={() => {}} />
      </div>
    </div>
  );
}
