import React from 'react';

export function IconButton({ icon, onClick }) {
  return (
    <button className="icon-button" onClick={onClick} aria-label={icon}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
