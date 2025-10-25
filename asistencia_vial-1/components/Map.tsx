import React, { useRef, useEffect, useState } from 'react';
import { LocationCoords } from '../types';

// Inform TypeScript about the global mapboxgl object
declare var mapboxgl: any;

interface MapProps {
    location: LocationCoords | null;
    error: string | null;
}

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

const Map: React.FC<MapProps> = ({ location, error }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

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

        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-99.1332, 19.4326], // Mexico City
            zoom: 5,
        });

        map.on('load', () => {
            mapRef.current = map;
            setIsMapLoaded(true);
        });

        return () => {
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    {renderOverlay()}
                </div>
            </div>
        </div>
    );
};

export default Map;