import React, { useState } from 'react';
import { ChevronRight, Trash2, Plus } from 'lucide-react';
import { useElements } from '../../contexts/ElementsContext';
import { TreeNode, TYPE_COLORS } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const TreeView: React.FC = () => {
  const { getTreeData } = useElements();
  const treeData = getTreeData();
  
  return (
    <div className="tree-view">
      {treeData.map(node => (
        <TreeNodeComponent key={node.element.id} node={node} level={0} />
      ))}
    </div>
  );
};

interface TreeNodeProps {
  node: TreeNode;
  level: number;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, level }) => {
  const { element, children } = node;
  const { selectedElement, setSelectedElement, deleteElement, moveElement } = useElements();
  const [expanded, setExpanded] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const isSelected = selectedElement?.id === element.id;
  const hasChildren = children.length > 0;
  const typeColor = TYPE_COLORS[element.type] || 'bg-gray-500';
  
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element);
  };
  
  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    deleteElement(element.id);
    setShowConfirmModal(false);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', element.id);
    setDragging(true);
  };
  
  const handleDragEnd = () => {
    setDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== element.id) {
      moveElement(draggedId, element.id);
    }
  };
  
  return (
    <div className="tree-node">
      <div 
        className={`node-item flex items-center p-1.5 mb-1 ${isSelected ? 'selected' : ''} ${dragOver ? 'drag-over' : ''}`}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={handleSelect}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`w-3 h-3 rounded-full ${typeColor} mr-2`}></div>
        
        {hasChildren ? (
          <button 
            className={`expand-icon mr-1 ${expanded ? 'expanded' : ''}`}
            onClick={handleExpandToggle}
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="w-4 mr-1"></div>
        )}
        
        <div className="flex-1 truncate text-sm">{element.title}</div>
        
        <button 
          className="delete-button p-1 text-gray-500 hover:text-red-500 transition-colors"
          onClick={handleDelete}
          title="Delete element and its children"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {expanded && hasChildren && (
        <div className="children-container">
          {children.map(childNode => (
            <TreeNodeComponent key={childNode.element.id} node={childNode} level={level + 1} />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer "${element.title}" et tous ses enfants ?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default TreeView;