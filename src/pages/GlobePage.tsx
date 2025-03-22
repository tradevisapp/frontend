import React, { useState } from 'react';
import styled from 'styled-components';
import Globe from '../components/Globe';
import GlobeControls from '../components/GlobeControls';
import CountryCard from '../components/CountryCard';

const GlobePageContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const GlobeContainer = styled.div`
  flex: 1;
  position: relative;
`;

interface CountryData {
  id: string;
  name: string;
  stockIndex: string;
  change: number;
  news: string[];
}

const GlobePage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
  };

  const handleCloseCountryCard = () => {
    setSelectedCountry(null);
  };

  return (
    <GlobePageContainer>
      <GlobeContainer>
        <Globe onCountrySelect={handleCountrySelect} />
        <GlobeControls />
      </GlobeContainer>
      
      {selectedCountry && (
        <CountryCard 
          country={selectedCountry} 
          onClose={handleCloseCountryCard} 
        />
      )}
    </GlobePageContainer>
  );
};

export default GlobePage; 