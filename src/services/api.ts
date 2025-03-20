import axios from 'axios';
import { Country, CountryDetail } from '../types';

// Connect to the backend API
const baseURL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
});

export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    const { data } = await api.get<Country[]>('/countries');
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    // Fallback to mock data if the API is not available
    return [
      { id: 'USA', name: 'United States', stockMarketChange: 1.2 },
      { id: 'JPN', name: 'Japan', stockMarketChange: -0.8 },
      { id: 'GBR', name: 'United Kingdom', stockMarketChange: 0.5 },
      { id: 'DEU', name: 'Germany', stockMarketChange: -0.3 },
      { id: 'FRA', name: 'France', stockMarketChange: 0.7 },
      { id: 'CHN', name: 'China', stockMarketChange: -1.5 },
      { id: 'IND', name: 'India', stockMarketChange: 2.1 },
      { id: 'BRA', name: 'Brazil', stockMarketChange: -0.9 },
      { id: 'CAN', name: 'Canada', stockMarketChange: 0.4 },
      { id: 'AUS', name: 'Australia', stockMarketChange: 1.0 },
    ];
  }
};

export const fetchCountryDetail = async (countryId: string): Promise<CountryDetail> => {
  try {
    const { data } = await api.get<CountryDetail>(`/countries/${countryId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching details for country ${countryId}:`, error);
    
    // Fallback to mock data if the API is not available
    return {
      id: countryId,
      name: getMockCountryName(countryId),
      stockMarkets: [
        { marketName: 'Primary Index', change: getRandomChange(), currentValue: 15000 + Math.random() * 3000, previousClose: 15000 + Math.random() * 3000 },
        { marketName: 'Secondary Index', change: getRandomChange(), currentValue: 5000 + Math.random() * 1000, previousClose: 5000 + Math.random() * 1000 },
      ],
      news: [
        { id: '1', title: `Economic outlook improving in ${getMockCountryName(countryId)}`, source: 'Financial Times', url: '#', date: new Date().toISOString(), summary: 'Positive economic indicators suggest recovery is underway.' },
        { id: '2', title: `${getMockCountryName(countryId)} stock market shows resilience`, source: 'Bloomberg', url: '#', date: new Date().toISOString(), summary: 'Despite global headwinds, local markets remain stable.' },
        { id: '3', title: `${getMockCountryName(countryId)} central bank maintains rates`, source: 'Reuters', url: '#', date: new Date().toISOString(), summary: 'Policy decision aims to balance growth and inflation concerns.' },
      ]
    };
  }
};

// Helper functions for mock data
function getMockCountryName(id: string): string {
  const countries: Record<string, string> = {
    'USA': 'United States',
    'JPN': 'Japan',
    'GBR': 'United Kingdom',
    'DEU': 'Germany',
    'FRA': 'France',
    'CHN': 'China',
    'IND': 'India',
    'BRA': 'Brazil',
    'CAN': 'Canada',
    'AUS': 'Australia'
  };
  
  return countries[id] || id;
}

function getRandomChange(): number {
  return parseFloat((Math.random() * 6 - 3).toFixed(2));
} 