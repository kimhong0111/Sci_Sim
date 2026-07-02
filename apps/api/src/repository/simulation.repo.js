import { single } from "rxjs";
import { Simulation, Subject, Topic, Simulation_Config } from "../models/index.js";

export async function fetchSimulationAndTransform() {
    const simulations = await Simulation.findAll({
        include: [
            { model: Subject, attributes: ["name"] },
            { model: Topic, attributes: ["name"] },
            { 
                model: Simulation_Config, 
                foreignKey: "simulation_id", 
            },
        ],
    });
    if (!simulations || simulations.length === 0) return [];
    return simulations;
}

export async function fetchSimulationByIdAndTransform(id) {
    return await Simulation.findOne({
        where: { id },
        include: [
            { model: Subject, attributes: ["name"] },
            { model: Topic, attributes: ["name"] },
            { 
                model: Simulation_Config,
                foreignKey: "simulation_id",  // ← add this
            },
        ],
    });
}

export async function createSimulation(data) {
  const simulation = await Simulation.create(data);
  return simulation;
}

export async function updateSimulation(id, data) {
  const simulation = await Simulation.findByPk(id);
  if (!simulation) return null;
  await simulation.update(data);
  return simulation;
}

export async function deleteSimulation(id) {
  const simulation = await Simulation.findByPk(id);
  if (!simulation) return false;
  await simulation.destroy();
  return true;
}
