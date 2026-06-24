import { useParams  } from "react-router";
import { useState } from "react";
import { useSimulations } from "../hooks/useSimulations";
import { SimulationCanvas } from "./SimulationCanvas";

export default function SimView() {
  const [config, setConfig] = useState({ gravity: 9.8, mass: 3 })

  return (
    <div style={{ padding: "2rem", background: "#111", minHeight: "100vh", color: "white" }}>
      <h2>Free Fall Simulation</h2>

      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <label>
          Gravity: {config.gravity}
          <input
            type="range" min="1" max="20" step="0.1"
            value={config.gravity}
            onChange={(e) => setConfig({ ...config, gravity: +e.target.value })}
            style={{ display: "block" }}
          />
        </label>

        <label>
          Mass: {config.mass}
          <input
            type="range" min="1" max="10" step="0.5"
            value={config.mass}
            onChange={(e) => setConfig({ ...config, mass: +e.target.value })}
            style={{ display: "block" }}
          />
        </label>
      </div>
      <SimulationCanvas config={config} />
      <p style={{ marginTop: "0.5rem", color: "#888" }}>Click canvas to reset ball position</p>
    </div>
  )
}