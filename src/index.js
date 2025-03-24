import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import { MathJaxContext } from 'better-react-mathjax';

const config = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
    },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MathJaxContext version={3} config={config}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </MathJaxContext>
  </React.StrictMode>
);

reportWebVitals();