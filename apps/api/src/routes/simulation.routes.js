import express from "express";
import * as simulationController from "../controllers/simulation.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { validateConfig } from "../middleware/validateConfig.js";

const simulationRoutes = express.Router();

simulationRoutes.get("/", optionalAuth, simulationController.getAllSimulation);
simulationRoutes.get("/:id", optionalAuth, simulationController.getSimulationById);
simulationRoutes.post("/", authenticate, upload.single("image"), validateConfig, simulationController.createNewSimulation);
simulationRoutes.put("/:id", authenticate, upload.single("image"), validateConfig, simulationController.updateExistingSimulation);
simulationRoutes.delete("/:id", authenticate, simulationController.removeSimulation);

export default simulationRoutes;
