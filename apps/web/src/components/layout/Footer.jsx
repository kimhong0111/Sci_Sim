import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__brand">Science Simulation</span>
        <span className="footer__copy">
          © {new Date().getFullYear()} Science Simulation Platform. All rights reserved.
        </span>
        <div className="footer__system-state">
          SYSTEM STATE: NOMINAL
        </div>
      </div>
    </footer>
  );
}
