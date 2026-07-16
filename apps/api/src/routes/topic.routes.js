import express from "express";
import * as topicController from "../controllers/topic.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const topicRoutes = express.Router();

topicRoutes.get("/", optionalAuth, topicController.getAllTopics);
topicRoutes.post("/", authenticate, topicController.createTopic);
topicRoutes.put("/:id", authenticate, topicController.updateTopic);
topicRoutes.delete("/:id", authenticate, topicController.deleteTopic);

export default topicRoutes;
