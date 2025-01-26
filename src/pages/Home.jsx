import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Home.css";

const Home = () => {
  return (
    <div>
      <div className="navigation">
        {/* <Link to="/cnf_to_dnf" className="nav-button">CNF to DNF</Link> */}
        {/* <Link to="/recurrence_relations" className="nav-button">Recurrence Relations</Link> */}
        {/* <Link to="/solving_recurrence_relations" className="nav-button">Solving Recr. Relations</Link> */}
        {/* <Link to="/number_theory" className="nav-button">Number Theory</Link> */}
        <Link to="/sets" className="nav-button">Sets</Link>
        <Link to="/decrypt" className="nav-button">Decrypt Message</Link>
        <Link to="/hamming" className="nav-button">Hamming Code</Link>
        <Link to="/validate_checksum" className="nav-button">Validate Checksum</Link>
        <Link to="/combinatorics" className="nav-button">Combinatorics</Link>
        <Link to="/cache_calc" className="nav-button">Cache Memory Calculator</Link>
        <Link to="/solve_linear_equations" className="nav-button">Solve Linear Equations</Link>
        <Link to="/vectors" className="nav-button">Vectors</Link>
      </div>
      <section className="description">
        <p>
          <strong>Welcome to the Discrete Math Calculator!</strong><br />
          This application provides tools for solving problems in discrete mathematics,
          including logical transformations, recurrence relations, and more.<br />
          Use the options below to access specific calculators.
        </p>
      </section>
    </div>
  );
};

export default Home;
