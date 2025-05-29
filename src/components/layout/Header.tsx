import React from 'react';
import { HardDriveDownload, Settings, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HardDriveDownload size={24} />
          <h1 className="text-xl font-bold">Troubleshooting Editor</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-blue-700 transition-colors" title="Settings">
            <Settings size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-blue-700 transition-colors" title="Help">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;