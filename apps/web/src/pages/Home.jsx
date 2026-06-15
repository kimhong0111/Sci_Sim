import React, { useState } from "react";
import { useSimulations } from "../hooks/useSimulations";
import SimulationCard from "../components/SimulationCard";

export default function Home() {
  const { simulations, loading, error, create, remove } = useSimulations();
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await create({ ...form, parameters: {} });
    setForm({ name: "", description: "" });
  };

  return (
    <div className="page">
      <h1>Science Simulations</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Simulation name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Simulation</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="grid">
        {simulations.map((s) => (
          <SimulationCard key={s.id} simulation={s} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}
