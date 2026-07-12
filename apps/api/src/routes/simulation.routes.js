import express from "express";
import * as simulationController from "../controllers/simulation.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const simulationRoutes = express.Router();

simulationRoutes.get("/", simulationController.getAllSimulation);
simulationRoutes.get("/:id", simulationController.getSimulationById);
simulationRoutes.post("/", authenticate, requireAdmin, upload.single("image"), simulationController.createNewSimulation);
simulationRoutes.put("/:id", authenticate, requireAdmin, upload.single("image"), simulationController.updateExistingSimulation);
simulationRoutes.delete("/:id", authenticate, requireAdmin, simulationController.removeSimulation);

export default simulationRoutes;
