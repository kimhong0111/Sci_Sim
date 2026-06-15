import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import { Layout } from "./pages/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
         <Route path="/simulations" element={<Home />}></Route>

      </Route>
    </Routes>
  );
}
