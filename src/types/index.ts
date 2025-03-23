export interface CountryData {
  id: string;
  name: string;
  code: string;
  marketPerformance: number | null;  // percentage change, null if no data
  color: string;  // color based on market performance
}

export interface MarketData {
  name: string;
  value: number;
  change: number;
  volume: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
}

export interface CountryDetails {
  country: CountryData;
  markets: MarketData[];
  news: NewsItem[];
} 