import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiNavigation, FiTarget } from 'react-icons/fi';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  'pk.eyJ1IjoibWF5dXJuaWt1bWJlIiwiYSI6ImNtdWIzYmVkcDFxcDkyenMyajg1eTQwNm4ifQ.ld-zo75Ja_PGCsEbXSFe3Q';

const LiveTracking = ({ className = 'h-full w-full' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const isFirstPosition = useRef(true);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  // Default fallback center (Mumbai / India coordinates)
  const defaultCenter = [72.8777, 19.076];

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize Mapbox Map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 15,
      pitch: 30, // slight 3D perspective
    });

    mapRef.current = map;

    // Add navigation controls (zoom in/out, compass)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    // Create a custom pulsing marker for user location
    const markerEl = document.createElement('div');
    markerEl.className = 'relative flex items-center justify-center';
    markerEl.innerHTML = `
      <div class="absolute h-8 w-8 rounded-full bg-blue-500/30 animate-ping"></div>
      <div class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-md">
        <div class="h-2 w-2 rounded-full bg-white"></div>
      </div>
    `;

    const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
      .setLngLat(defaultCenter)
      .addTo(map);

    userMarkerRef.current = marker;

    // Periodic 10-second location update function
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            const userCoords = [longitude, latitude];
            setCurrentPosition(userCoords);
            setIsLocating(false);

            if (marker) {
              marker.setLngLat(userCoords);
            }

            // Fly to location on first location fix
            if (isFirstPosition.current && map) {
              map.flyTo({
                center: userCoords,
                zoom: 16,
                essential: true,
                duration: 1500,
              });
              isFirstPosition.current = false;
            }
          },
          (error) => {
            console.warn('Geolocation update error:', error.message);
            setIsLocating(false);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        setIsLocating(false);
      }
    };

    // Initial immediate fetch
    updateLocation();

    // Trigger update every 10 seconds
    const intervalId = setInterval(updateLocation, 10000);

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
      map.remove();
    };
  }, []);

  // Handler to smoothly re-center map on user's live position
  const handleRecenter = () => {
    if (!mapRef.current) return;

    if (currentPosition) {
      mapRef.current.flyTo({
        center: currentPosition,
        zoom: 16,
        essential: true,
        duration: 1000,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        const userCoords = [longitude, latitude];
        setCurrentPosition(userCoords);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat(userCoords);
        }
        mapRef.current.flyTo({
          center: userCoords,
          zoom: 16,
          essential: true,
          duration: 1000,
        });
      });
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Recenter Button */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Recenter map on current location"
        className="absolute bottom-5 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#1b1c1c] shadow-lg backdrop-blur-sm transition hover:bg-white active:scale-95"
      >
        <FiTarget className="text-xl" />
      </button>

      {/* Geolocation Status Badge */}
      {isLocating && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1b1c1c] shadow-md backdrop-blur-sm">
          <FiNavigation className="animate-spin text-blue-600" />
          <span>Locating you...</span>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;