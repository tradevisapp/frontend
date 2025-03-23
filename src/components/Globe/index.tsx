import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import GlobeGL from 'react-globe.gl';
import { Button, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CountryData } from '../../types';
import { formatPercentage } from '../../utils/colorUtils';
import * as THREE from 'three';

const GlobeContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
`;

const ControlsPanel = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  z-index: 10;
`;

const ControlButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  min-width: 40px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  padding: 8px;
  &:hover {
    background-color: rgba(30, 41, 59, 0.9);
  }
`;

interface GlobeProps {
  countries: CountryData[];
  onCountryClick: (country: CountryData) => void;
}

// Define the ref interface
export interface GlobeRef {
  zoomToCountry: (country: CountryData) => void;
}

// Fallback coordinates for common countries
const COUNTRY_COORDINATES: Record<string, { lat: number, lng: number }> = {
  'USA': { lat: 37.0902, lng: -95.7129 },
  'GBR': { lat: 55.3781, lng: -3.4360 },
  'JPN': { lat: 36.2048, lng: 138.2529 },
  'DEU': { lat: 51.1657, lng: 10.4515 },
  'FRA': { lat: 46.2276, lng: 2.2137 },
  'CHN': { lat: 35.8617, lng: 104.1954 },
  'IND': { lat: 20.5937, lng: 78.9629 },
  'BRA': { lat: -14.2350, lng: -51.9253 },
  'CAN': { lat: 56.1304, lng: -106.3468 },
  'AUS': { lat: -25.2744, lng: 133.7751 },
  'RUS': { lat: 61.5240, lng: 105.3188 },
  'MEX': { lat: 23.6345, lng: -102.5528 },
  'ITA': { lat: 41.8719, lng: 12.5674 },
  'ESP': { lat: 40.4637, lng: -3.7492 },
  'KOR': { lat: 35.9078, lng: 127.7669 },
  'ZAF': { lat: -30.5595, lng: 22.9375 },
  'ARG': { lat: -38.4161, lng: -63.6167 },
  'TUR': { lat: 38.9637, lng: 35.2433 },
  'SAU': { lat: 23.8859, lng: 45.0792 },
  'IDN': { lat: -0.7893, lng: 113.9213 },
  'NLD': { lat: 52.1326, lng: 5.2913 },
  'CHE': { lat: 46.8182, lng: 8.2275 },
  'SWE': { lat: 60.1282, lng: 18.6435 },
  'POL': { lat: 51.9194, lng: 19.1451 },
  'BEL': { lat: 50.5039, lng: 4.4699 },
  'THA': { lat: 15.8700, lng: 100.9925 },
  'IRN': { lat: 32.4279, lng: 53.6880 },
  'NGA': { lat: 9.0820, lng: 8.6753 },
  'VNM': { lat: 14.0583, lng: 108.2772 },
  'EGY': { lat: 26.8206, lng: 30.8025 }
};

// Convert to forwardRef
const Globe = forwardRef<GlobeRef, GlobeProps>(({ countries, onCountryClick }, ref) => {
  const globeRef = useRef<any>(null);
  // Only track hoveredCountry if we actually use it later - remove if not used
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const rotationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default globe settings
  const defaultAltitude = 1.5;
  const defaultPolarAngle = Math.PI / 2;

  // Load GeoJSON data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        // Process the GeoJSON to ensure no gaps between polygons
        const processedFeatures = data.features.map((feature: any) => {
          // Fix coordinate precision to reduce jitters
          if (feature.geometry && feature.geometry.coordinates) {
            const simplifyCoordinates = (coords: any) => {
              if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
                // This is a single polygon ring
                return coords.map((point: number[]) => 
                  // Round to 4 decimal places to reduce jitters without losing detail
                  point.map((n: number) => Math.round(n * 10000) / 10000)
                );
              } else {
                // This is a nested array of coordinates
                return coords.map(simplifyCoordinates);
              }
            };
            
            feature.geometry.coordinates = simplifyCoordinates(feature.geometry.coordinates);
          }
          return feature;
        });
        
        setGeoJsonData({
          ...data,
          features: processedFeatures
        });
      })
      .catch(err => console.error("Failed to load GeoJSON data:", err));
  }, []);

  // Effect to set initial zoom and rotation
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({
        altitude: defaultAltitude,
        lat: 0,
        lng: 0
      });
      
      // Access the underlying Three.js renderer to optimize it
      if (globeRef.current._renderer) {
        // Improve antialiasing
        globeRef.current._renderer.setPixelRatio(window.devicePixelRatio);
        
        // Capture ref to avoid warning
        const globeRefCurrent = globeRef.current;
        
        // Add event listener for rotation start/end
        const controls = globeRefCurrent.controls();
        if (controls) {
          controls.addEventListener('start', handleRotationStart);
          controls.addEventListener('end', handleRotationEnd);
          
          // Optimize controls for smoother rotation
          controls.enableDamping = true;
          controls.dampingFactor = 0.2;
          controls.rotateSpeed = 0.4;
          controls.zoomSpeed = 0.65;
          
          // Reduce movement inertia
          controls.enableZoom = true;
          controls.enablePan = false; // Disable panning to reduce jitters
          
          // Set limits to prevent extreme positions
          controls.minPolarAngle = Math.PI * 0.05; // Prevent viewing from directly above
          controls.maxPolarAngle = Math.PI * 0.95; // Prevent viewing from directly below
        }
      }
    }
    
    // Cleanup
    return () => {
      // Use a safe reference to globeRef that won't change
      const currentGlobeRef = globeRef.current;
      if (currentGlobeRef && currentGlobeRef.controls()) {
        const controls = currentGlobeRef.controls();
        controls.removeEventListener('start', handleRotationStart);
        controls.removeEventListener('end', handleRotationEnd);
      }
      
      if (rotationTimeout.current) {
        clearTimeout(rotationTimeout.current);
      }
    };
  }, [defaultAltitude]);
  
  const handleRotationStart = () => {
    // Clear any existing timeout
    if (rotationTimeout.current) {
      clearTimeout(rotationTimeout.current);
    }
    
    // While rotating, we can optionally reduce quality to improve performance
    if (globeRef.current) {
      // Lower the resolution during rotation
      globeRef.current.pointOfView({}, 0);
    }
  };
  
  const handleRotationEnd = () => {
    // Restore full quality after rotation stops
    if (globeRef.current) {
      // Reset transitions to make it smooth
      globeRef.current.pointOfView({}, 0);
    }
    
    // Delay setting isRotating to false to allow rendering to complete
    rotationTimeout.current = setTimeout(() => {
      // We're not using isRotating state, so this can be removed 
    }, 200);
  };

  // Helper function to find a country by its code
  const findCountryByCode = (countryCode: string): CountryData | undefined => {
    // First try direct match
    let country = countries.find(c => c.code === countryCode);
    
    // If not found, try different formats (2-letter vs 3-letter)
    if (!country && countryCode.length === 3) {
      // Try matching the first 2 characters of 3-letter code with 2-letter country codes
      country = countries.find(c => c.code === countryCode.substring(0, 2));
    } else if (!country && countryCode.length === 2) {
      // Try finding a 3-letter code that starts with this 2-letter code
      country = countries.find(c => c.code.startsWith(countryCode));
    }
    
    return country;
  };

  const handleCountryHover = (polygon: any) => {
    // Since we're not using hoveredCountry, we can remove this function or
    // just handle hover effects directly in the label/polygon attributes
    // Empty implementation - we're not tracking hover state currently
  };

  const handleCountryClick = (polygon: any) => {
    if (polygon) {
      const countryCode = polygon.properties.ISO_A2 || polygon.properties.ISO_A3;
      const country = findCountryByCode(countryCode);
      if (country) {
        // Get country coordinates - try multiple possible sources
        let lat, lng;
        
        if (polygon.properties.LABEL_Y && polygon.properties.LABEL_X) {
          // Use label coordinates if available
          lat = polygon.properties.LABEL_Y;
          lng = polygon.properties.LABEL_X;
        } else if (polygon.properties.LAT && polygon.properties.LON) {
          // Use explicit lat/lon if available
          lat = polygon.properties.LAT;
          lng = polygon.properties.LON;
        } else {
          // Calculate approximate center based on geometry
          try {
            // For polygons with coordinates
            const coords = polygon.geometry.coordinates;
            if (coords && coords.length > 0 && coords[0].length > 0) {
              // Simple average of coordinates for a rough center
              let totalLat = 0, totalLng = 0, count = 0;
              
              // Handle different geometry types
              if (polygon.geometry.type === 'Polygon') {
                coords[0].forEach((coord: number[]) => {
                  totalLng += coord[0];
                  totalLat += coord[1];
                  count++;
                });
              } else if (polygon.geometry.type === 'MultiPolygon') {
                coords.forEach((poly: number[][][]) => {
                  poly[0].forEach((coord: number[]) => {
                    totalLng += coord[0];
                    totalLat += coord[1];
                    count++;
                  });
                });
              }
              
              if (count > 0) {
                lat = totalLat / count;
                lng = totalLng / count;
              } else {
                // Default if we can't calculate
                lat = 0;
                lng = 0;
              }
            } else {
              // Default fallback
              lat = 0;
              lng = 0;
            }
          } catch (e) {
            console.error("Error calculating country center:", e);
            lat = 0;
            lng = 0;
          }
        }
        
        // Zoom to country with animation
        globeRef.current.pointOfView({
          lat,
          lng,
          altitude: 0.8
        }, 1000);
        
        // Delay opening the country card until zoom is complete
        setTimeout(() => {
          onCountryClick(country);
        }, 1200);
      }
    }
  };

  const handleZoomIn = () => {
    if (globeRef.current) {
      const { altitude } = globeRef.current.pointOfView();
      if (altitude > 0.3) {
        globeRef.current.pointOfView({ altitude: altitude * 0.65 });
      }
    }
  };

  const handleZoomOut = () => {
    if (globeRef.current) {
      const { altitude } = globeRef.current.pointOfView();
      if (altitude < 5) {
        globeRef.current.pointOfView({ altitude: altitude * 1.5 });
      }
    }
  };

  const handleReset = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({
        altitude: defaultAltitude,
        lat: 0,
        lng: 0,
        polarAngle: defaultPolarAngle
      });
    }
  };

  // Update dimensions when the window size changes
  useEffect(() => {
    let animationFrameId: number;
    let resizeTimer: NodeJS.Timeout;

    const updateDimensions = () => {
      if (containerRef.current) {
        cancelAnimationFrame(animationFrameId);
        
        // Use requestAnimationFrame to throttle updates during resize
        animationFrameId = requestAnimationFrame(() => {
          setDimensions({
            width: containerRef.current!.offsetWidth,
            height: containerRef.current!.offsetHeight
          });
        });
      }
    };

    // Throttled resize event handler to improve performance
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    };

    updateDimensions();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Zoom to a country method
  const zoomToCountry = (country: CountryData) => {
    if (!globeRef.current || !country) return;
    
    // Log for debugging
    console.log("Zooming to country:", country);
    
    // Check if we have fallback coordinates for this country
    const fallbackCoords = COUNTRY_COORDINATES[country.code];
    
    // If GeoJSON data isn't available yet, use fallback coordinates
    if (!geoJsonData || !geoJsonData.features) {
      console.warn("GeoJSON data not loaded yet, using fallback coordinates");
      
      if (fallbackCoords) {
        console.log(`Using fallback coordinates for ${country.name}:`, fallbackCoords);
        
        // Zoom to fallback coordinates
        globeRef.current.pointOfView({
          lat: fallbackCoords.lat,
          lng: fallbackCoords.lng,
          altitude: 0.8
        }, 1000);
        
        // Delay opening the country card
        setTimeout(() => {
          onCountryClick(country);
        }, 1200);
        return;
      } else {
        // No fallback, just open the card
        console.error("No fallback coordinates for this country");
        onCountryClick(country);
        return;
      }
    }
    
    // Try multiple approaches to find the country in the GeoJSON data
    let countryFeature = null;
    
    // First try direct matching by ISO code
    countryFeature = geoJsonData.features.find((f: any) => {
      const iso2 = f.properties.ISO_A2;
      const iso3 = f.properties.ISO_A3;
      return iso2 === country.code || iso3 === country.code;
    });
    
    // If not found, try case-insensitive matching by country name
    if (!countryFeature) {
      countryFeature = geoJsonData.features.find((f: any) => {
        const featureName = f.properties.NAME || f.properties.ADMIN || '';
        return featureName.toLowerCase() === country.name.toLowerCase();
      });
    }
    
    // If still not found, try partial name matching
    if (!countryFeature) {
      countryFeature = geoJsonData.features.find((f: any) => {
        const featureName = f.properties.NAME || f.properties.ADMIN || '';
        return featureName.toLowerCase().includes(country.name.toLowerCase()) || 
               country.name.toLowerCase().includes(featureName.toLowerCase());
      });
    }
    
    if (!countryFeature) {
      console.error(`Country feature not found for: ${country.name} (${country.code})`);
      
      // If no polygon found, use fallback coordinates if available
      if (fallbackCoords) {
        console.log(`Using fallback coordinates for ${country.name}:`, fallbackCoords);
        
        // Zoom to fallback coordinates
        globeRef.current.pointOfView({
          lat: fallbackCoords.lat,
          lng: fallbackCoords.lng,
          altitude: 0.8
        }, 1000);
        
        // Delay opening the country card
        setTimeout(() => {
          onCountryClick(country);
        }, 1200);
        return;
      } else {
        // No fallback, just open the card
        onCountryClick(country);
        return;
      }
    }
    
    console.log("Found country feature:", countryFeature.properties.NAME || countryFeature.properties.ADMIN);
    
    // Calculate center coordinates
    let lat = 0, lng = 0;
    
    // Try to get coordinates from properties
    if (countryFeature.properties.LABEL_Y && countryFeature.properties.LABEL_X) {
      lat = countryFeature.properties.LABEL_Y;
      lng = countryFeature.properties.LABEL_X;
    } else if (countryFeature.properties.LAT && countryFeature.properties.LON) {
      lat = countryFeature.properties.LAT;
      lng = countryFeature.properties.LON;
    } else {
      // Calculate from geometry
      try {
        const coords = countryFeature.geometry.coordinates;
        if (coords && coords.length > 0 && coords[0].length > 0) {
          let totalLat = 0, totalLng = 0, count = 0;
          
          if (countryFeature.geometry.type === 'Polygon') {
            coords[0].forEach((coord: number[]) => {
              totalLng += coord[0];
              totalLat += coord[1];
              count++;
            });
          } else if (countryFeature.geometry.type === 'MultiPolygon') {
            coords.forEach((poly: number[][][]) => {
              poly[0].forEach((coord: number[]) => {
                totalLng += coord[0];
                totalLat += coord[1];
                count++;
              });
            });
          }
          
          if (count > 0) {
            lat = totalLat / count;
            lng = totalLng / count;
          }
        }
      } catch (e) {
        console.error("Error calculating country center:", e);
        
        // Use fallback coordinates if available and calculation failed
        if (fallbackCoords) {
          lat = fallbackCoords.lat;
          lng = fallbackCoords.lng;
        }
      }
    }
    
    console.log(`Zooming to coordinates: lat=${lat}, lng=${lng}`);
    
    // Zoom to country with animation
    globeRef.current.pointOfView({
      lat,
      lng,
      altitude: 0.8
    }, 1000);
    
    // Delay opening the country card until zoom is complete
    setTimeout(() => {
      onCountryClick(country);
    }, 1200);
  };
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    zoomToCountry
  }));

  // Add debug logging when GeoJSON data is loaded
  useEffect(() => {
    if (geoJsonData && geoJsonData.features && geoJsonData.features.length > 0) {
      console.log("Loaded GeoJSON features count:", geoJsonData.features.length);
      
      // Log the first few country codes from the GeoJSON
      const countryCodes = geoJsonData.features.slice(0, 10).map((f: any) => {
        return {
          name: f.properties.NAME || f.properties.ADMIN,
          iso2: f.properties.ISO_A2, 
          iso3: f.properties.ISO_A3
        };
      });
      console.log("Sample country codes in GeoJSON:", countryCodes);
      
      // Log the first few country codes from our data
      const ourCountryCodes = countries.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        code: c.code
      }));
      console.log("Our country codes:", ourCountryCodes);
    }
  }, [geoJsonData, countries]);

  return (
    <GlobeContainer ref={containerRef}>
      {geoJsonData && dimensions.width > 0 && dimensions.height > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl=""
          backgroundColor="#000000"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          polygonsData={geoJsonData.features}
          polygonCapColor={(polygon: any) => {
            const countryCode = polygon.properties.ISO_A2 || polygon.properties.ISO_A3;
            const country = findCountryByCode(countryCode);
            return country?.color || '#888888';
          }}
          polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
          polygonStrokeColor={() => 'rgba(255, 255, 255, 0.25)'}
          polygonAltitude={0.004}
          polygonsTransitionDuration={0}
          polygonLabel={(polygon: any) => {
            const countryCode = polygon.properties.ISO_A2 || polygon.properties.ISO_A3;
            const country = findCountryByCode(countryCode);
            if (country) {
              return `<div style="text-align:center;font-size:10px;text-shadow:1px 1px 1px rgba(0,0,0,0.8);pointer-events:none;user-select:none;">
                <span style="color:white;font-weight:bold;">${country.name}</span><br/>
                <span style="color:${country.marketPerformance && country.marketPerformance > 0 ? '#10b981' : '#ef4444'}">
                  ${formatPercentage(country.marketPerformance)}
                </span>
              </div>`;
            }
            return '';
          }}
          labelLat={(polygon: any) => {
            if (polygon.properties.LABEL_LAT) return polygon.properties.LABEL_LAT;
            if (polygon.properties.LAT) return polygon.properties.LAT;
            return null;
          }}
          labelLng={(polygon: any) => {
            if (polygon.properties.LABEL_LONG) return polygon.properties.LABEL_LONG;
            if (polygon.properties.LONG) return polygon.properties.LONG;
            if (polygon.properties.LON) return polygon.properties.LON;
            return null;
          }}
          labelAltitude={0.01}
          labelSize={1.5}
          labelIncludeDot={false}
          labelColor={() => 'rgba(255, 255, 255, 0.75)'}
          labelResolution={2}
          onPolygonHover={handleCountryHover}
          onPolygonClick={handleCountryClick}
          atmosphereColor="rgba(59, 130, 246, 0.2)"
          atmosphereAltitude={0.08}
          showGlobe={true}
          globeMaterial={new THREE.MeshPhongMaterial({ 
            color: '#252525', 
            shininess: 0.1,
            opacity: 1,
            transparent: false
          })}
          rendererConfig={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'highp'
          }}
        />
      )}

      <ControlsPanel>
        <Tooltip title="Zoom In" placement="right">
          <ControlButton 
            variant="contained" 
            onClick={handleZoomIn}
            size="small"
          >
            <ZoomInIcon />
          </ControlButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="right">
          <ControlButton 
            variant="contained" 
            onClick={handleZoomOut}
            size="small"
          >
            <ZoomOutIcon />
          </ControlButton>
        </Tooltip>
        <Tooltip title="Reset View" placement="right">
          <ControlButton 
            variant="contained" 
            onClick={handleReset}
            size="small"
          >
            <RefreshIcon />
          </ControlButton>
        </Tooltip>
      </ControlsPanel>
    </GlobeContainer>
  );
});

export default Globe; 