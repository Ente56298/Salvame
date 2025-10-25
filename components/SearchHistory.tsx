import React from 'react';
import { useSearchHistory } from '../hooks/useSearchHistory';

interface SearchHistoryProps {
  type: 'parts' | 'services';
  onSelectSearch: (query: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ type, onSelectSearch }) => {
  const { getHistoryByType, clearHistory } = useSearchHistory();
  const history = getHistoryByType(type);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Búsquedas Recientes</h3>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Limpiar
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSearch(item.query)}
            className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
          >
            {item.query}
          </button>
        ))}
      </div>
    </div>
  );
};