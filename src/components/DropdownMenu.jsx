import React, { useState } from "react";

const DropdownMenu = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Оберіть операцію");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        setIsOpen(false);
        onSelect(option.value); // Передаємо значення операції в батьківський компонент
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <span>{selectedOption}</span>
                <svg
                    className={`dropdown-icon ${isOpen ? "active" : ""}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>
            {isOpen && (
                <div className="dropdown-list">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
