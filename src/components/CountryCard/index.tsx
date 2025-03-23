import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, IconButton, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { CountryDetails } from '../../types';
import { formatPercentage } from '../../utils/colorUtils';

const StyledCard = styled(Card)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.95);
  color: white;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const CloseButton = styled(IconButton)`
  color: white;
`;

const Title = styled(Typography)`
  font-weight: 700;
  font-size: 1.5rem;
`;

const SectionTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const MarketsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const MarketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const MarketName = styled(Typography)`
  font-weight: 500;
`;

const MarketValue = styled(Typography)`
  font-family: 'Roboto Mono', monospace;
`;

const PercentageChip = styled(Chip)<{ trend: 'up' | 'down' | 'neutral' }>`
  background-color: ${({ trend }) => 
    trend === 'up' ? 'rgba(16, 185, 129, 0.2)' : 
    trend === 'down' ? 'rgba(239, 68, 68, 0.2)' : 
    'rgba(156, 163, 175, 0.2)'
  };
  color: ${({ trend }) => 
    trend === 'up' ? 'rgb(16, 185, 129)' : 
    trend === 'down' ? 'rgb(239, 68, 68)' : 
    'rgb(156, 163, 175)'
  };
  margin-left: 8px;
  height: 24px;
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NewsItemContainer = styled.div`
  padding: 8px 0;
`;

const NewsTitle = styled(Typography)`
  font-weight: 500;
  margin-bottom: 4px;
`;

const NewsSource = styled(Typography)`
  font-size: 0.85rem;
  color: #9ca3af;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  margin: 16px 0;
`;

interface CountryCardProps {
  countryDetails: CountryDetails;
  onClose: () => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ countryDetails, onClose }) => {
  const { country, markets, news } = countryDetails;

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUpIcon fontSize="small" style={{ color: 'rgb(16, 185, 129)' }} />;
    } else if (change < 0) {
      return <TrendingDownIcon fontSize="small" style={{ color: 'rgb(239, 68, 68)' }} />;
    }
    return undefined;
  };

  const getTrendType = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <StyledCard>
      <CardHeader>
        <Title variant="h5">{country.name}</Title>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </CardHeader>
      
      <CardContent>
        <SectionTitle variant="h6">Market Performance</SectionTitle>
        
        {markets.length > 0 ? (
          <MarketsList>
            {markets.map((market, index) => (
              <React.Fragment key={market.name}>
                <MarketItem>
                  <div>
                    <MarketName variant="body1">{market.name}</MarketName>
                    <Typography variant="body2" color="textSecondary">
                      Volume: {market.volume}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MarketValue variant="body1">
                      {market.value.toLocaleString()}
                    </MarketValue>
                    <PercentageChip
                      size="small"
                      icon={getTrendIcon(market.change)}
                      label={formatPercentage(market.change)}
                      trend={getTrendType(market.change)}
                    />
                  </div>
                </MarketItem>
                {index < markets.length - 1 && <StyledDivider />}
              </React.Fragment>
            ))}
          </MarketsList>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No market data available for this country.
          </Typography>
        )}
        
        <SectionTitle variant="h6">Latest News</SectionTitle>
        
        <NewsList>
          {news.map((item, index) => (
            <React.Fragment key={item.id}>
              <NewsItemContainer>
                <NewsTitle variant="body1">{item.title}</NewsTitle>
                <NewsSource variant="body2">
                  {item.source} • {new Date(item.date).toLocaleDateString()}
                </NewsSource>
              </NewsItemContainer>
              {index < news.length - 1 && <StyledDivider />}
            </React.Fragment>
          ))}
        </NewsList>
      </CardContent>
    </StyledCard>
  );
};

export default CountryCard; 