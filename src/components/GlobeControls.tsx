import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 5;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(50, 50, 50, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(80, 80, 80, 0.9);
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
  }
`;

const GlobeControls: React.FC = () => {
  // These functions would interact with the globe component via context or props
  const handleZoomIn = () => {
    // Will implement zoom functionality
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Will implement zoom functionality
    console.log('Zoom out');
  };

  const handleReset = () => {
    // Will implement reset functionality
    console.log('Reset view');
  };

  return (
    <ControlsContainer>
      <ControlButton onClick={handleZoomIn}>+</ControlButton>
      <ControlButton onClick={handleZoomOut}>-</ControlButton>
      <ControlButton onClick={handleReset}>↺</ControlButton>
    </ControlsContainer>
  );
};

export default GlobeControls; 