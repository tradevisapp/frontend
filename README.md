# TradeVis - Global Stock Market Visualization

TradeVis is a React TypeScript application that visualizes global stock market performance using an interactive 3D globe.

## Features

- Interactive 3D globe visualization of global stock markets
- Country-level color coding based on market performance (green for rising, red for falling)
- Hover effects to display country names and performance data
- Click interactions to view detailed country market information
- Smooth zoom, rotation, and reset view controls
- Search functionality to quickly locate countries

## Technologies Used

- React
- TypeScript
- Three.js (via react-globe.gl)
- Styled Components
- Material UI

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tradevis.git
cd tradevis/frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to http://localhost:3000

## Project Structure

- `src/components/Globe`: 3D globe visualization component
- `src/components/CountryCard`: Detailed country information card
- `src/components/Navigation`: Top navigation bar with search functionality
- `src/types`: TypeScript interfaces
- `src/utils`: Utility functions and mock data
- `src/styles`: Global styles

## Current Status

This version uses mock data to simulate stock market performance. A backend API will be developed in the future to provide real-time market data.

## License

MIT
