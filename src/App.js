import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Sets from './pages/Sets';
import Matrix from "./pages/Matrix";
import Home from "./pages/home/Home";
import HammingCode from "./pages/HammingCode";
import VectorCalculations from "./pages/Vectors";
import Combinatorics from "./pages/Combinatorics";
import CacheMemoryCalculator from "./pages/Cache";
import Header from "./components/header/Header"; // Імпортуємо оновлений Header
import DecryptMessage from "./pages/DecryptMessage";
import ValidateChecksum from "./pages/ValidateChecksum";
import SolveLinearEquations from "./pages/SolveLinearEquations";

import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sets" element={<Sets />} />
          <Route path="/decrypt" element={<DecryptMessage />} />
          <Route path="/hamming" element={<HammingCode />} />
          <Route path="/validate_checksum" element={<ValidateChecksum />} />
          <Route path="/combinatorics" element={<Combinatorics />} />
          <Route path="/cache_calc" element={<CacheMemoryCalculator />} />
          <Route path="/solve_linear_equations" element={<SolveLinearEquations />} />
          <Route path="/vectors" element={<VectorCalculations />} />
          <Route path="/matrix" element={<Matrix />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;