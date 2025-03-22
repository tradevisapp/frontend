import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

// Define the props for the component
interface GlobeProps {
  onCountrySelect: (country: any) => void;
}

// Globe container styling
const GlobeCanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #121212;
`;

// Mock data for country colors (will be replaced with real API data)
const mockCountryData = {
  US: { color: '#4CAF50', change: 1.2 }, // Green for up
  CN: { color: '#F44336', change: -0.8 }, // Red for down
  JP: { color: '#4CAF50', change: 0.5 },
  UK: { color: '#F44336', change: -0.3 },
  DE: { color: '#4CAF50', change: 0.7 },
  FR: { color: '#F44336', change: -0.2 },
  IN: { color: '#4CAF50', change: 1.5 },
  BR: { color: '#BDBDBD', change: 0 }, // Grey for no data
  RU: { color: '#BDBDBD', change: 0 },
  AU: { color: '#4CAF50', change: 0.3 },
};

// Earth mesh component that will be rendered inside the Canvas
const Earth = ({ onCountrySelect }: GlobeProps) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { camera } = useThree();

  // Initialize camera position
  useEffect(() => {
    camera.position.z = 200;
  }, [camera]);

  // Load textures
  const [colorMap, normalMap, specularMap] = useTexture([
    '/earth_daymap.jpg',     // Base color texture
    '/earth_normal_map.jpg', // Normal map for topography
    '/earth_specular_map.jpg', // Specular map for oceans
  ]);

  // Rotation animation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005; // Slow automatic rotation
    }
  });

  // Handle country hover and select
  const handleCountryHover = (countryCode: string) => {
    setHovered(countryCode);
    document.body.style.cursor = 'pointer';
  };

  const handleCountryClick = (countryCode: string) => {
    const mockCountry = {
      id: countryCode,
      name: getCountryName(countryCode),
      stockIndex: getStockIndexName(countryCode),
      change: mockCountryData[countryCode as keyof typeof mockCountryData]?.change || 0,
      news: [
        "Market shows strong recovery after recent slump",
        "Tech sector leads gains in today's trading session",
        "Analysts predict continued growth in the coming quarter"
      ]
    };
    
    onCountrySelect(mockCountry);
  };

  // Helper functions to get country information
  const getCountryName = (code: string): string => {
    const countries: Record<string, string> = {
      US: 'United States',
      CN: 'China',
      JP: 'Japan',
      UK: 'United Kingdom',
      DE: 'Germany',
      FR: 'France',
      IN: 'India',
      BR: 'Brazil',
      RU: 'Russia',
      AU: 'Australia',
    };
    return countries[code] || code;
  };

  const getStockIndexName = (code: string): string => {
    const indices: Record<string, string> = {
      US: 'S&P 500',
      CN: 'Shanghai Composite',
      JP: 'Nikkei 225',
      UK: 'FTSE 100',
      DE: 'DAX',
      FR: 'CAC 40',
      IN: 'BSE Sensex',
      BR: 'Bovespa',
      RU: 'MOEX',
      AU: 'ASX 200',
    };
    return indices[code] || '';
  };

  return (
    <mesh 
      ref={earthRef} 
      onPointerOver={(e) => handleCountryHover('US')} // Simplified for mock
      onPointerOut={() => { 
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={() => handleCountryClick('US')} // Simplified for mock
    >
      <sphereGeometry args={[100, 64, 64]} />
      <meshPhongMaterial 
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        shininess={5}
      />
    </mesh>
  );
};

// Main Globe component that wraps the Canvas and Earth
const Globe: React.FC<GlobeProps> = ({ onCountrySelect }) => {
  return (
    <GlobeCanvasContainer>
      <Canvas>
        <ambientLight intensity={0.3} />
        <directionalLight position={[1, 0, 0.5]} intensity={1} />
        <Earth onCountrySelect={onCountrySelect} />
        <OrbitControls 
          enablePan={false}
          minDistance={120}
          maxDistance={300}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          // Set minimum and maximum polar angle to prevent spinning to Antarctica
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>
    </GlobeCanvasContainer>
  );
};

export default Globe; 