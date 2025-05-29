import React, { useEffect, useState } from 'react';
import { useElements } from '../../contexts/ElementsContext';
import { DEFAULT_FORM_DATA, Element, ElementFormData, ElementType, TYPE_DISPLAY_NAMES } from '../../types';
import { toast } from 'react-hot-toast';
import { Check, Plus, X } from 'lucide-react';

interface ElementEditorProps {
  showAddForm: boolean;
  onCloseAddForm: () => void;
}

const ElementEditor: React.FC<ElementEditorProps> = ({ showAddForm, onCloseAddForm }) => {
  const { 
    selectedElement, 
    elements, 
    updateElement, 
    addElement 
  } = useElements();
  
  const [formData, setFormData] = useState<ElementFormData>(DEFAULT_FORM_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Update form data when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setFormData({
        id: selectedElement.id,
        type: selectedElement.type,
        title: selectedElement.title,
        parent: selectedElement.parent,
        next: selectedElement.next || [],
        next_ok: selectedElement.next_ok || '',
        next_ko: selectedElement.next_ko || '',
        usedoc: selectedElement.usedoc || false
      });
      setIsEditMode(true);
    } else if (showAddForm) {
      // When adding a new element, set the parent to the selected element's ID
      setFormData({
        ...DEFAULT_FORM_DATA,
        id: generateId(),
        parent: selectedElement?.id || null
      });
      setIsEditMode(false);
    }
  }, [selectedElement, showAddForm]);
  
  // Generate a new ID based on type
  const generateId = (): string => {
    const typePrefix = formData.type.substring(0, 4);
    const existingIds = elements
      .filter(el => el.type === formData.type)
      .map(el => el.id)
      .filter(id => id.startsWith(typePrefix))
      .map(id => {
        const numPart = id.replace(typePrefix, '');
        return isNaN(parseInt(numPart)) ? 0 : parseInt(numPart);
      });
    
    const maxId = existingIds.length ? Math.max(...existingIds) : 0;
    return `${typePrefix}${maxId + 1}`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'type' && value !== formData.type) {
      // If type changes, generate a new ID
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        id: typePrefix(value as ElementType) + Date.now().toString().slice(-5)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const typePrefix = (type: ElementType): string => {
    switch(type) {
      case 'categorie': return 'cat';
      case 'probleme': return 'prob';
      case 'etat': return 'etat';
      case 'verif': return 'verif';
      case 'action': return 'action';
      default: return 'item';
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }
      
      // Prepare element data
      const elementData: Element = {
        id: formData.id,
        type: formData.type,
        title: formData.title,
        parent: formData.parent
      };
      
      // Add optional fields based on type
      if (['etat'].includes(formData.type) && formData.next.length) {
        elementData.next = formData.next;
      }
      
      if (formData.type === 'verif') {
        if (formData.next_ok) elementData.next_ok = formData.next_ok;
        if (formData.next_ko) elementData.next_ko = formData.next_ko;
        if (formData.usedoc) elementData.usedoc = true;
      }
      
      if (formData.type === 'action') {
        if (formData.next && formData.next.length) elementData.next = formData.next;
        if (formData.usedoc) elementData.usedoc = true;
      }
      
      if (isEditMode) {
        updateElement(elementData);
      } else {
        addElement(elementData);
        onCloseAddForm();
      }
    } catch (error) {
      toast.error('Error saving element');
      console.error(error);
    }
  };
  
  // Get all potential parent elements (all elements except the current one and its descendants)
  const getPotentialParents = () => {
    // Function to get all descendant IDs of an element
    const getDescendantIds = (elementId: string): string[] => {
      const directChildren = elements.filter(el => el.parent === elementId);
      return [
        ...directChildren.map(child => child.id),
        ...directChildren.flatMap(child => getDescendantIds(child.id))
      ];
    };
    
    const excludeIds = isEditMode ? [formData.id, ...getDescendantIds(formData.id)] : [];
    
    return elements.filter(el => !excludeIds.includes(el.id));
  };
  
  const potentialParents = getPotentialParents();
  const showForm = isEditMode || showAddForm;
  
  if (!showForm) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <div className="mb-4">
          <Plus size={48} className="mx-auto opacity-20" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Element Selected</h2>
        <p className="max-w-md">
          Select an element from the tree view to edit its properties, or click the "+" button to create a new element.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Element' : 'Add New Element'}
          </h2>
          {!isEditMode && (
            <button 
              onClick={onCloseAddForm}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ID Field */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isEditMode}
              />
            </div>
            
            {/* Type Field */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isEditMode}
              >
                {Object.entries(TYPE_DISPLAY_NAMES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Title Field */}
          <div className="form-group mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={2}
            />
          </div>
          
          {/* Parent Field */}
          <div className="form-group mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
            <select
              name="parent"
              value={formData.parent || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">None (Root Element)</option>
              {potentialParents.map(el => (
                <option key={el.id} value={el.id}>
                  {el.title.length > 40 ? el.title.substring(0, 40) + '...' : el.title} ({el.id})
                </option>
              ))}
            </select>
          </div>
          
          {/* Type-specific fields */}
          {formData.type === 'etat' && (
            <div className="form-group mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Elements</label>
              <select
                multiple
                name="next"
                value={formData.next}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, next: selectedOptions }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                size={4}
              >
                {elements.map(el => (
                  <option key={el.id} value={el.id}>
                    {el.title.length > 40 ? el.title.substring(0, 40) + '...' : el.title} ({el.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple elements</p>
            </div>
          )}
          
          {formData.type === 'verif' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next if OK</label>
                  <select
                    name="next_ok"
                    value={formData.next_ok || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select element</option>
                    {elements.map(el => (
                      <option key={el.id} value={el.id}>
                        {el.title.length > 30 ? el.title.substring(0, 30) + '...' : el.title} ({el.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next if KO</label>
                  <select
                    name="next_ko"
                    value={formData.next_ko || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select element</option>
                    {elements.map(el => (
                      <option key={el.id} value={el.id}>
                        {el.title.length > 30 ? el.title.substring(0, 30) + '...' : el.title} ({el.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="usedoc"
                    checked={formData.usedoc}
                    onChange={(e) => setFormData(prev => ({ ...prev, usedoc: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires documentation</span>
                </label>
              </div>
            </>
          )}
          
          {formData.type === 'action' && (
            <>
              <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Elements</label>
                <select
                  multiple
                  name="next"
                  value={formData.next}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, next: selectedOptions }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  size={4}
                >
                  {elements.map(el => (
                    <option key={el.id} value={el.id}>
                      {el.title.length > 40 ? el.title.substring(0, 40) + '...' : el.title} ({el.id})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple elements</p>
              </div>
              
              <div className="form-group mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="usedoc"
                    checked={formData.usedoc}
                    onChange={(e) => setFormData(prev => ({ ...prev, usedoc: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires documentation</span>
                </label>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={() => setFormData(DEFAULT_FORM_DATA)}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              {isEditMode ? 'Update Element' : 'Create Element'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElementEditor;