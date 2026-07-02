import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { SimulationCanvas } from "./SimulationCanvas";
import { simulationService } from "../services/api";
import { sketchRegistry } from "../sketches";

export default function SimView() {
    const { id } = useParams();
    const [simulation, setSimulation] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    simulationService.getById(id)
        .then((res) => {
            setSimulation(res);
            if (res.Simulation_Config?.parameters) {
                setConfig(res.Simulation_Config.parameters);
            }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
}, [id]);

    if (loading) return (
        <div style={{ color: "white", padding: "2rem" }}>
            Loading...
        </div>
    );

    if (error) return (
        <div style={{ color: "#f88", padding: "2rem" }}>
            Error: {error}
        </div>
    );

    if (!simulation) return (
        <div style={{ color: "white", padding: "2rem" }}>
            Simulation not found
        </div>
    );

    const sketchFn = sketchRegistry[simulation.id];
    const parameters = simulation.Simulation_Config?.parameters;

    return (
        <div style={{ padding: "2rem", background: "#111", minHeight: "100vh", color: "white" }}>
            <h2>{simulation.title}</h2>
            <p style={{ color: "#888", marginBottom: "1rem" }}>{simulation.description}</p>

            {/* sliders — only render if config exists */}
            {parameters && config && (
                <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                    {Object.entries(config).map(([key, value]) => (
          typeof value === "number" && (
        <label key={key}>
            {key}: {value}
            <input
                type="range"
                min="0" max="100" step="0.1"
                value={value}
                onChange={(e) => setConfig({ ...config, [key]: +e.target.value })}
                style={{ display: "block" }}
            />
          </label>
    )
))}
                </div>
            )}

            {sketchFn && config
                ? <SimulationCanvas config={config} sketchFn={sketchFn} />
                : <p style={{ color: "#f88" }}>Sketch coming soon for "{simulation.title}"</p>
            }

            <p style={{ marginTop: "0.5rem", color: "#888" }}>
                Click canvas to reset
            </p>
        </div>
    );
}