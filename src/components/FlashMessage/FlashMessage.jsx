import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./FlashMessage.css";

const FlashMessage = ({ 
  message, 
  clearMessage, 
  type = "error", 
  duration = 3000,
  show = true 
}) => {
  useEffect(() => {
    if (message && show) {
      const timer = setTimeout(() => {
        clearMessage(); // Виклик функції очищення
      }, duration);

      return () => clearTimeout(timer); // Очистка таймера при демонтуванні
    }
  }, [message, clearMessage, duration, show]);

  if (!message || !show) return null;

  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
    </div>
  );
};

FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
  clearMessage: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["error", "success", "warning", "info"]),
  duration: PropTypes.number,
  show: PropTypes.bool
};

export default FlashMessage;