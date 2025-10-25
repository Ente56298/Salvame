import { useState, useEffect } from 'react';

interface SearchItem {
  id: string;
  query: string;
  type: 'parts' | 'services';
  timestamp: number;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addSearch = (query: string, type: 'parts' | 'services') => {
    if (!query.trim()) return;

    const newSearch: SearchItem = {
      id: Date.now().toString(),
      query: query.trim(),
      type,
      timestamp: Date.now()
    };

    setSearchHistory(prev => {
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase() || item.type !== type
      );
      
      return [newSearch, ...filtered].slice(0, 5);
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const getHistoryByType = (type: 'parts' | 'services') => {
    return searchHistory.filter(item => item.type === type);
  };

  return {
    searchHistory,
    addSearch,
    clearHistory,
    getHistoryByType
  };
};