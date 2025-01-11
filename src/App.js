import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
// import RecurrenceRelations from './pages/RecurrenceRelations';
// import SolvingRecurrenceRelations from './pages/SolvingRecurrenceRelations';
import Sets from './pages/Sets';
import DecryptMessage from "./pages/DecryptMessage";
import HammingCode from "./pages/HammingCode";
import ValidateChecksum from "./pages/ValidateChecksum";
import Combinatorics from "./pages/Combinatorics";
import CacheMemoryCalculator from "./pages/Cache";

import ThemeToggle from "./components/ThemeToggle";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Імітація затримки на 2 секунди

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
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
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/cnf_to_dnf" element={<div>CNF to DNF Page</div>} />
              <Route path="/recurrence_relations" element={<RecurrenceRelations />} />
              <Route path="/solving_recurrence_relations" element={<SolvingRecurrenceRelations />} />
              <Route path="/number_theory" element={<div>Number Theory Page</div>} /> */}
              <Route path="/sets" element={<Sets />} />
              <Route path="/decrypt" element={<DecryptMessage />} />
              <Route path="/hamming" element={<HammingCode />} />
              <Route path="/validate_checksum" element={<ValidateChecksum />} />
              <Route path="/combinatorics" element={<Combinatorics />} />
              <Route path="/cache_calc" element={<CacheMemoryCalculator />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;
