import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import SimView from "./components/SimView";
import SimulationHub from "./pages/SimulationHub";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SimulationHub />} />
      <Route path="/simulations/:id" element={<SimView />} />
    </Routes>
  );
}
