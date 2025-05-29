import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus, Search, Save, Layout, FileEdit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from './Header';
import TreeView from '../tree/TreeView';
import ElementEditor from '../editor/ElementEditor';
import SearchResults from '../search/SearchResults';
import GraphView from '../graph/GraphView';
import { useElements } from '../../contexts/ElementsContext';

const MainLayout: React.FC = () => {
  const { exportJson, searchElements, setSelectedElement, selectedElement, elements } = useElements();
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'editor' | 'graph'>('editor');

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
    setAddParentId(selectedElement?.id || null);
    setSelectedElement(null);
    setShowAddForm(true);
  };

  const handleManualSave = () => {
    localStorage.setItem('elementsData', JSON.stringify(elements));
    toast.success('Structure sauvegardée !');
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
                    onClick={handleManualSave}
                    className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                    title="Sauvegarder la structure"
                  >
                    <Save size={18} />
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
        
        {/* Main content area with tabs */}
        <div className={`flex-1 overflow-auto transition-all duration-300 ${showSidebar ? 'ml-0' : 'ml-8'}`}>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveView('editor')}
                className={`px-4 py-2 flex items-center gap-2 ${
                  activeView === 'editor'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileEdit size={18} />
                Éditeur
              </button>
              <button
                onClick={() => setActiveView('graph')}
                className={`px-4 py-2 flex items-center gap-2 ${
                  activeView === 'graph'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layout size={18} />
                Vue Graphique
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-8rem)]">
            {activeView === 'editor' ? (
              <ElementEditor showAddForm={showAddForm} onCloseAddForm={() => setShowAddForm(false)} addParentId={addParentId} />
            ) : (
              <GraphView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;