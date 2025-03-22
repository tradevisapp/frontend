import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Country } from '../../types';
import './WorldMap.css';

interface WorldMapProps {
  countries: Country[];
  onCountryClick: (countryId: string) => void;
  searchQuery?: string;
  preserveTransform?: boolean;
}

// Type for GeoJSON features
interface GeoFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  } | null;
  geometry: any;
  id?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ countries, onCountryClick, searchQuery, preserveTransform = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<{ features: GeoFeature[] } | null>(null);
  const [, setActiveCountry] = useState<string | null>(null);
  const [svgCreated, setSvgCreated] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0});
  
  // Rotation state for the globe
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const projectionRef = useRef<d3.GeoProjection | null>(null);

  // Load the world GeoJSON data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        // Remove Antarctica from the map
        const filteredData = {
          ...data,
          features: data.features.filter((feature: GeoFeature) => 
            feature.properties && feature.properties.name !== 'Antarctica'
          )
        };
        setGeoData(filteredData);
      })
      .catch(error => {
        console.error("Error loading map data:", error);
      });
  }, []);

  // Helper function to convert country names to ISO codes (simplified)
  const getCountryCode = useCallback((countryName: string): string => {
    if (!countryName) return '';
    
    const countryCodeMap: Record<string, string> = {
      'United States of America': 'USA',
      'United States': 'USA',
      'Japan': 'JPN',
      'United Kingdom': 'GBR',
      'Germany': 'DEU',
      'France': 'FRA',
      'China': 'CHN',
      'India': 'IND',
      'Brazil': 'BRA',
      'Canada': 'CAN',
      'Australia': 'AUS',
      // Add more mappings as needed
    };
    
    return countryCodeMap[countryName] || countryName;
  }, []);

  // Function to redraw the globe with current rotation
  const redrawGlobe = useCallback(() => {
    if (!geoData || !svgRef.current || !projectionRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const path = d3.geoPath().projection(projectionRef.current);
    
    // Update country paths
    svg.selectAll<SVGPathElement, GeoFeature>('.country')
      .attr('d', feature => {
        try {
          return path(feature as any) || '';
        } catch (e) {
          return '';
        }
      });
    
    // Update graticule path
    svg.select('.graticule')
      .attr('d', path(d3.geoGraticule().step([15, 15])() as any));
    
    // Update country labels
    svg.selectAll<SVGTextElement, GeoFeature>('.country-label')
      .attr('x', (d) => {
        if (!d || !d.geometry) return 0;
        try {
          const centroid = path.centroid(d as any);
          return centroid[0];
        } catch (e) {
          return 0;
        }
      })
      .attr('y', (d) => {
        if (!d || !d.geometry) return 0;
        try {
          const centroid = path.centroid(d as any);
          return centroid[1];
        } catch (e) {
          return 0;
        }
      })
      .attr('opacity', (d) => {
        // Hide labels on the "back" of the globe
        if (!d || !d.geometry) return 0;
        try {
          const centroid = path.centroid(d as any);
          // d3's centroid function with orthographic projection returns array with position
          // but doesn't include Z index in the type definitions, access it carefully
          const z = centroid.length > 2 ? (centroid as number[])[2] : 0;
          
          // Only show if on the visible side of the globe (z >= 0)
          if (z < 0) return 0;
          
          // Additional visibility logic based on market change magnitude
          const countryCode = getCountryCode((d.properties?.name || ''));
          const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
          if (!countryData || Math.abs(countryData.stockMarketChange || 0) <= 2.0) return 0;
          
          return 1;
        } catch (e) {
          return 0;
        }
      });
      
    // Ensure no more than a limited number of labels are visible to prevent overcrowding
    // Get all currently visible labels (opacity 1)
    const visibleLabels = svg.selectAll<SVGTextElement, GeoFeature>('.country-label')
      .filter(function() { 
        return d3.select(this).attr('opacity') === '1';
      })
      .nodes();
      
    if (visibleLabels.length > 7) {
      // Sort by absolute change value (stored in data-change attribute)
      const sortedLabels = visibleLabels.sort((a, b) => {
        const aChange = parseFloat(a.getAttribute('data-change') || '0');
        const bChange = parseFloat(b.getAttribute('data-change') || '0');
        return bChange - aChange; // Descending order
      });
      
      // Hide excess labels
      sortedLabels.slice(7).forEach(label => {
        d3.select(label).attr('opacity', '0');
      });
    }
  }, [geoData, countries, getCountryCode]);

  // Handle mouse down event to start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setMousePos({x: e.clientX, y: e.clientY});
  }, []);
  
  // Handle mouse move for rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !projectionRef.current) return;
    
    const dx = e.clientX - mousePos.x;
    const dy = e.clientY - mousePos.y;
    const rotation = rotationRef.current;
    const sensitivity = 1.0;
    
    rotation[0] = rotation[0] + dx * sensitivity;
    rotation[1] = rotation[1] - dy * sensitivity;
    rotation[1] = Math.max(-90, Math.min(90, rotation[1]));
    
    console.log(`Rotating globe to: [${rotation[0].toFixed(1)}, ${rotation[1].toFixed(1)}]`);
    
    projectionRef.current.rotate(rotation);
    
    // Update mouse position
    setMousePos({x: e.clientX, y: e.clientY});
    
    // Redraw the globe
    redrawGlobe();
  }, [isDragging, mousePos, redrawGlobe]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Handle mouse leave to end dragging
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!geoData || !svgRef.current || !mapContainerRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container dimensions
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    const size = Math.min(containerWidth, containerHeight) * 0.9; // Use 90% of the available space

    // Set up globe projection (orthographic)
    const projection = d3.geoOrthographic()
      .scale(size / 2.3) // Slightly larger globe
      .translate([0, 0]) // Center at origin for use with group transform
      .rotate(rotationRef.current);
    
    projectionRef.current = projection;

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Create SVG element
    const svgElement = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('cursor', 'grab'); // Add grab cursor
    
    // Create a group for the map and center it in the container
    const g = svgElement.append('g')
      .attr('transform', `translate(${containerWidth / 2}, ${containerHeight / 2})`)
      .attr('class', 'globe-group');
    
    // Add a water circle (ocean)
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', projection.scale())
      .attr('class', 'ocean')
      .attr('fill', '#1e4d6b');

    // Create graticule generator (longitude/latitude lines)
    const graticule = d3.geoGraticule()
      .step([15, 15]); // Line spacing (degrees)
      
    // Add graticule lines
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', pathGenerator);

    // Mark that the SVG has been created
    setSvgCreated(true);

    // Draw map features (countries)
    g.selectAll('.country')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', (d) => {
        try {
          return pathGenerator(d as any);
        } catch (e) {
          console.error("Error generating path for feature:", d);
          return "";
        }
      })
      .attr('fill', (d: GeoFeature) => {
        if (!d || !d.properties) return '#555';
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        
        if (!countryData || countryData.stockMarketChange === undefined) {
          return '#7a7a7a'; // Light gray for countries with no data
        }
        
        // Use more vivid colors for better visibility
        if (countryData.stockMarketChange > 0) {
          return d3.interpolateGreens(Math.min(0.4 + countryData.stockMarketChange / 7, 0.9));
        } else {
          return d3.interpolateReds(Math.min(0.4 + Math.abs(countryData.stockMarketChange) / 7, 0.9));
        }
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .attr('data-country-id', (d: GeoFeature) => {
        return d.properties ? getCountryCode(d.properties.name) : '';
      })
      .on('mouseover', (event, d: GeoFeature) => {
        if (!d || !d.properties) return;
        
        d3.select(event.currentTarget)
          .attr('stroke', '#007BFF')
          .attr('stroke-width', 1.5);
          
        setActiveCountry(getCountryCode(d.properties.name));
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5);
        setActiveCountry(null);
      })
      .on('click', (event, d: GeoFeature) => {
        if (!d || !d.properties) return;
        
        const countryId = getCountryCode(d.properties.name);
        onCountryClick(countryId);
      });

    // Add country labels and values
    g.selectAll('.country-label')
      .data(geoData.features)
      .enter()
      .append('text')
      .attr('class', 'country-label')
      .attr('x', (d: GeoFeature) => {
        if (!d || !d.geometry) return 0;
        try {
          const centroid = pathGenerator.centroid(d as any);
          return centroid[0];
        } catch (e) {
          return 0;
        }
      })
      .attr('y', (d: GeoFeature) => {
        if (!d || !d.geometry) return 0;
        try {
          const centroid = pathGenerator.centroid(d as any);
          return centroid[1];
        } catch (e) {
          return 0;
        }
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('opacity', (d: GeoFeature) => {
        if (!d || !d.properties) return 0;
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        
        // Only show labels for countries with significant data
        if (!countryData || countryData.stockMarketChange === undefined) return 0;
        
        // Only show labels for countries with significant changes (over 2%)
        // This helps reduce overlapping text
        return Math.abs(countryData.stockMarketChange) > 2.0 ? 1 : 0;
      })
      .attr('stroke', 'black')
      .attr('stroke-width', '0.3px')
      .attr('paint-order', 'stroke')
      .text((d: GeoFeature) => {
        if (!d || !d.properties) return '';
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        if (countryData && countryData.stockMarketChange !== undefined) {
          // Use abbreviations for country names to reduce text length
          const shortName = countryData.name.length > 10 ? 
            countryData.id || countryData.name.substring(0, 8) : 
            countryData.name;
            
          return `${shortName}: ${countryData.stockMarketChange > 0 ? '+' : ''}${countryData.stockMarketChange.toFixed(1)}%`;
        }
        return '';
      })
      // Filter labels to avoid overcrowding - only show top 10 by absolute change value
      .each(function(this: SVGTextElement, d: GeoFeature) {
        if (!d || !d.properties) return;
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        
        if (!countryData || countryData.stockMarketChange === undefined) {
          d3.select(this).remove();
          return;
        }
        
        // Add data attribute to help with filtering
        d3.select(this).attr('data-change', Math.abs(countryData.stockMarketChange));
      });

    // After all labels are created, keep only the top labels to avoid overcrowding
    const allLabels = g.selectAll<SVGTextElement, GeoFeature>('.country-label').nodes();
    const maxLabelsToShow = 7; // Limit the number of labels on screen at once

    if (allLabels.length > maxLabelsToShow) {
      // Sort by absolute change value (stored in data-change attribute)
      const sortedLabels = allLabels.sort((a, b) => {
        const aChange = parseFloat(a.getAttribute('data-change') || '0');
        const bChange = parseFloat(b.getAttribute('data-change') || '0');
        return bChange - aChange; // Descending order
      });
      
      // Remove excess labels
      sortedLabels.slice(maxLabelsToShow).forEach(label => {
        label.remove();
      });
    }

  }, [geoData, countries, onCountryClick, getCountryCode, preserveTransform, redrawGlobe]);

  // Handle search query
  useEffect(() => {
    if (!searchQuery || !geoData || !svgRef.current || !mapContainerRef.current || !svgCreated || !projectionRef.current) return;

    try {
      const lowercaseQuery = searchQuery.toLowerCase();
      const matchedCountry = geoData.features.find((feature: GeoFeature) => {
        if (!feature || !feature.properties) return false;
        
        const countryName = feature.properties.name.toLowerCase();
        const countryCode = getCountryCode(feature.properties.name).toLowerCase();
        
        return countryName.includes(lowercaseQuery) || 
               countryCode.includes(lowercaseQuery) ||
               countries.some(c => 
                 c.id.toLowerCase() === lowercaseQuery || 
                 c.name.toLowerCase().includes(lowercaseQuery)
               );
      });

      if (matchedCountry && matchedCountry.properties && projectionRef.current) {
        // Rotate globe to focus on the matched country
        const projection = projectionRef.current;
        
        // Create a temporary GeoJSON Point at the country's centroid
        const centroid = d3.geoCentroid(matchedCountry as any);
        
        // Set rotation to focus on country (negative because we're rotating the globe, not the point)
        rotationRef.current = [-centroid[0], -centroid[1], 0];
        projection.rotate(rotationRef.current);
        
        // Redraw globe with new rotation
        redrawGlobe();
        
        // Set active country
        setActiveCountry(getCountryCode(matchedCountry.properties.name));
      }
    } catch (e) {
      console.error("Error in search functionality:", e);
    }
  }, [searchQuery, geoData, countries, getCountryCode, svgCreated, redrawGlobe]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (geoData && svgRef.current && mapContainerRef.current && projectionRef.current) {
        const containerWidth = mapContainerRef.current.clientWidth;
        const containerHeight = mapContainerRef.current.clientHeight;
        const size = Math.min(containerWidth, containerHeight) * 0.9;
        
        // Update projection scale, keep origin at 0,0
        projectionRef.current
          .scale(size / 2.3)
          .translate([0, 0]);
        
        // Update SVG dimensions
        d3.select(svgRef.current)
          .attr('width', '100%')
          .attr('height', '100%');
        
        // Update the group transform to keep the globe centered
        d3.select(svgRef.current).select('.globe-group')
          .attr('transform', `translate(${containerWidth / 2}, ${containerHeight / 2})`);
        
        // Update ocean circle
        d3.select(svgRef.current).select('.ocean')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', projectionRef.current.scale());
        
        // Redraw globe
        redrawGlobe();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [geoData, redrawGlobe]);

  const handleReset = () => {
    if (!projectionRef.current) return;
    
    // Reset rotation to default view
    rotationRef.current = [0, 0, 0];
    projectionRef.current.rotate(rotationRef.current);
    redrawGlobe();
  };

  return (
    <div className="map-container" ref={mapContainerRef}>
      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      ></svg>
      <div className="map-controls">
        <button onClick={handleReset}>Reset View</button>
      </div>
    </div>
  );
};

export default WorldMap; 