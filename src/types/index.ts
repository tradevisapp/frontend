export interface Country {
  id: string;
  name: string;
  stockMarketChange?: number; // Percentage change, optional as some countries may not have data
}

export interface StockMarketData {
  marketName: string;
  change: number;
  currentValue: number;
  previousClose: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
}

export interface CountryDetail {
  id: string;
  name: string;
  stockMarkets: StockMarketData[];
  news: NewsItem[];
} 