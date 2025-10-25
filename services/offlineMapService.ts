export interface MapRegion {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  zoomLevels: number[];
  downloadedAt: Date;
  size: number; // in MB
}

class OfflineMapService {
  private dbName = 'offline_maps';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('tiles')) {
          db.createObjectStore('tiles', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('regions')) {
          db.createObjectStore('regions', { keyPath: 'id' });
        }
      };
    });
  }

  async downloadRegion(region: MapRegion, onProgress?: (progress: number) => void): Promise<void> {
    if (!this.db) await this.initDB();
    
    const tiles: string[] = [];
    const { bounds, zoomLevels } = region;
    
    // Calculate tiles needed
    zoomLevels.forEach(zoom => {
      const minTileX = Math.floor((bounds.west + 180) / 360 * Math.pow(2, zoom));
      const maxTileX = Math.floor((bounds.east + 180) / 360 * Math.pow(2, zoom));
      const minTileY = Math.floor((1 - Math.log(Math.tan(bounds.north * Math.PI / 180) + 1 / Math.cos(bounds.north * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
      const maxTileY = Math.floor((1 - Math.log(Math.tan(bounds.south * Math.PI / 180) + 1 / Math.cos(bounds.south * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
      
      for (let x = minTileX; x <= maxTileX; x++) {
        for (let y = minTileY; y <= maxTileY; y++) {
          tiles.push(`${zoom}/${x}/${y}`);
        }
      }
    });

    // Download tiles
    let downloaded = 0;
    const total = tiles.length;
    
    for (const tileKey of tiles) {
      try {
        const url = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/${tileKey}?access_token=${process.env.MAPBOX_TOKEN}`;
        const response = await fetch(url);
        const blob = await response.blob();
        
        await this.storeTile(tileKey, blob);
        downloaded++;
        onProgress?.(downloaded / total);
      } catch (error) {
        console.warn(`Failed to download tile ${tileKey}:`, error);
      }
    }

    // Store region info
    await this.storeRegion({
      ...region,
      downloadedAt: new Date(),
      size: Math.round(downloaded * 0.02) // Estimate 20KB per tile
    });
  }

  private async storeTile(key: string, blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      const request = store.put({ key, data: blob });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async storeRegion(region: MapRegion): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readwrite');
      const store = transaction.objectStore('regions');
      const request = store.put(region);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDownloadedRegions(): Promise<MapRegion[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['regions'], 'readonly');
      const store = transaction.objectStore('regions');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTile(key: string): Promise<Blob | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tiles'], 'readonly');
      const store = transaction.objectStore('tiles');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRegion(regionId: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction(['regions', 'tiles'], 'readwrite');
    const regionsStore = transaction.objectStore('regions');
    const tilesStore = transaction.objectStore('tiles');
    
    // Delete region
    regionsStore.delete(regionId);
    
    // Delete associated tiles (simplified - in production, track which tiles belong to which region)
    const request = tilesStore.clear();
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineMapService = new OfflineMapService();