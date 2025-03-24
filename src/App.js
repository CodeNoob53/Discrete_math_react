import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Sets from './pages/Sets';
import Matrix from "./pages/Matrix";
import Home from "./pages/home/Home";
import HammingCode from "./pages/HammingCode";
import VectorCalculations from "./pages/Vectors";
import Combinatorics from "./pages/Combinatorics";
import CacheMemoryCalculator from "./pages/Cache";
import ThemeToggle from "./components/ThemeToggle";
import DecryptMessage from "./pages/DecryptMessage";
import ValidateChecksum from "./pages/ValidateChecksum";
import SolveLinearEquations from "./pages/SolveLinearEquations";

import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <header className="header">
        <div className="header-left">
          <Link to="/" className="home-icon">
            <span className="material-symbols-outlined">home</span>
            <span className="header-text">Home</span>
          </Link>
        </div>
        <h1 className="header-title">Discrete Math Calculator</h1>
        <ThemeToggle />
      </header>
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