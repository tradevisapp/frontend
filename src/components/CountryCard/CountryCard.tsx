import React from 'react';
import { CountryDetail } from '../../types';
import './CountryCard.css';

interface CountryCardProps {
  country: CountryDetail;
  onClose: () => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onClose }) => {
  return (
    <div className="country-card-overlay">
      <div className="country-card">
        <div className="country-card-header">
          <h2>{country.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="country-card-content">
          <div className="stock-markets-section">
            <h3>Stock Markets</h3>
            <div className="stock-markets-grid">
              {country.stockMarkets.map((market) => (
                <div 
                  key={market.marketName} 
                  className={`market-card ${market.change >= 0 ? 'positive' : 'negative'}`}
                >
                  <div className="market-name">{market.marketName}</div>
                  <div className="market-value">{market.currentValue.toFixed(2)}</div>
                  <div className="market-change">
                    {market.change > 0 ? '+' : ''}{market.change.toFixed(2)}%
                  </div>
                  <div className="market-prev">
                    Previous: {market.previousClose.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="news-section">
            <h3>Financial News</h3>
            <div className="news-list">
              {country.news.map((newsItem) => (
                <div key={newsItem.id} className="news-item">
                  <h4>{newsItem.title}</h4>
                  <div className="news-meta">
                    <span className="news-source">{newsItem.source}</span>
                    <span className="news-date">{new Date(newsItem.date).toLocaleDateString()}</span>
                  </div>
                  <p className="news-summary">{newsItem.summary}</p>
                  {newsItem.url && (
                    <a 
                      href={newsItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="read-more"
                    >
                      Read more
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCard; 