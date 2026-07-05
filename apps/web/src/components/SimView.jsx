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
        <div className="sim-view__status">Loading...</div>
    );

    if (error) return (
        <div className="sim-view__status sim-view__status--error">
            Error: {error}
        </div>
    );

    if (!simulation) return (
        <div className="sim-view__status">Simulation not found</div>
    );

    const sketchFn = sketchRegistry[simulation.id];
    const parameters = simulation.Simulation_Config?.parameters;

    return (
        <div className="sim-view">
            <div className="sim-view__header">
                <h2 className="sim-view__title">{simulation.title}</h2>
                <p className="sim-view__desc">{simulation.description}</p>
            </div>

            {parameters && config && (
                <div className="sim-view__controls">
                    {Object.entries(config).map(([key, value]) => {
                        if (key === "objectType") {
                            return (
                                <label key={key} className="sim-view__field">
                                    <span className="sim-view__label">Object Type</span>
                                    <select
                                        value={value}
                                        onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                                        className="sim-view__select"
                                    >
                                        <option value="bowling">Bowling Ball (Heavy)</option>
                                        <option value="rubber">Rubber Ball (Bouncy)</option>
                                        <option value="feather">Feather (Light)</option>
                                    </select>
                                </label>
                            );
                        }
                        if (typeof value === "number") {
                            return (
                                <label key={key} className="sim-view__field">
                                    <span className="sim-view__label">{key}: {value}</span>
                                    <input
                                        type="range"
                                        min="0" max="100" step="0.1"
                                        value={value}
                                        onChange={(e) => setConfig({ ...config, [key]: +e.target.value })}
                                        className="sim-view__range"
                                    />
                                </label>
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            <div className="sim-view__canvas-wrapper">
                {sketchFn && config
                    ? <SimulationCanvas config={config} sketchFn={sketchFn} />
                    : <p className="sim-view__missing">Sketch coming soon for "{simulation.title}"</p>
                }
            </div>

        </div>
    );
}
