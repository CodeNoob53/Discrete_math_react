import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedSection, setExpandedSection] = useState(null);

  // Відстежуємо зміну розміру вікна для адаптивного дизайну
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Визначення структури секцій
  const sections = {
    discreteMath: [
      { path: "/sets", label: "Sets" },
      { path: "/combinatorics", label: "Combinatorics" },
      { path: "/solve_linear_equations", label: "Solve Linear Equations" },
      { path: "/vectors", label: "Vectors" },
    ],
    digitalTech: [
      { path: "/decrypt", label: "Decrypt Message" },
      { path: "/hamming", label: "Hamming Code" },
      { path: "/validate_checksum", label: "Validate Checksum" },
      { path: "/cache_calc", label: "Cache Memory Calculator" },
    ],
    advancedMath: [
      { path: "/matrix", label: "Matrix Operations" },
    ]
  };

  // Функція перемикання розділу в мобільному режимі
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Рендер навігаційних кнопок
  const renderNavButtons = (items) => (
    <div className="nav-buttons-container">
      {items.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <button className="nav-button">{item.label}</button>
        </Link>
      ))}
    </div>
  );

  // Рендер мобільного вигляду з акордеонами
  const renderMobileView = () => (
    <div className="mobile-sections">
      <div className="accordion">
        <div 
          className={`accordion-header ${expandedSection === 'discreteMath' ? 'expanded' : ''}`}
          onClick={() => toggleSection('discreteMath')}
        >
          <h2>Discrete Math</h2>
          <span className="expand-icon">{expandedSection === 'discreteMath' ? '−' : '+'}</span>
        </div>
        <div className={`accordion-content ${expandedSection === 'discreteMath' ? 'show' : ''}`}>
          {renderNavButtons(sections.discreteMath)}
        </div>
      </div>

      <div className="accordion">
        <div 
          className={`accordion-header ${expandedSection === 'digitalTech' ? 'expanded' : ''}`}
          onClick={() => toggleSection('digitalTech')}
        >
          <h2>Digital Technologies</h2>
          <span className="expand-icon">{expandedSection === 'digitalTech' ? '−' : '+'}</span>
        </div>
        <div className={`accordion-content ${expandedSection === 'digitalTech' ? 'show' : ''}`}>
          {renderNavButtons(sections.digitalTech)}
        </div>
      </div>

      <div className="accordion">
        <div 
          className={`accordion-header ${expandedSection === 'advancedMath' ? 'expanded' : ''}`}
          onClick={() => toggleSection('advancedMath')}
        >
          <h2>Advanced Mathematics</h2>
          <span className="expand-icon">{expandedSection === 'advancedMath' ? '−' : '+'}</span>
        </div>
        <div className={`accordion-content ${expandedSection === 'advancedMath' ? 'show' : ''}`}>
          {renderNavButtons(sections.advancedMath)}
        </div>
      </div>
    </div>
  );

  // Рендер десктопного вигляду з картками
  const renderDesktopView = () => (
    <div className="desktop-sections">
      <div className="section-card">
        <div className="section-header">
          <h2>Discrete Math</h2>
        </div>
        <div className="section-content">
          {renderNavButtons(sections.discreteMath)}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Digital Technologies</h2>
        </div>
        <div className="section-content">
          {renderNavButtons(sections.digitalTech)}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Advanced Mathematics</h2>
        </div>
        <div className="section-content">
          {renderNavButtons(sections.advancedMath)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mainContainer">
      <div className="welcome-box">
        <h2>Welcome to the Discrete Math Calculator!</h2>
        <p>
          This application provides tools for solving problems in discrete mathematics, 
          including logical transformations, recurrence relations, and more.
          <br />
          Use the options below to access specific calculators.
        </p>
      </div>
      
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default Home;