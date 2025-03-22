import axios from 'axios';

// Define types for API responses
export interface MarketData {
  countryCode: string;
  stockIndex: string;
  currentValue: number;
  change: number;
  percentChange: number;
}

export interface CountryInfo {
  id: string;
  name: string;
  stockIndex: string;
  change: number;
  news: string[];
}

// API base URL - would be configured via environment variables in production
const API_BASE_URL = 'http://localhost:3001/api';

// Get market data for all countries
export const getGlobalMarketData = async (): Promise<MarketData[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(`${API_BASE_URL}/markets/global`);
    // return response.data;
    
    // For now, return mock data
    return mockGlobalMarketData;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    return [];
  }
};

// Get detailed information for a specific country
export const getCountryInfo = async (countryCode: string): Promise<CountryInfo | null> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(`${API_BASE_URL}/countries/${countryCode}`);
    // return response.data;
    
    // For now, return mock data
    const mockData = mockCountryInfo[countryCode as keyof typeof mockCountryInfo];
    return mockData || null;
  } catch (error) {
    console.error(`Error fetching data for country ${countryCode}:`, error);
    return null;
  }
};

// Get news for a specific country
export const getCountryNews = async (countryCode: string): Promise<string[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(`${API_BASE_URL}/news/${countryCode}`);
    // return response.data;
    
    // For now, return mock data
    return mockNews[countryCode as keyof typeof mockNews] || [];
  } catch (error) {
    console.error(`Error fetching news for country ${countryCode}:`, error);
    return [];
  }
};

// Mock data
const mockGlobalMarketData: MarketData[] = [
  { countryCode: 'US', stockIndex: 'S&P 500', currentValue: 4200.25, change: 52.45, percentChange: 1.2 },
  { countryCode: 'CN', stockIndex: 'Shanghai Composite', currentValue: 3250.80, change: -28.50, percentChange: -0.8 },
  { countryCode: 'JP', stockIndex: 'Nikkei 225', currentValue: 28750.40, change: 145.30, percentChange: 0.5 },
  { countryCode: 'UK', stockIndex: 'FTSE 100', currentValue: 7345.25, change: -22.05, percentChange: -0.3 },
  { countryCode: 'DE', stockIndex: 'DAX', currentValue: 15280.75, change: 108.50, percentChange: 0.7 },
  { countryCode: 'FR', stockIndex: 'CAC 40', currentValue: 6580.60, change: -12.30, percentChange: -0.2 },
  { countryCode: 'IN', stockIndex: 'BSE Sensex', currentValue: 58200.30, change: 895.45, percentChange: 1.5 },
  { countryCode: 'AU', stockIndex: 'ASX 200', currentValue: 7120.15, change: 21.35, percentChange: 0.3 }
];

const mockCountryInfo: Record<string, CountryInfo> = {
  'US': {
    id: 'US',
    name: 'United States',
    stockIndex: 'S&P 500',
    change: 1.2,
    news: [
      "Fed signals potential rate cut as inflation eases",
      "Tech sector leads market rally with strong quarterly earnings",
      "Consumer confidence reaches highest level since pre-pandemic"
    ]
  },
  'CN': {
    id: 'CN',
    name: 'China',
    stockIndex: 'Shanghai Composite',
    change: -0.8,
    news: [
      "Property sector concerns weigh on Chinese markets",
      "Government announces new stimulus measures for economy",
      "Manufacturing activity shows signs of recovery"
    ]
  },
  'JP': {
    id: 'JP',
    name: 'Japan',
    stockIndex: 'Nikkei 225',
    change: 0.5,
    news: [
      "Bank of Japan maintains ultra-loose monetary policy",
      "Export growth boosts Japanese economy",
      "Technology stocks gain on global semiconductor demand"
    ]
  }
};

const mockNews: Record<string, string[]> = {
  'US': [
    "Fed signals potential rate cut as inflation eases",
    "Tech sector leads market rally with strong quarterly earnings",
    "Consumer confidence reaches highest level since pre-pandemic",
    "Major infrastructure bill expected to boost construction sector",
    "Retail sales exceed expectations for third consecutive month"
  ],
  'CN': [
    "Property sector concerns weigh on Chinese markets",
    "Government announces new stimulus measures for economy",
    "Manufacturing activity shows signs of recovery",
    "E-commerce giants report record sales during holiday season",
    "Central bank adjusts reserve requirements to support growth"
  ],
  'JP': [
    "Bank of Japan maintains ultra-loose monetary policy",
    "Export growth boosts Japanese economy",
    "Technology stocks gain on global semiconductor demand",
    "Yen weakens against dollar, supporting export-oriented companies",
    "Corporate earnings exceed analyst expectations"
  ]
}; 