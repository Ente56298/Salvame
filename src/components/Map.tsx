import React, { useRef, useEffect, useState } from 'react';
import { LocationCoords, TrafficReport } from '../types';
import { locationService, LocationData } from '../services/locationService';
import { offlineMapService } from '../services/offlineMapService';
import UberStyleTracker from './UberStyleTracker';
import { Trip } from '../services/trackingService';
import { offlineService } from '../services/offlineService';

// Inform TypeScript about the global mapboxgl object
declare var mapboxgl: any;

interface MapProps {
    location: LocationCoords | null;
    error: string | null;
    trafficReport?: TrafficReport | null;
}

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

const Map: React.FC<MapProps> = ({ location, error, trafficReport = null }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);
    const userMarkerRef = useRef<any | null>(null);
    const trafficMarkersRef = useRef<any[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [userLocation, setUserLocation] = useState<LocationData | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
    const [isOffline, setIsOffline] = useState(!offlineService.getStatus());
    const tripPathRef = useRef<any | null>(null);

    // Early return with a clear error if the token is missing.
    // This prevents the rest of the component from trying to render an unconfigurable map.
    if (!MAPBOX_TOKEN) {
        return (
            <div className="fixed inset-0 z-30 bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center p-6 bg-red-900/80 rounded-lg backdrop-blur-sm border border-red-700 shadow-2xl max-w-md">
                    <h3 className="text-xl font-bold text-white">Error de Configuración del Mapa</h3>
                    <p className="text-red-200 mt-2 text-sm">
                        El token de acceso de Mapbox no está configurado. El mapa no puede ser mostrado.
                        <br />
                        <span className="text-red-300 font-mono text-xs mt-2 block">Asegúrese de que la variable de entorno MAPBOX_TOKEN esté definida.</span>
                    </p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return; // Initialize map only once

        // Monitor offline status
        const unsubscribe = offlineService.onStatusChange(setIsOffline);
        
        const cleanup = () => {
            unsubscribe();
        };

        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-99.1332, 19.4326], // Mexico City
            zoom: 5,
            interactive: true,
            dragPan: true,
            scrollZoom: true,
            touchZoomRotate: true,
            doubleClickZoom: true,
            keyboard: true,
            transformRequest: (url, resourceType) => {
                // Intercept tile requests for offline support
                if (resourceType === 'Tile' && url.includes('mapbox.com')) {
                    const tileKey = extractTileKey(url);
                    if (tileKey) {
                        return {
                            url: url,
                            credentials: 'same-origin'
                        };
                    }
                }
                return { url };
            }
        });

        const extractTileKey = (url: string): string | null => {
            const match = url.match(/\/([0-9]+)\/([0-9]+)\/([0-9]+)/);
            return match ? `${match[1]}/${match[2]}/${match[3]}` : null;
        };

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add geolocate control
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            }),
            'top-right'
        );

        map.on('load', () => {
            mapRef.current = map;
            setIsMapLoaded(true);
            startLocationTracking();
        });

        const startLocationTracking = async () => {
            try {
                const currentLocation = await locationService.getCurrentLocation();
                setUserLocation(currentLocation);
                setLocationError(null);
                
                locationService.startWatching(
                    (location) => {
                        setUserLocation(location);
                        setIsTracking(true);
                        // Calculate speed if available
                        if (location.speed !== undefined) {
                            setCurrentSpeed(Math.round(location.speed * 3.6)); // Convert m/s to km/h
                        }
                    },
                    (error) => {
                        setLocationError(error.message);
                        setIsTracking(false);
                    }
                );
            } catch (error) {
                setLocationError(error instanceof Error ? error.message : 'Error de ubicación');
            }
        };

        return () => {
            cleanup();
            locationService.stopWatching();
            trafficMarkersRef.current.forEach(marker => marker.remove());
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !location || !isMapLoaded) return;

        const lngLat: [number, number] = [location.lon, location.lat];

        if (markerRef.current) {
            markerRef.current.setLngLat(lngLat);
        } else {
            markerRef.current = new mapboxgl.Marker({
                color: "#3b82f6",
                draggable: false,
            }).setLngLat(lngLat).addTo(mapRef.current);
        }

        mapRef.current.flyTo({
            center: lngLat,
            zoom: 14,
            speed: 1.5,
        });

    }, [location, isMapLoaded]);

    // Update user location marker
    useEffect(() => {
        if (!mapRef.current || !userLocation || !isMapLoaded) return;

        const lngLat: [number, number] = [userLocation.lng, userLocation.lat];

        if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat(lngLat);
        } else {
            // Create user location marker with different style
            const el = document.createElement('div');
            el.className = 'user-location-marker';
            el.style.cssText = `
                width: 20px;
                height: 20px;
                background: #10b981;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                animation: pulse 2s infinite;
            `;
            
            userMarkerRef.current = new mapboxgl.Marker(el)
                .setLngLat(lngLat)
                .addTo(mapRef.current);
        }

        // Center map on user location if no other location is set
        if (!location) {
            mapRef.current.flyTo({
                center: lngLat,
                zoom: 15,
                speed: 1.2,
            });
        }
    }, [userLocation, isMapLoaded, location]);

    // Update traffic incident markers with smooth animations
    useEffect(() => {
        if (!mapRef.current || !isMapLoaded) return;

        const currentIncidents = trafficReport ? [trafficReport] : [];
        const existingMarkers = new Map(trafficMarkersRef.current.map(m => [m.incidentId, m]));
        const newMarkerIds = new Set(currentIncidents.map(i => i.id));

        // Remove markers for incidents that no longer exist
        existingMarkers.forEach((marker, id) => {
            if (!newMarkerIds.has(id)) {
                // Animate removal
                marker.getElement().style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                marker.getElement().style.opacity = '0';
                marker.getElement().style.transform = 'scale(0.5)';
                setTimeout(() => {
                    marker.remove();
                    trafficMarkersRef.current = trafficMarkersRef.current.filter(m => m.incidentId !== id);
                }, 300);
            }
        });

        // Update or add markers
        currentIncidents.forEach(incident => {
            const existingMarker = existingMarkers.get(incident.id);
            
            if (existingMarker) {
                // Update existing marker position with animation
                const newLngLat = [incident.location.lon, incident.location.lat];
                const currentLngLat = existingMarker.getLngLat();
                
                if (currentLngLat.lng !== newLngLat[0] || currentLngLat.lat !== newLngLat[1]) {
                    // Animate position change
                    existingMarker.getElement().style.transition = 'all 0.5s ease-in-out';
                    existingMarker.setLngLat(newLngLat);
                }
            } else {
                // Create new marker with entrance animation
                const el = document.createElement('div');
                el.className = 'traffic-marker';
                el.style.cssText = `
                    width: 24px;
                    height: 24px;
                    background: #dc2626;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    opacity: 0;
                    transform: scale(0.5);
                    transition: opacity 0.3s ease-in, transform 0.3s ease-in;
                `;

                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <div style="padding: 8px; max-width: 200px;">
                            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
                                ${incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                            </h4>
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                ${incident.description}
                            </p>
                            <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">
                                Severidad: ${incident.severity}
                            </p>
                        </div>
                    `);

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([incident.location.lon, incident.location.lat])
                    .setPopup(popup)
                    .addTo(mapRef.current);

                marker.incidentId = incident.id;
                trafficMarkersRef.current.push(marker);

                // Trigger entrance animation
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                }, 50);
            }
        });

        // Smooth map bounds adjustment
        if (currentIncidents.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            currentIncidents.forEach(incident => {
                bounds.extend([incident.location.lon, incident.location.lat]);
            });
            
            // Add user location to bounds if available
            if (userLocation) {
                bounds.extend([userLocation.lng, userLocation.lat]);
            }
            
            mapRef.current.fitBounds(bounds, {
                padding: 50,
                duration: 1000,
                easing: (t) => t * (2 - t) // easeOutQuad
            });
        }
    }, [trafficReport, isMapLoaded, userLocation]);

    // Update trip path on map
    useEffect(() => {
        if (!mapRef.current || !isMapLoaded || !currentTrip) return;

        // Remove existing path
        if (tripPathRef.current) {
            tripPathRef.current.remove();
        }

        // Draw trip path
        if (currentTrip.points.length > 1) {
            const coordinates = currentTrip.points.map(point => [point.lng, point.lat]);
            
            if (mapRef.current.getSource('trip-route')) {
                mapRef.current.getSource('trip-route').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates
                    }
                });
            } else {
                mapRef.current.addSource('trip-route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates
                        }
                    }
                });

                mapRef.current.addLayer({
                    id: 'trip-route',
                    type: 'line',
                    source: 'trip-route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });
            }
        }
    }, [currentTrip, isMapLoaded]);

    const renderOverlay = () => {
        if (error) {
            return (
                <div className="text-center p-6 bg-red-900/80 rounded-lg backdrop-blur-sm border border-red-700 shadow-2xl max-w-sm">
                    <h3 className="text-xl font-bold text-white">Error de Ubicación</h3>
                    <p className="text-red-200 mt-2 text-sm">{error}</p>
                </div>
            );
        }
        
        if (!location && !error) {
            return (
                <div className="text-center p-6 bg-gray-900/80 rounded-lg backdrop-blur-sm border border-gray-700 shadow-2xl">
                    <h3 className="text-xl font-bold text-white">Obteniendo ubicación...</h3>
                    <p className="text-gray-400 mt-1">Por favor, espera.</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-30 bg-gray-900">
            <div ref={mapContainerRef} className="absolute inset-0" />
            
            {/* Location and speed indicator */}
            {userLocation && (
                <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`}></div>
                        Ubicación activa
                    </div>
                    {currentSpeed !== null && (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {currentSpeed} km/h
                        </div>
                    )}
                </div>
            )}
            
            {locationError && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    Error de ubicación
                </div>
            )}
            
            {/* Offline indicator */}
            {isOffline && (
                <div className="absolute top-16 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
                    Modo offline
                </div>
            )}
            
            {/* Map controls */}
            {userLocation && (
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button 
                        onClick={() => {
                            const name = prompt('Nombre para esta ubicación:');
                            if (name) {
                                const { favoritesService } = require('../services/favoritesService');
                                favoritesService.addFavorite({
                                    name,
                                    lat: userLocation.lat,
                                    lng: userLocation.lng,
                                    category: 'custom'
                                });
                                alert('Ubicación guardada!');
                            }
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full shadow-lg"
                        title="Guardar ubicación"
                    >
                        ★
                    </button>
                    <button 
                        onClick={() => {
                            // This would open the offline map panel
                            // For now, just show a simple download option
                            if (confirm('¿Descargar mapas para uso offline en esta área?')) {
                                alert('Funcionalidad de descarga offline disponible en el panel de configuración');
                            }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg"
                        title="Mapas offline"
                    >
                        ⬇️
                    </button>
                </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    {renderOverlay()}
                </div>
            </div>
            
            <UberStyleTracker onTripUpdate={setCurrentTrip} />
            
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Map;