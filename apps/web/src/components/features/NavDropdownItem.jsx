import React from 'react';

export function NavDropdownItem({ label, onClick }) {
  return (
    <li className="nav-dropdown__item">
      <button className="nav-dropdown__item-btn" onClick={onClick}>
        {label}
      </button>
    </li>
  );
}
