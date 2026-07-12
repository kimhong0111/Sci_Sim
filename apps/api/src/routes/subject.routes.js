import express from "express";
import * as subjectController from "../controllers/subject.controller.js";

const subjectRoutes = express.Router();

subjectRoutes.get("/", subjectController.getAllSubjects);

export default subjectRoutes;
