import React from "react";
import { Routes, Route } from "react-router-dom";
import Simulation from "./pages/Simulations";
import "./index.css";
import { Layout } from "./pages/Layout";
import SimView from "./components/SimView";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
         <Route path="/simulations" element={<Simulation />}></Route>
         <Route path="/simulations/:id" element={<SimView />} />

      </Route>
    </Routes>
  );
}
