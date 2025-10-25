export interface TrackingPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number;
  heading?: number;
  accuracy: number;
}

export interface Trip {
  id: string;
  startTime: Date;
  endTime?: Date;
  points: TrackingPoint[];
  distance: number;
  duration: number;
  status: 'active' | 'completed' | 'paused';
}

class TrackingService {
  private currentTrip: Trip | null = null;
  private watchId: number | null = null;
  private lastPoint: TrackingPoint | null = null;

  startTrip(): Trip {
    const trip: Trip = {
      id: Date.now().toString(),
      startTime: new Date(),
      points: [],
      distance: 0,
      duration: 0,
      status: 'active'
    };
    
    this.currentTrip = trip;
    this.startTracking();
    return trip;
  }

  private startTracking(): void {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!this.currentTrip) return;

        const point: TrackingPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
          accuracy: position.coords.accuracy
        };

        // Calculate distance from last point
        if (this.lastPoint) {
          const distance = this.calculateDistance(this.lastPoint, point);
          this.currentTrip.distance += distance;
        }

        this.currentTrip.points.push(point);
        this.currentTrip.duration = Date.now() - this.currentTrip.startTime.getTime();
        this.lastPoint = point;

        // Save to localStorage periodically
        if (this.currentTrip.points.length % 10 === 0) {
          this.saveTrip(this.currentTrip);
        }
      },
      (error) => console.error('Tracking error:', error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );
  }

  stopTrip(): Trip | null {
    if (!this.currentTrip) return null;

    this.currentTrip.endTime = new Date();
    this.currentTrip.status = 'completed';
    
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    this.saveTrip(this.currentTrip);
    const completedTrip = this.currentTrip;
    this.currentTrip = null;
    this.lastPoint = null;

    return completedTrip;
  }

  getCurrentTrip(): Trip | null {
    return this.currentTrip;
  }

  private calculateDistance(point1: TrackingPoint, point2: TrackingPoint): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private saveTrip(trip: Trip): void {
    const trips = this.getTrips();
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.push(trip);
    }
    
    localStorage.setItem('tracking_trips', JSON.stringify(trips));
  }

  getTrips(): Trip[] {
    try {
      const stored = localStorage.getItem('tracking_trips');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export const trackingService = new TrackingService();