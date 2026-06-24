import express from "express";
import simulationRoutes from "./routes/simulation.routes.js";
import sequelize from "./config/db.js";
import { Subject, Topic, Simulation, Simulation_Config, User } from "./models/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/simulations", simulationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Connect and start server
sequelize.authenticate().then(() => {
  console.log("DB connected");
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});


  

