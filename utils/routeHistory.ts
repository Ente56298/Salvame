export interface RouteHistory {
    id: string;
    date: string;
    time: string;
    startLocation: {
        lat: number;
        lon: number;
        address: string;
    };
    endLocation: {
        lat: number;
        lon: number;
        address: string;
    };
    mechanic: {
        name: string;
        rating: number;
        service: string;
    };
    duration: string;
    cost: string;
    status: 'completed' | 'cancelled';
}

export const saveRouteToHistory = (route: Omit<RouteHistory, 'id'>) => {
    const routes = getRouteHistory();
    const newRoute: RouteHistory = {
        ...route,
        id: Date.now().toString()
    };
    
    routes.unshift(newRoute);
    
    // Keep only last 50 routes
    const limitedRoutes = routes.slice(0, 50);
    
    localStorage.setItem('routeHistory', JSON.stringify(limitedRoutes));
    return newRoute;
};

export const getRouteHistory = (): RouteHistory[] => {
    try {
        const stored = localStorage.getItem('routeHistory');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const clearRouteHistory = () => {
    localStorage.removeItem('routeHistory');
};

export const deleteRoute = (id: string) => {
    const routes = getRouteHistory();
    const filtered = routes.filter(route => route.id !== id);
    localStorage.setItem('routeHistory', JSON.stringify(filtered));
};