import React, { useState, useEffect } from 'react';

interface RouterProps {
  children: React.ReactNode;
}

export type Route = 'dashboard' | 'profile' | 'assistance' | 'partners' | 'admin' | 'evaluation';

export const Router: React.FC<RouterProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    const hash = window.location.hash.slice(1) as Route;
    return ['dashboard', 'profile', 'assistance', 'partners', 'admin', 'evaluation'].includes(hash) 
      ? hash 
      : 'dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Route;
      if (['dashboard', 'profile', 'assistance', 'partners', 'admin', 'evaluation'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: Route) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const RouterContext = React.createContext<{
  currentRoute: Route;
  navigate: (route: Route) => void;
}>({
  currentRoute: 'dashboard',
  navigate: () => {}
});

export const useRouter = () => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
};