import express from "express";
import * as subjectController from "../controllers/subject.controller.js";
import { authenticate } from "../middleware/auth.js";

const subjectRoutes = express.Router();

subjectRoutes.get("/", subjectController.getAllSubjects);
subjectRoutes.post("/", authenticate, subjectController.createSubject);

export default subjectRoutes;
