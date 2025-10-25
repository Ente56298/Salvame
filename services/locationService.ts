export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
}

export class LocationService {
  private watchId: number | null = null;
  private currentLocation: LocationData | null = null;

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            speed: position.coords.speed || undefined
          };
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          reject(this.getLocationError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  startWatching(callback: (location: LocationData) => void, errorCallback?: (error: Error) => void): void {
    if (!navigator.geolocation) {
      errorCallback?.(new Error('Geolocalización no soportada'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
          speed: position.coords.speed || undefined
        };
        this.currentLocation = location;
        callback(location);
      },
      (error) => {
        errorCallback?.(this.getLocationError(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }

  private getLocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Permisos de ubicación denegados');
      case error.POSITION_UNAVAILABLE:
        return new Error('Ubicación no disponible');
      case error.TIMEOUT:
        return new Error('Tiempo de espera agotado');
      default:
        return new Error('Error desconocido de geolocalización');
    }
  }
}

export const locationService = new LocationService();