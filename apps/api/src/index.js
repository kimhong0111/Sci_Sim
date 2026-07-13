import express from "express";
import simulationRoutes from "./routes/simulation.routes.js";
import authRoutes from "./routes/auth.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import topicRoutes from "./routes/topic.routes.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/simulations", simulationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);

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
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


  

