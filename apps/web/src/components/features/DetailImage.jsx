import React from 'react';

const SUBJECT_KEY = {
  1: 'physics',
  2: 'chemistry',
  3: 'biology',
};

export function DetailImage({ simulation, onBack }) {
  const subjectKey = SUBJECT_KEY[simulation?.subject_id] || 'general';

  return (
    <div className="detail-image" data-subject={subjectKey} style={{ minHeight: '300px' }}>
      <div className="detail-image__overlay" />
      <div className="detail-image__back">
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#000',
            color: '#fff',
            border: '2px solid #000',
            padding: '8px 16px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'background 0.1s steps(2)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ff0000'}
          onMouseLeave={e => e.currentTarget.style.background = '#000'}
        >
          ← BACK TO HUB
        </button>
      </div>
    </div>
  );
}
