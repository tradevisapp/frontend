import React, { useEffect, useState } from 'react';
import './LoadingBar.css';

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Accelerate slowly at first, then decelerate as we approach 90%
          const increment = prevProgress < 50 ? 5 : prevProgress < 80 ? 3 : 1;
          const newProgress = Math.min(prevProgress + increment, 90);
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      // When loading is complete, quickly finish the progress bar
      setProgress(100);
    }
  }, [isLoading]);

  if (!isLoading && progress === 100) {
    // Return null when the loading is complete and progress has reached 100%
    // This will be shown briefly after loading completes
    return null;
  }

  return (
    <div className={`loading-bar-container ${isLoading ? 'visible' : 'completed'}`}>
      <div 
        className="loading-bar-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar; 