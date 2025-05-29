import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import ElementsProvider from './contexts/ElementsContext';
import './App.css';

function App() {
  return (
    <ElementsProvider>
      <div className="app-container min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <MainLayout />
        <Toaster position="bottom-right" />
      </div>
    </ElementsProvider>
  );
}

export default App;