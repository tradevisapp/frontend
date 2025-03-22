import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from './components/NavBar';
import GlobePage from './pages/GlobePage';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #121212;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <NavBar />
        <Routes>
          <Route path="/" element={<GlobePage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App; 