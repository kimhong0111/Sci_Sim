import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import SimView from "./components/SimView";
import SimulationHub from "./pages/SimulationHub";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SimulationHub />} />
      <Route path="/simulations/:id" element={<SimView />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
