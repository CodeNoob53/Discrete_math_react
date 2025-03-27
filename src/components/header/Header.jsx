import React,{ useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import "./Header.css";
import ThemeToggle from "../ThemeToggle"; // Імпортуємо існуючий компонент ThemeToggle
import { Link } from "react-router-dom"; // Імпортуємо Link для правильної навігації

const Header = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="header-container">

                <div className="left-section">
                    <Tippy content="Головна">
                        {/* Використовуємо Link замість <a> для SPA навігації */}
                        <Link to="/" className="logo-link">
                            <span className="logo-text">ƒx</span>
                        </Link>
                    </Tippy>

                    <div className="divider" />

                    <div
                        className={`title-container ${isHovered ? "hovered" : "default"}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <h1 className={`main-title ${isHovered ? "hovered" : ""}`}>DISCRETE MATH</h1>
                        <p className={`subtitle ${isHovered ? "hovered" : ""}`}>CALC EVERYTHING</p>
                    </div>
                </div>

                {/* Використовуємо існуючий компонент ThemeToggle */}
                <ThemeToggle />

        </div>
    );
};

export default Header;