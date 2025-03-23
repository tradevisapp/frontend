import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CountryData } from '../../types';

const StyledAppBar = styled(AppBar)`
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  height: 64px;
`;

const StyledToolbar = styled(Toolbar)`
  height: 64px;
  min-height: 64px;
`;

const SearchWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.15);
  margin-left: auto;
  width: 100%;
  max-width: 400px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

const StyledInputBase = styled(InputBase)`
  color: inherit;
  width: 100%;
  padding: 8px 8px 8px 0;
  padding-left: 40px;
`;

const SearchIconWrapper = styled.div`
  padding: 0 16px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled(Typography)`
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffffff;
  margin-right: 20px;
`;

interface NavigationProps {
  countries: CountryData[];
  onCountrySearch: (countryId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ countries, onCountrySearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<CountryData[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.length > 1) {
      // Improved search - match start of words and handle case insensitivity
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(value.toLowerCase())
      );
      
      // Sort results - exact matches first, then starts with, then includes
      const sortedResults = [...filtered].sort((a, b) => {
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        const searchLower = value.toLowerCase();
        
        // Exact match gets highest priority
        if (aNameLower === searchLower && bNameLower !== searchLower) return -1;
        if (bNameLower === searchLower && aNameLower !== searchLower) return 1;
        
        // Starts with gets second priority
        if (aNameLower.startsWith(searchLower) && !bNameLower.startsWith(searchLower)) return -1;
        if (bNameLower.startsWith(searchLower) && !aNameLower.startsWith(searchLower)) return 1;
        
        // Alphabetical sorting for the rest
        return a.name.localeCompare(b.name);
      });
      
      setSuggestions(sortedResults);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      setSearchTerm(country.name);
      setSuggestions([]);
      onCountrySearch(countryId);
      
      // Focus back on input after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex].id);
        } else if (suggestions.length > 0) {
          // If no suggestion is selected but there are suggestions, pick the first one
          handleSuggestionClick(suggestions[0].id);
        }
      } else if (e.key === 'Escape') {
        setSuggestions([]);
        inputRef.current?.blur();
      }
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Logo variant="h6">
          TradeVis
        </Logo>
        
        <SearchWrapper>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search countries..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
          />
          
          {suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map((country, index) => (
                <SuggestionItem 
                  key={country.id}
                  onClick={() => handleSuggestionClick(country.id)}
                  isSelected={index === selectedSuggestionIndex}
                >
                  {country.name}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </SearchWrapper>
      </StyledToolbar>
    </StyledAppBar>
  );
};

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #000000;
  border: 1px solid #374151;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

interface SuggestionItemProps {
  isSelected?: boolean;
}

const SuggestionItem = styled.li<SuggestionItemProps>`
  padding: 10px 16px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Navigation; 