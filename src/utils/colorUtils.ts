/**
 * Generates a color based on market performance percentage
 * Green for positive, red for negative, shades based on magnitude
 * Grey for no data
 */
export const getColorFromPerformance = (performance: number | null): string => {
  if (performance === null) return '#888888'; // Default grey for no data
  
  if (performance === 0) return '#FFFFFF'; // White for no change
  
  if (performance > 0) {
    // Green shades for positive performance
    const intensity = Math.min(Math.abs(performance) / 5, 1); // Cap at 5% for max intensity
    const green = Math.floor(100 + 155 * intensity);
    return `rgb(0, ${green}, 0)`;
  } else {
    // Red shades for negative performance
    const intensity = Math.min(Math.abs(performance) / 5, 1); // Cap at 5% for max intensity
    const red = Math.floor(100 + 155 * intensity);
    return `rgb(${red}, 0, 0)`;
  }
};

/**
 * Formats percentage for display
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A';
  
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}; 