# TradeVis - Interactive 3D Globe for Stock Market Visualization

TradeVis is a web application that visualizes global stock market performance on an interactive 3D globe. Countries are color-coded based on their stock market performance, allowing users to quickly identify market trends worldwide.

## Features

- **Interactive 3D Globe**: A fully interactive globe that users can rotate, zoom in/out, and interact with
- **Real-time Market Data**: Color-coded countries reflecting current stock market performance
- **Country Information**: Detailed information about each country's stock market, including performance metrics and financial news
- **Search Functionality**: Easy search for countries or stock markets
- **Responsive Design**: Works across desktop and mobile devices

## Technologies Used

- React
- TypeScript
- Three.js for 3D visualization
- React Three Fiber
- Styled Components

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd tradevisapp/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser at `http://localhost:3000`

## Usage

- **Pan Globe**: Click and drag to rotate the globe
- **Zoom**: Use mouse wheel or the zoom controls in the bottom left
- **Reset View**: Click the reset button in the controls panel
- **Country Selection**: Click on a country to view detailed market information
- **Search**: Use the search bar to find specific countries or markets

## Project Structure

```
frontend/
├── public/                # Static files
├── src/                   # Source files
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Entry point
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Future Improvements

- Add more detailed country-specific data
- Implement historical data view with timeline slider
- Add comparison feature between countries
- Integrate more financial news sources
- Add user authentication for personalized dashboards 