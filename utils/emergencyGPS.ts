// Emergency GPS optimized for <3s response time
export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export class EmergencyGPS {
  private cachedLocation: LocationData | null = null;
  private lastUpdate: number | null = null;
  private readonly CACHE_DURATION = 30000; // 30s cache
  private readonly GPS_TIMEOUT = 3000; // 3s max timeout

  async getLocationFast(): Promise<LocationData> {
    // Use cached location if recent and accurate
    if (this.cachedLocation && 
        this.lastUpdate && 
        Date.now() - this.lastUpdate < this.CACHE_DURATION) {
      return this.cachedLocation;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('GPS timeout - using fallback'));
      }, this.GPS_TIMEOUT);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          
          this.cachedLocation = location;
          this.lastUpdate = Date.now();
          
          resolve(location);
        },
        (error) => {
          clearTimeout(timeout);
          
          // Try cached location as fallback
          if (this.cachedLocation) {
            resolve(this.cachedLocation);
          } else {
            reject(error);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 2500, // Slightly less than our timeout
          maximumAge: 30000 // Accept 30s old location
        }
      );
    });
  }

  // Preload location for faster SOS
  async preloadLocation(): Promise<void> {
    try {
      await this.getLocationFast();
    } catch (error) {
      console.warn('Failed to preload location:', error);
    }
  }

  // Get last known location immediately
  getLastKnownLocation(): LocationData | null {
    return this.cachedLocation;
  }
}

// SOS Handler with optimized GPS
export class SOSHandler {
  private emergencyGPS: EmergencyGPS;

  constructor() {
    this.emergencyGPS = new EmergencyGPS();
    // Preload location on app start
    this.emergencyGPS.preloadLocation();
  }

  async handleSOS(): Promise<void> {
    try {
      // Get location fast (<3s)
      const location = await this.emergencyGPS.getLocationFast();
      
      // Send emergency alert
      await this.sendEmergencyAlert(location);
      
      // Notify emergency contacts
      await this.notifyContacts(location);
      
      // Show confirmation
      this.showSOSConfirmation(location);
      
    } catch (error) {
      // Fallback with last known location
      await this.handleSOSFallback();
    }
  }

  private async sendEmergencyAlert(location: LocationData): Promise<void> {
    // Send to emergency services
    const alertData = {
      type: 'EMERGENCY_SOS',
      location: location,
      timestamp: new Date().toISOString(),
      user_id: localStorage.getItem('user_id'),
      vehicle: JSON.parse(localStorage.getItem('vehicle_profile') || '{}')
    };

    // Simulate emergency service notification
    console.log('🚨 EMERGENCY ALERT SENT:', alertData);
  }

  private async notifyContacts(location: LocationData): Promise<void> {
    const contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
    
    contacts.forEach((contact: any) => {
      // Simulate SMS/notification
      console.log(`📱 Notifying ${contact.name}: Emergency at ${location.lat}, ${location.lng}`);
    });
  }

  private showSOSConfirmation(location: LocationData): void {
    // Show confirmation modal
    const event = new CustomEvent('sos-confirmed', {
      detail: { location, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  private async handleSOSFallback(): Promise<void> {
    // Use last known location or ask user
    const lastLocation = this.emergencyGPS.getLastKnownLocation();
    
    if (lastLocation) {
      await this.sendEmergencyAlert(lastLocation);
      this.showSOSConfirmation(lastLocation);
    } else {
      // Manual location input
      const event = new CustomEvent('sos-manual-location');
      window.dispatchEvent(event);
    }
  }
}