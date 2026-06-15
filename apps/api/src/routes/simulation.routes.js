import express from 'express'
import * as simulationController from "../controllers/simulation.controller.js"
const simulationRoutes= express.Router()


simulationRoutes.get('/',simulationController.getAllSimulation)
simulationRoutes.get('/:id',simulationController.getSimulationById)





export default simulationRoutes