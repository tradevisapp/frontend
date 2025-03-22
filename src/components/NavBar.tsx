import React, { useState } from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  background-color: #1a1a1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 40%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4a90e2;
  }
`;

const NavBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log('Searching for:', searchQuery);
  };

  return (
    <NavContainer>
      <Logo>TradeVis</Logo>
      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search for a country or stock market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </SearchContainer>
    </NavContainer>
  );
};

export default NavBar; 