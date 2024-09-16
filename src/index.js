import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './Components/JS/Main.js'
import './Components/JS/New.js'
import './Components/JS/index.js'
import './Components/JS/scripts_V1.js'
import './Components/JS/site.js'
import './Components/JS/state.js'
import './Components/JS/3D_Model.js'

import App from './App';
import reportWebVitals from './reportWebVitals';
import { isCompositeComponent } from 'react-dom/test-utils';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
