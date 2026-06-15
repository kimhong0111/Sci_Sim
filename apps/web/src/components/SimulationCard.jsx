import React from "react";

export default function SimulationCard({ simulation, onDelete }) {
  return (
    <div className="card">
      <h3>{simulation.name}</h3>
      <p>{simulation.description || "No description"}</p>
      <pre className="params">
        {JSON.stringify(simulation.parameters, null, 2)}
      </pre>
      <button className="btn-danger" onClick={() => onDelete(simulation.id)}>
        Delete
      </button>
    </div>
  );
}
