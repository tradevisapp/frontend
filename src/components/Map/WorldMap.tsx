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
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3.ZoomTransform | null>(null);
  const [geoData, setGeoData] = useState<{ features: GeoFeature[] } | null>(null);
  const [, setActiveCountry] = useState<string | null>(null);
  const [svgCreated, setSvgCreated] = useState<boolean>(false);

  // Initialize zoom behavior once
  useEffect(() => {
    if (!svgRef.current || !mapContainerRef.current) return;
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    
    // Create zoom behavior just once
    zoomRef.current = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [containerWidth, containerHeight]])
      .on('zoom', (event) => {
        const svg = d3.select(svgRef.current);
        const g = svg.select('g');
        if (g) {
          g.attr('transform', event.transform);
          currentTransformRef.current = event.transform; // Store current transform
        }
      });
      
  }, []);

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

  // Initialize the map
  useEffect(() => {
    if (!geoData || !svgRef.current || !mapContainerRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container dimensions
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    // Set up map projection
    const projection = d3.geoMercator()
      .scale(containerWidth / 6.5)
      .center([0, 20]) // Adjust center to remove excessive blank space
      .translate([containerWidth / 2, containerHeight / 2]);

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);

    // Create a group for the map
    const g = svg.append('g');

    // Apply zoom to SVG if zoom exists
    if (zoomRef.current) {
      svg.call(zoomRef.current);
      
      // Apply saved transform if it exists and preserveTransform is true
      if (preserveTransform && currentTransformRef.current) {
        // @ts-ignore
        svg.call(
          zoomRef.current.transform,
          currentTransformRef.current
        );
      }
    }

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
          return '#555'; // Gray for countries with no data
        }
        return countryData.stockMarketChange > 0 
          ? d3.interpolateGreens(Math.min(countryData.stockMarketChange / 5, 1)) 
          : d3.interpolateReds(Math.min(Math.abs(countryData.stockMarketChange) / 5, 1));
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
        if (!d || !d.properties || !zoomRef.current) return;
        
        const countryId = getCountryCode(d.properties.name);
        onCountryClick(countryId);
        
        try {
          // Center and zoom to the clicked country
          const bounds = pathGenerator.bounds(d as any);
          const dx = bounds[1][0] - bounds[0][0];
          const dy = bounds[1][1] - bounds[0][1];
          const x = (bounds[0][0] + bounds[1][0]) / 2;
          const y = (bounds[0][1] + bounds[1][1]) / 2;
          const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / containerWidth, dy / containerHeight)));
          const translate = [containerWidth / 2 - scale * x, containerHeight / 2 - scale * y];

          svg.transition()
            .duration(750)
            .call(
              // @ts-ignore
              zoomRef.current.transform,
              d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(scale)
            );
        } catch (e) {
          console.error("Error zooming to country:", e);
        }
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
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('opacity', (d: GeoFeature) => {
        if (!d || !d.properties) return 0;
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        return countryData && countryData.stockMarketChange !== undefined ? 1 : 0;
      })
      .text((d: GeoFeature) => {
        if (!d || !d.properties) return '';
        
        const countryCode = getCountryCode(d.properties.name);
        const countryData = countries.find(c => c.id === d.id || countryCode === c.id);
        if (countryData && countryData.stockMarketChange !== undefined) {
          return `${countryData.name}: ${countryData.stockMarketChange > 0 ? '+' : ''}${countryData.stockMarketChange.toFixed(1)}%`;
        }
        return '';
      });

  }, [geoData, countries, onCountryClick, getCountryCode, preserveTransform]);

  // Handle search query
  useEffect(() => {
    if (!searchQuery || !geoData || !svgRef.current || !mapContainerRef.current || !svgCreated) return;

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

      if (matchedCountry && matchedCountry.properties && zoomRef.current) {
        const svg = d3.select(svgRef.current);
        const pathGenerator = d3.geoPath().projection(d3.geoMercator()
          .scale(mapContainerRef.current.clientWidth / 6.5)
          .center([0, 20])
          .translate([mapContainerRef.current.clientWidth / 2, mapContainerRef.current.clientHeight / 2]));

        try {
          const bounds = pathGenerator.bounds(matchedCountry as any);
          const dx = bounds[1][0] - bounds[0][0];
          const dy = bounds[1][1] - bounds[0][1];
          const x = (bounds[0][0] + bounds[1][0]) / 2;
          const y = (bounds[0][1] + bounds[1][1]) / 2;
          const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / mapContainerRef.current.clientWidth, dy / mapContainerRef.current.clientHeight)));
          const translate = [mapContainerRef.current.clientWidth / 2 - scale * x, mapContainerRef.current.clientHeight / 2 - scale * y];

          svg.transition()
            .duration(750)
            .call(
              // @ts-ignore
              zoomRef.current.transform,
              d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(scale)
            );

          // Set active country
          setActiveCountry(getCountryCode(matchedCountry.properties.name));
        } catch (e) {
          console.error("Error zooming to search result:", e);
        }
      }
    } catch (e) {
      console.error("Error in search functionality:", e);
    }
  }, [searchQuery, geoData, countries, getCountryCode, svgCreated]);

  // Controls for zoom
  const handleZoomIn = () => {
    if (!zoomRef.current || !svgRef.current) return;
    try {
      // @ts-ignore
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    } catch (e) {
      console.error("Error zooming in:", e);
    }
  };

  const handleZoomOut = () => {
    if (!zoomRef.current || !svgRef.current) return;
    try {
      // @ts-ignore
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.75);
    } catch (e) {
      console.error("Error zooming out:", e);
    }
  };

  const handleReset = () => {
    if (!zoomRef.current || !svgRef.current) return;
    try {
      // @ts-ignore
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.transform,
        d3.zoomIdentity
      );
    } catch (e) {
      console.error("Error resetting zoom:", e);
    }
  };

  return (
    <div className="map-container" ref={mapContainerRef}>
      <svg ref={svgRef}></svg>
      <div className="map-controls">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default WorldMap; 