import React from 'react';
import { X } from 'lucide-react';
import { useElements } from '../../contexts/ElementsContext';
import { Element, TYPE_COLORS } from '../../types';

interface SearchResultsProps {
  results: Element[];
  onClear: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onClear }) => {
  const { setSelectedElement } = useElements();
  
  const handleSelectResult = (element: Element) => {
    setSelectedElement(element);
    onClear();
  };
  
  return (
    <div className="search-results">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Search Results ({results.length})</h3>
        <button 
          onClick={onClear}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          title="Clear search"
        >
          <X size={14} />
        </button>
      </div>
      
      {results.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No results found</div>
      ) : (
        <div className="space-y-2">
          {results.map(element => {
            const typeColor = TYPE_COLORS[element.type] || 'bg-gray-500';
            
            return (
              <div 
                key={element.id}
                className="p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectResult(element)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${typeColor}`}></div>
                  <span className="text-xs text-gray-500">{element.type}</span>
                  <span className="text-xs text-gray-400">({element.id})</span>
                </div>
                <div className="text-sm font-medium text-gray-800 line-clamp-2">
                  {element.title}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;