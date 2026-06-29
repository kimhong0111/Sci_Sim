import React from 'react';
import { NavDropdownItem } from './NavDropdownItem';

export function NavDropdown({ label, items, isActive }) {
  const subjectKey = label.toLowerCase();
  return (
    <div className={`nav-dropdown nav-dropdown--${subjectKey} ${isActive ? 'nav-dropdown--active' : ''}`}>
      <button className="nav-dropdown__trigger">
        {label}
        <span className="nav-dropdown__arrow">▾</span>
      </button>
      <ul className="nav-dropdown__menu">
        {items.map((item) => (
          <NavDropdownItem
            key={item.topic}
            label={item.label}
            onClick={item.onClick}
          />
        ))}
      </ul>
    </div>
  );
}
