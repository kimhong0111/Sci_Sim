import { useParams } from "react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SimulationCanvas } from "./SimulationCanvas";
import { simulationService } from "../services/api";
import { sketchRegistry } from "../sketches";
import { Badge } from "./ui/Badge";

function fmtLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

export default function SimView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restartKey, setRestartKey] = useState(0);
  const initialConfigRef = useRef(null);

  useEffect(() => {
    simulationService
      .getById(id)
      .then((res) => {
        setSimulation(res);
        if (res.Simulation_Config?.parameters) {
          const params = res.Simulation_Config.parameters;
          initialConfigRef.current = { ...params };
          setConfig(params);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleExit = useCallback(() => {
    window.scrollTo(0, 0);
    navigate("/");
  }, [navigate]);

  const handleRestart = useCallback(() => {
    if (initialConfigRef.current) {
      setConfig({ ...initialConfigRef.current });
    }
    setRestartKey((k) => k + 1);
  }, []);

  if (loading)
    return <div className="sim-view__status">Loading...</div>;

  if (error)
    return (
      <div className="sim-view__status sim-view__status--error">
        Error: {error}
      </div>
    );

  if (!simulation)
    return <div className="sim-view__status">Simulation not found</div>;

  const sketchFn = sketchRegistry[simulation.sketch_key];
  const parameters = simulation.Simulation_Config?.parameters;

  return (
    <div className="sim-view">
      {/* ─── SIDEBAR ─── */}
      <aside className="sim-view__sidebar">
        <button className="sim-view__exit-btn" onClick={handleExit}>
          <span className="sim-view__exit-icon">←</span>
          EXIT
        </button>

        <div className="sim-view__info">
          <h1 className="sim-view__title">{simulation.title}</h1>
          <p className="sim-view__desc">{simulation.description}</p>

          <div className="sim-view__badges">
            {simulation.Subject?.name && (
              <Badge label={simulation.Subject.name} variant="category" />
            )}
            {simulation.Topic?.name && (
              <Badge label={simulation.Topic.name} variant="tag" />
            )}
          </div>
        </div>

        <div className="sim-view__divider" />

        {parameters && config && (
          <div className="sim-view__controls">
            <span className="sim-view__section-label">Parameters</span>
            {Object.entries(config).map(([key, value]) => {
              if (key === "objectType") {
                return (
                  <label key={key} className="sim-view__field">
                    <span className="sim-view__label">Object Type</span>
                    <select
                      value={value}
                      onChange={(e) =>
                        setConfig({ ...config, [key]: e.target.value })
                      }
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
                    <div className="sim-view__field-header">
                      <span className="sim-view__label">
                        {fmtLabel(key)}
                      </span>
                      <span className="sim-view__value">{value}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={value}
                      onChange={(e) =>
                        setConfig({ ...config, [key]: +e.target.value })
                      }
                      className="sim-view__range"
                    />
                  </label>
                );
              }
              return null;
            })}
          </div>
        )}

        <div className="sim-view__divider" />

        <button
          className="sim-view__restart-btn"
          onClick={handleRestart}
        >
          ↻ RESTART
        </button>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="sim-view__main">
        <div className="sim-view__canvas-wrapper">
          {sketchFn && config ? (
            <SimulationCanvas
              key={restartKey}
              config={config}
              sketchFn={sketchFn}
            />
          ) : (
            <p className="sim-view__missing">
              Sketch coming soon for "{simulation.title}"
            </p>
          )}
        </div>
        <span className="sim-view__hint">
          Click inside the simulation to interact
        </span>
      </main>
    </div>
  );
}
