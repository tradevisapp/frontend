import React, { useState, useEffect, useRef } from 'react';
import Globe, { GlobeRef } from './components/Globe';
import Navigation from './components/Navigation';
import CountryCard from './components/CountryCard';
import GlobalStyles from './styles/GlobalStyles';
import { CountryData, CountryDetails } from './types';
import { generateMockCountries, getCountryDetails } from './utils/mockData';

const App: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetails | null>(null);
  const globeRef = useRef<GlobeRef>(null);

  // Load mock country data
  useEffect(() => {
    const mockCountries = generateMockCountries();
    setCountries(mockCountries);
  }, []);

  const handleCountryClick = (country: CountryData) => {
    const details = getCountryDetails(country);
    setSelectedCountry(details);
  };

  const handleCountrySearch = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (!country) {
      console.error(`Country not found for id: ${countryId}`);
      return;
    }
    
    console.log(`Search selected country: ${country.name} (${country.code})`);
    
    if (globeRef.current) {
      // First zoom to the country on the globe
      globeRef.current.zoomToCountry(country);
      // The globe component will trigger onCountryClick after zooming
    } else {
      console.error("Globe reference not available");
      // If globe ref isn't available, just show the country details directly
      const details = getCountryDetails(country);
      setSelectedCountry(details);
    }
  };

  const handleCloseCountryCard = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="App">
      <GlobalStyles />
      <Navigation countries={countries} onCountrySearch={handleCountrySearch} />
      <div className="globe-wrapper">
        <Globe 
          ref={globeRef}
          countries={countries} 
          onCountryClick={handleCountryClick} 
        />
        {selectedCountry && (
          <CountryCard 
            countryDetails={selectedCountry} 
            onClose={handleCloseCountryCard} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
