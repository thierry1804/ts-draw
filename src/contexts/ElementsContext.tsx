import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Element, ElementsData, ElementType, TreeNode } from '../types';
import sampleData from '../data/sampleData';

interface ElementsContextProps {
  elements: Element[];
  addElement: (element: Element) => void;
  updateElement: (element: Element) => void;
  deleteElement: (id: string) => void;
  getElement: (id: string) => Element | undefined;
  getElementChildren: (id: string | null) => Element[];
  selectedElement: Element | null;
  setSelectedElement: (element: Element | null) => void;
  getTreeData: () => TreeNode[];
  exportJson: () => void;
  moveElement: (elementId: string, newParentId: string | null) => void;
  searchElements: (query: string) => Element[];
}

const ElementsContext = createContext<ElementsContextProps | undefined>(undefined);

export const useElements = () => {
  const context = useContext(ElementsContext);
  if (!context) {
    throw new Error('useElements must be used within an ElementsProvider');
  }
  return context;
};

interface ElementsProviderProps {
  children: ReactNode;
}

const ElementsProvider: React.FC<ElementsProviderProps> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>(() => {
    const saved = localStorage.getItem('elementsData');
    return saved ? JSON.parse(saved) : sampleData.elements;
  });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  // Sauvegarde automatique dans le localStorage à chaque modification
  React.useEffect(() => {
    localStorage.setItem('elementsData', JSON.stringify(elements));
  }, [elements]);

  // Add new element
  const addElement = (element: Element) => {
    // Generate a unique ID if not provided
    if (!element.id) {
      element.id = `${element.type}${Date.now()}`;
    }
    
    setElements([...elements, element]);
    toast.success('Element added successfully');
  };

  // Update existing element
  const updateElement = (updatedElement: Element) => {
    const index = elements.findIndex(el => el.id === updatedElement.id);
    if (index !== -1) {
      const newElements = [...elements];
      newElements[index] = updatedElement;
      setElements(newElements);
      if (selectedElement?.id === updatedElement.id) {
        setSelectedElement(updatedElement);
      }
      toast.success('Element updated successfully');
    }
  };

  // Delete element and its children
  const deleteElement = (id: string) => {
    // Find element to be deleted
    const elementToDelete = elements.find(el => el.id === id);
    if (!elementToDelete) return;

    // Get all children ids recursively
    const getChildrenIds = (parentId: string): string[] => {
      const directChildren = elements.filter(el => el.parent === parentId);
      return [
        ...directChildren.map(child => child.id),
        ...directChildren.flatMap(child => getChildrenIds(child.id))
      ];
    };

    const childrenIds = getChildrenIds(id);
    const idsToDelete = [id, ...childrenIds];

    // Filter out the elements to be deleted
    const newElements = elements.filter(el => !idsToDelete.includes(el.id));
    
    // Update references in remaining elements
    const updatedElements = newElements.map(el => {
      const updatedEl = { ...el };
      
      // Update next references
      if (updatedEl.next) {
        updatedEl.next = updatedEl.next.filter(nextId => !idsToDelete.includes(nextId));
      }
      
      // Update next_ok and next_ko references
      if (updatedEl.next_ok && idsToDelete.includes(updatedEl.next_ok)) {
        delete updatedEl.next_ok;
      }
      
      if (updatedEl.next_ko && idsToDelete.includes(updatedEl.next_ko)) {
        delete updatedEl.next_ko;
      }
      
      return updatedEl;
    });

    setElements(updatedElements);
    
    // If the selected element is being deleted, deselect it
    if (selectedElement && idsToDelete.includes(selectedElement.id)) {
      setSelectedElement(null);
    }

    toast.success('Element and its children deleted successfully');
  };

  // Get element by ID
  const getElement = (id: string) => {
    return elements.find(el => el.id === id);
  };

  // Get direct children of an element
  const getElementChildren = (parentId: string | null) => {
    return elements.filter(el => el.parent === parentId);
  };

  // Convert flat structure to tree structure
  const buildTree = (parentId: string | null): TreeNode[] => {
    const children = getElementChildren(parentId);
    return children.map(child => ({
      element: child,
      children: buildTree(child.id)
    }));
  };

  // Get tree data for rendering
  const getTreeData = (): TreeNode[] => {
    return buildTree(null);
  };

  // Export JSON data
  const exportJson = () => {
    const data: ElementsData = { elements };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'troubleshooting-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON data exported successfully');
  };

  // Move element to a new parent
  const moveElement = (elementId: string, newParentId: string | null) => {
    // Prevent moving an element to its own descendant
    if (newParentId) {
      let currentParent = newParentId;
      while (currentParent) {
        if (currentParent === elementId) {
          toast.error("Cannot move an element to its own descendant");
          return;
        }
        const parent = elements.find(el => el.id === currentParent);
        currentParent = parent?.parent || null;
      }
    }

    const updatedElements = elements.map(el => {
      if (el.id === elementId) {
        return { ...el, parent: newParentId };
      }
      return el;
    });

    setElements(updatedElements);
    toast.success('Element moved successfully');
  };

  // Search elements by title
  const searchElements = (query: string): Element[] => {
    if (!query.trim()) return [];
    const lowercaseQuery = query.toLowerCase();
    return elements.filter(el => 
      el.title.toLowerCase().includes(lowercaseQuery) || 
      el.id.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <ElementsContext.Provider
      value={{
        elements,
        addElement,
        updateElement,
        deleteElement,
        getElement,
        getElementChildren,
        selectedElement,
        setSelectedElement,
        getTreeData,
        exportJson,
        moveElement,
        searchElements
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};

export default ElementsProvider;