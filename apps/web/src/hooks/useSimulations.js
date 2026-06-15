import { useState, useEffect } from "react";
import { simulationService } from "../services/api";

export function useSimulations() {
  const [simulations, setSimulations] = useState([]);
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

  useEffect(() => { fetchAll(); }, []);

  const create = async (data) => {
    const created = await simulationService.create(data);
    setSimulations((prev) => [created, ...prev]);
    return created;
  };

  const remove = async (id) => {
    await simulationService.delete(id);
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  return { simulations, loading, error, create, remove, refetch: fetchAll };
}
