import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/login", authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.post("/register", authenticate, authController.register);
authRoutes.get("/users", authenticate, authController.listAdmins);
authRoutes.put("/password", authenticate, authController.changePassword);
authRoutes.delete("/:id", authenticate, authController.deleteAdmin);

export default authRoutes;
