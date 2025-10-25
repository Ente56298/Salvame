import { useState, useEffect, useCallback } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface MovementMetrics {
  speed: number; // km/h
  direction: number; // degrees 0-360
  acceleration: number; // km/h²
  distance: number; // km total traveled
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  isMoving: boolean;
}

interface AccessPointHistory {
  id: string;
  name: string;
  location: LocationData;
  encounters: number;
  lastSeen: number;
  averageSignal: number;
  timeSpent: number; // minutes
}

export const useMovementTracking = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [movement, setMovement] = useState<MovementMetrics>({
    speed: 0,
    direction: 0,
    acceleration: 0,
    distance: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    isMoving: false
  });
  const [accessPointHistory, setAccessPointHistory] = useState<AccessPointHistory[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Calcular distancia entre dos puntos usando fórmula Haversine
  const calculateDistance = useCallback((pos1: LocationData, pos2: LocationData): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Calcular dirección entre dos puntos
  const calculateBearing = useCallback((pos1: LocationData, pos2: LocationData): number => {
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const lat1 = pos1.lat * Math.PI / 180;
    const lat2 = pos2.lat * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }, []);

  // Actualizar métricas de movimiento
  const updateMovementMetrics = useCallback((newLocation: LocationData) => {
    if (locationHistory.length === 0) {
      setLocationHistory([newLocation]);
      return;
    }

    const lastLocation = locationHistory[locationHistory.length - 1];
    const distance = calculateDistance(lastLocation, newLocation);
    const timeDiff = (newLocation.timestamp - lastLocation.timestamp) / 1000 / 3600; // horas
    const speed = timeDiff > 0 ? distance / timeDiff : 0;
    const direction = calculateBearing(lastLocation, newLocation);

    setMovement(prev => {
      const acceleration = (speed - prev.speed) / timeDiff;
      const totalDistance = prev.distance + distance;
      const allSpeeds = [...locationHistory.slice(-10).map((_, i, arr) => {
        if (i === 0) return 0;
        const prevLoc = arr[i - 1];
        const currLoc = arr[i];
        const dist = calculateDistance(prevLoc, currLoc);
        const time = (currLoc.timestamp - prevLoc.timestamp) / 1000 / 3600;
        return time > 0 ? dist / time : 0;
      }), speed].filter(s => s > 0);
      
      const averageSpeed = allSpeeds.length > 0 ? allSpeeds.reduce((a, b) => a + b, 0) / allSpeeds.length : 0;
      const maxSpeed = Math.max(prev.maxSpeed, speed);
      const isMoving = speed > 1; // Consideramos movimiento si > 1 km/h

      return {
        speed,
        direction,
        acceleration,
        distance: totalDistance,
        averageSpeed,
        maxSpeed,
        isMoving
      };
    });

    // Mantener solo las últimas 50 ubicaciones para performance
    setLocationHistory(prev => [...prev.slice(-49), newLocation]);
  }, [locationHistory, calculateDistance, calculateBearing]);

  // Predecir próximos puntos de acceso
  const predictAccessPoints = useCallback(() => {
    if (!currentLocation || !movement.isMoving) return [];

    return accessPointHistory
      .map(ap => {
        const distance = calculateDistance(currentLocation, ap.location);
        const eta = movement.speed > 0 ? (distance / movement.speed) * 60 : Infinity; // minutos
        
        // Score basado en frecuencia de encuentros y proximidad
        const frequencyScore = Math.min(100, ap.encounters * 10);
        const proximityScore = Math.max(0, 100 - distance * 50);
        const recentScore = Math.max(0, 100 - (Date.now() - ap.lastSeen) / 60000); // minutos
        
        const probability = (frequencyScore + proximityScore + recentScore) / 3;
        
        return {
          ...ap,
          distance,
          eta,
          probability,
          predictedSignal: Math.max(10, ap.averageSignal - distance * 20)
        };
      })
      .filter(ap => ap.probability > 20)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5); // Top 5 predicciones
  }, [currentLocation, movement, accessPointHistory, calculateDistance]);

  // Registrar encuentro con punto de acceso
  const recordAccessPoint = useCallback((id: string, name: string, signal: number) => {
    if (!currentLocation) return;

    setAccessPointHistory(prev => {
      const existing = prev.find(ap => ap.id === id);
      
      if (existing) {
        return prev.map(ap => ap.id === id ? {
          ...ap,
          encounters: ap.encounters + 1,
          lastSeen: Date.now(),
          averageSignal: (ap.averageSignal + signal) / 2,
          timeSpent: ap.timeSpent + 1
        } : ap);
      } else {
        return [...prev, {
          id,
          name,
          location: { ...currentLocation },
          encounters: 1,
          lastSeen: Date.now(),
          averageSignal: signal,
          timeSpent: 1
        }];
      }
    });
  }, [currentLocation]);

  // Iniciar tracking de ubicación
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        
        setCurrentLocation(newLocation);
        updateMovementMetrics(newLocation);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Simular ubicación para demo
        const mockLocation: LocationData = {
          lat: 19.4326 + (Math.random() - 0.5) * 0.01,
          lng: -99.1332 + (Math.random() - 0.5) * 0.01,
          accuracy: 10,
          timestamp: Date.now()
        };
        setCurrentLocation(mockLocation);
        updateMovementMetrics(mockLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [updateMovementMetrics]);

  // Detener tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  // Obtener estadísticas de movimiento
  const getMovementStats = useCallback(() => {
    const totalTime = locationHistory.length > 1 
      ? (locationHistory[locationHistory.length - 1].timestamp - locationHistory[0].timestamp) / 1000 / 3600
      : 0;
    
    return {
      totalDistance: movement.distance,
      totalTime,
      averageSpeed: movement.averageSpeed,
      maxSpeed: movement.maxSpeed,
      currentSpeed: movement.speed,
      isMoving: movement.isMoving,
      direction: movement.direction,
      acceleration: movement.acceleration,
      locationAccuracy: currentLocation?.accuracy || 0,
      trackingPoints: locationHistory.length,
      knownAccessPoints: accessPointHistory.length
    };
  }, [movement, currentLocation, locationHistory, accessPointHistory]);

  return {
    currentLocation,
    movement,
    accessPointHistory,
    isTracking,
    startTracking,
    stopTracking,
    recordAccessPoint,
    predictAccessPoints,
    getMovementStats
  };
};