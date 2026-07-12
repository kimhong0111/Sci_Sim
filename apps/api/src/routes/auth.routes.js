import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/login", authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.post("/register", authenticate, requireAdmin, authController.register);
authRoutes.get("/users", authenticate, requireAdmin, authController.listAdmins);

export default authRoutes;
