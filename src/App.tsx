import React, { useState, useEffect } from 'react';
import './App.css';
import WorldMap from './components/Map/WorldMap';
import CountryCard from './components/CountryCard/CountryCard';
import Navbar from './components/Navbar/Navbar';
import { fetchAllCountries, fetchCountryDetail } from './services/api';
import { Country, CountryDetail } from './types';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [preserveMapTransform, setPreserveMapTransform] = useState<boolean>(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to load country data. Please try again later.');
        console.error('Error loading countries:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleCountryClick = async (countryId: string) => {
    try {
      setLoading(true);
      const countryDetail = await fetchCountryDetail(countryId);
      setSelectedCountry(countryDetail);
      setPreserveMapTransform(false);
    } catch (err) {
      setError(`Failed to load details for ${countryId}. Please try again.`);
      console.error('Error loading country details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const closeCountryCard = () => {
    setPreserveMapTransform(true);
    setSelectedCountry(null);
  };

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />
      
      <main className="main-content">
        {loading && <div className="loading-indicator">Loading...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        <WorldMap 
          countries={countries} 
          onCountryClick={handleCountryClick}
          searchQuery={searchQuery}
          preserveTransform={preserveMapTransform}
        />
        
        {selectedCountry && (
          <CountryCard 
            country={selectedCountry}
            onClose={closeCountryCard}
          />
        )}
      </main>
    </div>
  );
};

export default App;
