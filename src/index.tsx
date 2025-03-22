import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './initialLoading.css';

// Add a simple loading indicator to the HTML before React mounts
const appRoot = document.getElementById('root');
const loadingElement = document.createElement('div');
loadingElement.className = 'initial-loading';
loadingElement.innerHTML = `
  <div class="initial-loading-bar">
    <div class="initial-loading-progress"></div>
  </div>
`;
appRoot?.appendChild(loadingElement);

// Render the app after a small delay to ensure the loading bar is visible
setTimeout(() => {
  const root = ReactDOM.createRoot(appRoot as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Remove the initial loading element after React has mounted
  setTimeout(() => {
    loadingElement.classList.add('fade-out');
    setTimeout(() => {
      loadingElement.remove();
    }, 500);
  }, 500);
}, 500);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
