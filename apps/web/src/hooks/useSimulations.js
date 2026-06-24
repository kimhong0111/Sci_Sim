import { useState, useEffect } from "react";
import { simulationService } from "../services/api";

export function useSimulations(id = null) {
  const [simulations, setSimulations] = useState([]);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await simulationService.getAll();
      setSimulations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (targetId) => {
    try {
      setLoading(true);
      const data = await simulationService.getById(targetId);
      setSimulation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchById(id);
    } else {
      fetchAll();
    }
  }, [id]);

  const create = async (data) => {
    const created = await simulationService.create(data);
    setSimulations((prev) => [created, ...prev]);
    return created;
  };

  const remove = async (id) => {
    await simulationService.delete(id);
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  return { simulations, simulation, loading, error, create, remove, refetch: fetchAll };
}