import { useRef, useState, useCallback } from 'react';
import { WorkflowNode } from './WorkflowNode';
import type { WorkflowNode as WorkflowNodeType, NodeType } from '../../types';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeType[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateNodePosition: (id: string, position: { x: number; y: number }) => void;
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
}

export function WorkflowCanvas({
  nodes,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onAddNode,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((s) => Math.min(Math.max(0.25, s * delta), 2));
    } else {
      setOffset((o) => ({
        x: o.x - e.deltaX,
        y: o.y - e.deltaY,
      }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    } else if (e.target === canvasRef.current) {
      onSelectNode(null);
    }
  }, [offset, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && panStart.current) {
      const deltaX = e.clientX - panStart.current.x;
      const deltaY = e.clientY - panStart.current.y;
      setOffset({
        x: panStart.current.offsetX + deltaX,
        y: panStart.current.offsetY + deltaY,
      });
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
      if (nodeType && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - offset.x) / scale - 100;
        const y = (e.clientY - rect.top - offset.y) / scale - 40;
        onAddNode(nodeType, { x: Math.max(0, x), y: Math.max(0, y) });
      }
    },
    [offset, scale, onAddNode]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(
    (id: string, position: { x: number; y: number }) => {
      onUpdateNodePosition(id, position);
    },
    [onUpdateNodePosition]
  );

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative canvas-grid cursor-default"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {nodes.length > 1 &&
          nodes.slice(0, -1).map((node, i) => {
            const nextNode = nodes[i + 1];
            const x1 = node.position.x + 200;
            const y1 = node.position.y + 40;
            const x2 = nextNode.position.x;
            const y2 = nextNode.position.y + 40;
            const midX = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            return (
              <g key={`edge-${node.id}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth="2"
                  className="connector-line"
                />
                <path
                  d={path}
                  fill="none"
                  stroke="url(#edge-gradient)"
                  strokeWidth="2"
                  strokeDasharray="6, 6"
                  className="animate-flow"
                />
              </g>
            );
          })}
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
      >
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            id={node.id}
            type={node.type}
            name={node.name}
            position={node.position}
            selected={selectedNodeId === node.id}
            onSelect={() => onSelectNode(node.id)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 glass rounded-lg p-2">
        <button
          onClick={() => setScale((s) => Math.max(0.25, s * 0.9))}
          className="p-1.5 rounded hover:bg-dark-700/50 text-dark-400 hover:text-dark-100 transition-colors text-sm"
        >
          -
        </button>
        <span className="text-xs text-dark-400 font-mono w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(2, s * 1.1))}
          className="p-1.5 rounded hover:bg-dark-700/50 text-dark-400 hover:text-dark-100 transition-colors text-sm"
        >
          +
        </button>
        <div className="w-px h-4 bg-dark-700" />
        <button
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="px-2 py-1 rounded hover:bg-dark-700/50 text-dark-400 hover:text-dark-100 transition-colors text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
