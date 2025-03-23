import { CountryData, CountryDetails, MarketData, NewsItem } from '../types';
import { getColorFromPerformance } from './colorUtils';

// Generate random performance between -5% and +5%
const getRandomPerformance = (): number => {
  return Math.round((Math.random() * 10 - 5) * 100) / 100;
};

// Major markets with their country codes
export const MAJOR_MARKETS: { [key: string]: string[] } = {
  'USA': ['NYSE', 'NASDAQ', 'S&P 500'],
  'JPN': ['Nikkei 225'],
  'GBR': ['FTSE 100'],
  'DEU': ['DAX'],
  'FRA': ['CAC 40'],
  'CHN': ['Shanghai Composite', 'Hang Seng'],
  'IND': ['BSE SENSEX'],
  'AUS': ['ASX 200'],
  'CAN': ['TSX'],
  'BRA': ['BOVESPA'],
  'KOR': ['KOSPI'],
  'ITA': ['FTSE MIB'],
  'ESP': ['IBEX 35'],
  'MEX': ['IPC'],
  'RUS': ['MOEX'],
  'ZAF': ['JSE'],
  'SGP': ['STI'],
  'MYS': ['KLCI'],
  'IDN': ['IDX Composite'],
  'THA': ['SET'],
  'PHL': ['PSEi'],
  'VNM': ['VN-Index'],
  'ARG': ['MERVAL'],
  'CHL': ['IPSA'],
  'COL': ['COLCAP'],
  'PER': ['S&P/BVL'],
  'TUR': ['BIST 100'],
  'POL': ['WIG20'],
  'HUN': ['BUX'],
  'CZE': ['PX'],
  'SWE': ['OMX Stockholm 30'],
  'NOR': ['Oslo Børs'],
  'DNK': ['OMX Copenhagen 20'],
  'FIN': ['OMX Helsinki 25'],
  'BEL': ['BEL 20'],
  'NLD': ['AEX'],
  'CHE': ['SMI'],
  'AUT': ['ATX'],
  'PRT': ['PSI 20'],
  'GRC': ['ATHEX'],
  'ISR': ['TA-35'],
  'EGY': ['EGX 30'],
  'SAU': ['TASI'],
  'ARE': ['ADX'],
  'QAT': ['QE Index'],
  'KWT': ['Kuwait Main Market'],
  'PAK': ['KSE 100'],
  'BGD': ['DSEX'],
  'NZL': ['NZX 50'],
  'IRL': ['ISEQ Overall'],
  'UKR': ['UX Index'],
  'LUX': ['LuxX Index'],
  'TWN': ['TAIEX'],
  'HKG': ['Hang Seng'],
  'NGA': ['NSE ASI'],
  'KEN': ['NSE 20'],
  'MAR': ['MASI'],
  'JOR': ['ASE Index'],
  'BHR': ['Bahrain All Share'],
  'OMN': ['MSM 30'],
  'LKA': ['CSE All-Share'],
  'ALB': ['ALSI'],
  'ARM': ['AMX'],
  'AZE': ['BSE'],
  'BLR': ['BCSE'],
  'BIH': ['SASX-10'],
  'BGR': ['SOFIX'],
  'HRV': ['CROBEX'],
  'CYP': ['CSE Main'],
  'EST': ['OMX Tallinn'],
  'GEO': ['GSX'],
  'ISL': ['ICEX Main'],
  'KAZ': ['KASE'],
  'LVA': ['OMX Riga'],
  'LTU': ['OMX Vilnius'],
  'MKD': ['MBI10'],
  'MDA': ['MOLDEX'],
  'MNE': ['MONEX'],
  'ROU': ['BET'],
  'SRB': ['BELEX15'],
  'SVK': ['SAX'],
  'SVN': ['SBITOP'],
  'DZA': ['SGBV'],
  'AGO': ['BODIVA'],
  'BWA': ['BSE DCI'],
  'CIV': ['BRVM'],
  'ETH': ['ESX'],
  'GHA': ['GSE'],
  'MUS': ['SEMDEX'],
  'NAM': ['NSX'],
  'NIC': ['BCN'],
  'PAN': ['BVP'],
  'PRY': ['BVPASA'],
  'URY': ['BVM'],
  'VEN': ['BVC'],
  'BLZ': ['BSE'],
  'BOL': ['BBV'],
  'CRI': ['BNV'],
  'DOM': ['BVRD'],
  'ECU': ['BVQ'],
  'SLV': ['BVES'],
  'GTM': ['BVG'],
  'HND': ['BVC'],
  'JAM': ['JSE'],
  'TTO': ['TTSE'],
  'IRN': ['TSE'],
  'IRQ': ['ISX'],
  'LBN': ['BSE'],
  'LBY': ['LSM'],
  'PSE': ['PEX'],
  'SYR': ['DSE'],
  'TUN': ['BVMT']
};

// Mock country data
export const generateMockCountries = (): CountryData[] => {
  const countries = [
    { id: '1', name: 'United States', code: 'USA' },
    { id: '2', name: 'Japan', code: 'JPN' },
    { id: '3', name: 'United Kingdom', code: 'GBR' },
    { id: '4', name: 'Germany', code: 'DEU' },
    { id: '5', name: 'France', code: 'FRA' },
    { id: '6', name: 'China', code: 'CHN' },
    { id: '7', name: 'India', code: 'IND' },
    { id: '8', name: 'Australia', code: 'AUS' },
    { id: '9', name: 'Canada', code: 'CAN' },
    { id: '10', name: 'Brazil', code: 'BRA' },
    { id: '11', name: 'South Korea', code: 'KOR' },
    { id: '12', name: 'Italy', code: 'ITA' },
    { id: '13', name: 'Spain', code: 'ESP' },
    { id: '14', name: 'Mexico', code: 'MEX' },
    { id: '15', name: 'Russia', code: 'RUS' },
    { id: '16', name: 'South Africa', code: 'ZAF' },
    { id: '17', name: 'Singapore', code: 'SGP' },
    { id: '18', name: 'Malaysia', code: 'MYS' },
    { id: '19', name: 'Indonesia', code: 'IDN' },
    { id: '20', name: 'Thailand', code: 'THA' },
    { id: '21', name: 'Philippines', code: 'PHL' },
    { id: '22', name: 'Vietnam', code: 'VNM' },
    { id: '23', name: 'Argentina', code: 'ARG' },
    { id: '24', name: 'Chile', code: 'CHL' },
    { id: '25', name: 'Colombia', code: 'COL' },
    { id: '26', name: 'Peru', code: 'PER' },
    { id: '27', name: 'Turkey', code: 'TUR' },
    { id: '28', name: 'Poland', code: 'POL' },
    { id: '29', name: 'Hungary', code: 'HUN' },
    { id: '30', name: 'Czech Republic', code: 'CZE' },
    { id: '31', name: 'Sweden', code: 'SWE' },
    { id: '32', name: 'Norway', code: 'NOR' },
    { id: '33', name: 'Denmark', code: 'DNK' },
    { id: '34', name: 'Finland', code: 'FIN' },
    { id: '35', name: 'Belgium', code: 'BEL' },
    { id: '36', name: 'Netherlands', code: 'NLD' },
    { id: '37', name: 'Switzerland', code: 'CHE' },
    { id: '38', name: 'Austria', code: 'AUT' },
    { id: '39', name: 'Portugal', code: 'PRT' },
    { id: '40', name: 'Greece', code: 'GRC' },
    { id: '41', name: 'Israel', code: 'ISR' },
    { id: '42', name: 'Egypt', code: 'EGY' },
    { id: '43', name: 'Saudi Arabia', code: 'SAU' },
    { id: '44', name: 'United Arab Emirates', code: 'ARE' },
    { id: '45', name: 'Qatar', code: 'QAT' },
    { id: '46', name: 'Kuwait', code: 'KWT' },
    { id: '47', name: 'Pakistan', code: 'PAK' },
    { id: '48', name: 'Bangladesh', code: 'BGD' },
    { id: '49', name: 'New Zealand', code: 'NZL' },
    { id: '50', name: 'Ireland', code: 'IRL' },
    { id: '51', name: 'Ukraine', code: 'UKR' },
    { id: '52', name: 'Luxembourg', code: 'LUX' },
    { id: '53', name: 'Taiwan', code: 'TWN' },
    { id: '54', name: 'Hong Kong', code: 'HKG' },
    { id: '55', name: 'Nigeria', code: 'NGA' },
    { id: '56', name: 'Kenya', code: 'KEN' },
    { id: '57', name: 'Morocco', code: 'MAR' },
    { id: '58', name: 'Jordan', code: 'JOR' },
    { id: '59', name: 'Bahrain', code: 'BHR' },
    { id: '60', name: 'Oman', code: 'OMN' },
    { id: '61', name: 'Sri Lanka', code: 'LKA' },
    { id: '62', name: 'Albania', code: 'ALB' },
    { id: '63', name: 'Armenia', code: 'ARM' },
    { id: '64', name: 'Azerbaijan', code: 'AZE' },
    { id: '65', name: 'Belarus', code: 'BLR' },
    { id: '66', name: 'Bosnia and Herzegovina', code: 'BIH' },
    { id: '67', name: 'Bulgaria', code: 'BGR' },
    { id: '68', name: 'Croatia', code: 'HRV' },
    { id: '69', name: 'Cyprus', code: 'CYP' },
    { id: '70', name: 'Estonia', code: 'EST' },
    { id: '71', name: 'Georgia', code: 'GEO' },
    { id: '72', name: 'Iceland', code: 'ISL' },
    { id: '73', name: 'Kazakhstan', code: 'KAZ' },
    { id: '74', name: 'Latvia', code: 'LVA' },
    { id: '75', name: 'Lithuania', code: 'LTU' },
    { id: '76', name: 'North Macedonia', code: 'MKD' },
    { id: '77', name: 'Moldova', code: 'MDA' },
    { id: '78', name: 'Montenegro', code: 'MNE' },
    { id: '79', name: 'Romania', code: 'ROU' },
    { id: '80', name: 'Serbia', code: 'SRB' },
    { id: '81', name: 'Slovakia', code: 'SVK' },
    { id: '82', name: 'Slovenia', code: 'SVN' },
    { id: '83', name: 'Algeria', code: 'DZA' },
    { id: '84', name: 'Angola', code: 'AGO' },
    { id: '85', name: 'Botswana', code: 'BWA' },
    { id: '86', name: 'Ivory Coast', code: 'CIV' },
    { id: '87', name: 'Ethiopia', code: 'ETH' },
    { id: '88', name: 'Ghana', code: 'GHA' },
    { id: '89', name: 'Mauritius', code: 'MUS' },
    { id: '90', name: 'Namibia', code: 'NAM' },
    { id: '91', name: 'Nicaragua', code: 'NIC' },
    { id: '92', name: 'Panama', code: 'PAN' },
    { id: '93', name: 'Paraguay', code: 'PRY' },
    { id: '94', name: 'Uruguay', code: 'URY' },
    { id: '95', name: 'Venezuela', code: 'VEN' },
    { id: '96', name: 'Belize', code: 'BLZ' },
    { id: '97', name: 'Bolivia', code: 'BOL' },
    { id: '98', name: 'Costa Rica', code: 'CRI' },
    { id: '99', name: 'Dominican Republic', code: 'DOM' },
    { id: '100', name: 'Ecuador', code: 'ECU' },
    { id: '101', name: 'El Salvador', code: 'SLV' },
    { id: '102', name: 'Guatemala', code: 'GTM' },
    { id: '103', name: 'Honduras', code: 'HND' },
    { id: '104', name: 'Jamaica', code: 'JAM' },
    { id: '105', name: 'Trinidad and Tobago', code: 'TTO' },
    { id: '106', name: 'Iran', code: 'IRN' },
    { id: '107', name: 'Iraq', code: 'IRQ' },
    { id: '108', name: 'Lebanon', code: 'LBN' },
    { id: '109', name: 'Libya', code: 'LBY' },
    { id: '110', name: 'Palestine', code: 'PSE' },
    { id: '111', name: 'Syria', code: 'SYR' },
    { id: '112', name: 'Tunisia', code: 'TUN' }
  ];

  return countries.map(country => {
    const performance = getRandomPerformance();
    return {
      ...country,
      marketPerformance: performance,
      color: getColorFromPerformance(performance)
    };
  });
};

// Generate mock market data for a specific country
export const generateMockMarketData = (countryCode: string): MarketData[] => {
  const markets = MAJOR_MARKETS[countryCode] || [];
  
  return markets.map(marketName => {
    const value = Math.floor(Math.random() * 30000) + 1000;
    const change = getRandomPerformance();
    const volume = `${Math.floor(Math.random() * 900) + 100}M`;
    
    return {
      name: marketName,
      value,
      change,
      volume
    };
  });
};

// Generate mock news for a country
export const generateMockNews = (countryName: string): NewsItem[] => {
  const news = [
    {
      id: '1',
      title: `${countryName}'s Economy Shows Signs of Recovery`,
      source: 'Financial Times',
      url: '#',
      date: '2023-03-22'
    },
    {
      id: '2',
      title: `Inflation Concerns Rise in ${countryName}`,
      source: 'Bloomberg',
      url: '#',
      date: '2023-03-21'
    },
    {
      id: '3',
      title: `${countryName}'s Market Volatility Increases`,
      source: 'Reuters',
      url: '#',
      date: '2023-03-20'
    }
  ];
  
  return news;
};

// Get complete country details with markets and news
export const getCountryDetails = (countryData: CountryData): CountryDetails => {
  return {
    country: countryData,
    markets: generateMockMarketData(countryData.code),
    news: generateMockNews(countryData.name)
  };
}; 