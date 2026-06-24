import express from "express";
import * as simulationController from "../controllers/simulation.controller.js";

const simulationRoutes = express.Router();

simulationRoutes.get("/", simulationController.getAllSimulation);
simulationRoutes.get("/:id", simulationController.getSimulationById);
simulationRoutes.post("/", simulationController.createNewSimulation);
simulationRoutes.put("/:id", simulationController.updateExistingSimulation);
simulationRoutes.delete("/:id", simulationController.removeSimulation);

export default simulationRoutes;
