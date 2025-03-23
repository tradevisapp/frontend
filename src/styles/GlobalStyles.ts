import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --background-color: #000000;
    --text-color: #f3f4f6;
    --primary-color: #3b82f6;
    --secondary-color: #4b5563;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --border-color: #374151;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: fixed;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  #root {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .App {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  .globe-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
    height: calc(100% - 64px); /* Subtract the height of the navigation bar */
  }

  .globe-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .controls {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .country-hover {
    position: absolute;
    background-color: rgba(30, 41, 59, 0.9);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    pointer-events: none;
    z-index: 100;
    color: white;
    max-width: 200px;
  }
`;

export default GlobalStyles; 