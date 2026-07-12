import express from "express";
import * as topicController from "../controllers/topic.controller.js";

const topicRoutes = express.Router();

topicRoutes.get("/", topicController.getAllTopics);
topicRoutes.post("/", topicController.createTopic);

export default topicRoutes;
