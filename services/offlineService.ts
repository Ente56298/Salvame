class OfflineService {
  private isOnline = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  getStatus(): boolean {
    return this.isOnline;
  }

  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  // Cache management for offline functionality
  async cacheResource(url: string, data: any): Promise<void> {
    try {
      localStorage.setItem(`cache_${url}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache resource:', error);
    }
  }

  getCachedResource(url: string, maxAge = 3600000): any | null {
    try {
      const cached = localStorage.getItem(`cache_${url}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`cache_${url}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }
}

export const offlineService = new OfflineService();