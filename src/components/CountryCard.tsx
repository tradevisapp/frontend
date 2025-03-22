import React from 'react';
import styled from 'styled-components';

// Define the props for the component
interface CountryCardProps {
  country: {
    id: string;
    name: string;
    stockIndex: string;
    change: number;
    news: string[];
  };
  onClose: () => void;
}

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: white;
  z-index: 100;
  overflow: hidden;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CardHeader = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const StockInfo = styled.div`
  margin-bottom: 20px;
`;

const IndexName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ChangeIndicator = styled.div<{ isPositive: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  background-color: ${props => props.isPositive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.isPositive ? '#4CAF50' : '#F44336'};
`;

const NewsSection = styled.div`
  margin-top: 20px;
`;

const NewsHeading = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 500;
`;

const NewsList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const NewsItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.4;
`;

const CountryCard: React.FC<CountryCardProps> = ({ country, onClose }) => {
  const { name, stockIndex, change, news } = country;
  const isPositive = change >= 0;
  
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </CardHeader>
      <CardContent>
        <StockInfo>
          <IndexName>{stockIndex}</IndexName>
          <ChangeIndicator isPositive={isPositive}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </ChangeIndicator>
        </StockInfo>
        
        <NewsSection>
          <NewsHeading>Latest Financial News</NewsHeading>
          <NewsList>
            {news.map((item, index) => (
              <NewsItem key={index}>{item}</NewsItem>
            ))}
          </NewsList>
        </NewsSection>
      </CardContent>
    </CardContainer>
  );
};

export default CountryCard; 