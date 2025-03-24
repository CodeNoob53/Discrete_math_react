import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import "./FlashMessage.css";

const FlashMessage = ({ 
  message, 
  clearMessage, 
  type = "error", 
  duration = 5000,
  show = true 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Коли повідомлення з'являється, показуємо його
    if (message && show) {
      // Невелика затримка для кращої анімації
      setTimeout(() => {
        setVisible(true);
      }, 50);
      
      // Автоматичне приховання повідомлення
      const timer = setTimeout(() => {
        setVisible(false);
        
        // Затримка для завершення анімації перед повним видаленням
        setTimeout(() => {
          clearMessage(); 
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, clearMessage, duration, show]);

  // Ручне закриття повідомлення
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      clearMessage();
    }, 300);
  };

  if (!message || !show) return null;

  // Визначення іконки відповідно до типу повідомлення
  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle size={20} />;
      case "success":
        return <CheckCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`flash-message ${type} ${visible ? 'show' : 'hide'}`} role="alert">
      <div className="flash-message-content">
        <div className="flash-message-icon">
          {getIcon()}
        </div>
        <p>{message}</p>
      </div>
      <button 
        className="flash-message-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

FlashMessage.propTypes = {
  message: PropTypes.string,
  clearMessage: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["error", "success", "warning", "info"]),
  duration: PropTypes.number,
  show: PropTypes.bool
};

export default FlashMessage;