import express from "express";
import * as subjectController from "../controllers/subject.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const subjectRoutes = express.Router();

subjectRoutes.get("/", optionalAuth, subjectController.getAllSubjects);
subjectRoutes.post("/", authenticate, subjectController.createSubject);
subjectRoutes.put("/:id", authenticate, subjectController.updateSubject);
subjectRoutes.delete("/:id", authenticate, subjectController.deleteSubject);

export default subjectRoutes;
