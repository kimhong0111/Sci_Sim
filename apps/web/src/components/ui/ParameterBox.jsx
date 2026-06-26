import React from 'react';

export function ParameterBox({ label, value }) {
  return (
    <div className="parameter-box">
      <span className="parameter-box__label">{label}</span>
      <span className="parameter-box__value">{value}</span>
    </div>
  );
}
