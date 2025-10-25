export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category: 'home' | 'work' | 'custom';
  createdAt: Date;
}

class FavoritesService {
  private storageKey = 'favorite_locations';

  getFavorites(): FavoriteLocation[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addFavorite(location: Omit<FavoriteLocation, 'id' | 'createdAt'>): FavoriteLocation {
    const favorite: FavoriteLocation = {
      ...location,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const favorites = this.getFavorites();
    favorites.push(favorite);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    
    return favorite;
  }

  removeFavorite(id: string): void {
    const favorites = this.getFavorites().filter(f => f.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}

export const favoritesService = new FavoritesService();