import React from "react";
import { useNavigate } from "react-router";

export default function SimulationCard({ simulation, onDelete }) {
  const navigate = useNavigate()

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
      <button className="btn-danger" onClick={()=> navigate(`/simulations/${simulation.id}`)}>
        View
      </button>
    </div>
  );
}
