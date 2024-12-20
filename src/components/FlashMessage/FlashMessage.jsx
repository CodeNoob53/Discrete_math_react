import React, { useEffect } from "react";
import "./FlashMessageStl.css";

const FlashMessage = ({ message, clearMessage }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage(); // Виклик функції очищення
      }, 3000);

      return () => clearTimeout(timer); // Очистка таймера при демонтуванні
    }
  }, [message, clearMessage]);

  return message ? (
    <div className="flashMessage">
      <p>{message}</p>
    </div>
  ) : null;
};

export default FlashMessage;
