import { Simulation, Subject, Topic, Simulation_Config } from "../models/index.js";

export async function fetchSimulationAndTransform() {
  const simulations = await Simulation.findAll({
    include: [
      { model: Subject, attributes: ["name"] },
      { model: Topic, attributes: ["name"] },
      { model: Simulation_Config, attributes: ["parameters"] },
    ],
  });

  if (!simulations || simulations.length === 0) return [];
  return simulations;
}

export async function fetchSimulationByIdAndTransform(id) {
  const simulation = await Simulation.findByPk(id, {
    include: [
      { model: Subject, attributes: ["name"] },
      { model: Topic, attributes: ["name"] },
      { model: Simulation_Config, attributes: ["parameters"] },
    ],
  });

  if (!simulation) return null;
  return simulation;
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
