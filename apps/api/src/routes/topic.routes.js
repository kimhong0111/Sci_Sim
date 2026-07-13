import express from "express";
import * as topicController from "../controllers/topic.controller.js";
import { authenticate } from "../middleware/auth.js";

const topicRoutes = express.Router();

topicRoutes.get("/", topicController.getAllTopics);
topicRoutes.post("/", authenticate, topicController.createTopic);

export default topicRoutes;
