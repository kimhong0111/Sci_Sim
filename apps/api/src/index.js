import express from 'express'
import simulationRoutes from './routes/simulation.routes.js'
import { Topic } from './models/Topic.js';
import cors from 'cors'

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

// Start server
 app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


  

