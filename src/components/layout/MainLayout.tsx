import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus, Search } from 'lucide-react';
import Header from './Header';
import TreeView from '../tree/TreeView';
import ElementEditor from '../editor/ElementEditor';
import SearchResults from '../search/SearchResults';
import { useElements } from '../../contexts/ElementsContext';

const MainLayout: React.FC = () => {
  const { exportJson, searchElements, setSelectedElement } = useElements();
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchElements(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddClick = () => {
    setSelectedElement(null); // Clear any selected element
    setShowAddForm(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with tree view */}
        <div 
          className={`flex flex-col border-r border-gray-200 transition-all duration-300 ${
            showSidebar ? 'w-1/3 md:w-1/4' : 'w-0'
          }`}
        >
          {showSidebar && (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Structure</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddClick}
                    className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Add new element"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={exportJson}
                    className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                    title="Export JSON"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search elements..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-2">
                {searchQuery ? (
                  <SearchResults results={searchResults} onClear={() => setSearchQuery('')} />
                ) : (
                  <TreeView />
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Toggle sidebar button */}
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-1 rounded-r-md border border-l-0 border-gray-200 shadow-md"
        >
          {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {/* Main content area with element editor */}
        <div className={`flex-1 overflow-auto transition-all duration-300 ${showSidebar ? 'ml-0' : 'ml-8'}`}>
          <ElementEditor showAddForm={showAddForm} onCloseAddForm={() => setShowAddForm(false)} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;