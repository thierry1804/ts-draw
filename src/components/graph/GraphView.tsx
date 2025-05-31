import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  NodeProps,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useElements } from '../../contexts/ElementsContext';
import { Element, TYPE_DISPLAY_NAMES } from '../../types';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 70;
const nodeSep = 80; // Espace horizontal entre nœuds
const rankSep = 100; // Espace vertical entre niveaux

// Mapping local pour les couleurs hexadécimales adaptées au graph
const GRAPH_TYPE_COLORS: Record<string, string> = {
  categorie: '#3b82f6', // blue-500
  probleme: '#a21caf',  // purple-700
  etat: '#f59e42',      // amber-500
  verif: '#22c55e',     // green-500
  action: '#ef4444',    // red-500
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: nodeSep, ranksep: rankSep });

  // Clear the graph
  dagreGraph.nodes().forEach(node => dagreGraph.removeNode(node));
  dagreGraph.edges().forEach(edge => dagreGraph.removeEdge(edge));

  // Add nodes to the graph
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Get the layouted nodes
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Node personnalisé pour afficher le label et le type
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div style={{
      background: GRAPH_TYPE_COLORS[data.type] || '#333',
      color: '#fff',
      borderRadius: 8,
      padding: 10,
      minWidth: 180,
      boxShadow: '0 2px 8px #0002',
      border: '2px solid #fff',
      fontSize: 14,
      textAlign: 'center',
      wordBreak: 'break-word',
      lineHeight: 1.3,
    }}>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555' }}
      />
      <div style={{ fontWeight: 'bold', marginBottom: 2, fontSize: 13 }}>{TYPE_DISPLAY_NAMES[data.type] || data.type}</div>
      <div style={{ fontSize: 13 }}>{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Récupère tous les descendants d'un nœud (par next, next_ok, next_ko)
function getSubgraphElements(elements: Element[], startId: string): Element[] {
  const visited = new Set<string>();
  const result: Element[] = [];
  function dfs(id: string) {
    if (visited.has(id)) return;
    const el = elements.find(e => e.id === id);
    if (!el) return;
    visited.add(id);
    result.push(el);
    if (el.next) el.next.forEach(dfs);
    if (el.next_ok) dfs(el.next_ok);
    if (el.next_ko) dfs(el.next_ko);
  }
  dfs(startId);
  return result;
}

const GraphView: React.FC = () => {
  const { elements, selectedElement } = useElements();

  // Détermine la racine du sous-graphe à afficher
  const rootId = selectedElement?.id;
  const subElements = rootId
    ? getSubgraphElements(elements, rootId)
    : [];
  const subIds = new Set(subElements.map(e => e.id));

  // Convertir les éléments en nœuds et arêtes pour ReactFlow
  const initialNodes: Node[] = subElements.map(element => ({
    id: element.id,
    type: 'custom',
    data: {
      label: element.title,
      type: element.type
    },
    position: { x: 0, y: 0 },
    style: {
      background: GRAPH_TYPE_COLORS[element.type as keyof typeof GRAPH_TYPE_COLORS],
      color: '#fff',
      padding: 10,
      borderRadius: 8,
      width: nodeWidth,
      height: nodeHeight,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  const initialEdges: Edge[] = subElements.flatMap(element => {
    const edges: Edge[] = [];
    if (element.next) {
      element.next.forEach(nextId => {
        if (subIds.has(nextId)) {
          edges.push({
            id: `${element.id}-${nextId}`,
            source: element.id,
            target: nextId,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            animated: true,
            style: { stroke: '#555', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#555',
            },
          });
        }
      });
    }
    if (element.next_ok && subIds.has(element.next_ok)) {
      edges.push({
        id: `${element.id}-ok-${element.next_ok}`,
        source: element.id,
        target: element.next_ok,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        label: 'OK',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          width: 20,
          height: 20,
          color: '#22c55e',
        },
      });
    }
    if (element.next_ko && subIds.has(element.next_ko)) {
      edges.push({
        id: `${element.id}-ko-${element.next_ko}`,
        source: element.id,
        target: element.next_ko,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        label: 'KO',
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          width: 20,
          height: 20,
          color: '#ef4444',
        },
      });
    }
    return edges;
  });
  console.log('EDGES GENERATED FOR GRAPH:', initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!rootId) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [elements, rootId]);

  if (!rootId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Sélectionnez un nœud dans l'arbre pour afficher le graphe.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default GraphView; 