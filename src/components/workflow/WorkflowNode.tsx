import { useState, useRef, useCallback } from 'react';
import {
  Zap,
  Play,
  Bot,
  GitBranch,
  Repeat,
  Clock,
  Globe,
  Database,
  Webhook,
  GripVertical,
  MoreHorizontal,
} from 'lucide-react';
import type { NodeType } from '../../types';

interface WorkflowNodeProps {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: (id: string, position: { x: number; y: number }) => void;
  onDrag?: (id: string, position: { x: number; y: number }) => void;
  onDragEnd?: (id: string, position: { x: number; y: number }) => void;
}

const nodeConfig: Record<NodeType, { icon: React.ElementType; label: string; colorClass: string; borderClass: string }> = {
  trigger: { icon: Zap, label: 'Trigger', colorClass: 'from-amber-500/20 to-orange-500/20', borderClass: 'border-orange-500/40' },
  action: { icon: Play, label: 'Action', colorClass: 'from-phoenix-cyan-500/20 to-blue-500/20', borderClass: 'border-phoenix-cyan-500/40' },
  ai: { icon: Bot, label: 'AI Agent', colorClass: 'from-phoenix-purple-500/20 to-pink-500/20', borderClass: 'border-phoenix-purple-500/40' },
  condition: { icon: GitBranch, label: 'Condition', colorClass: 'from-yellow-500/20 to-amber-500/20', borderClass: 'border-yellow-500/40' },
  loop: { icon: Repeat, label: 'Loop', colorClass: 'from-emerald-500/20 to-green-500/20', borderClass: 'border-emerald-500/40' },
  delay: { icon: Clock, label: 'Delay', colorClass: 'from-slate-500/20 to-gray-500/20', borderClass: 'border-slate-500/40' },
  http: { icon: Globe, label: 'HTTP Request', colorClass: 'from-blue-500/20 to-indigo-500/20', borderClass: 'border-blue-500/40' },
  database: { icon: Database, label: 'Database', colorClass: 'from-purple-500/20 to-violet-500/20', borderClass: 'border-purple-500/40' },
  webhook: { icon: Webhook, label: 'Webhook', colorClass: 'from-pink-500/20 to-rose-500/20', borderClass: 'border-pink-500/40' },
};

const iconColors: Record<NodeType, string> = {
  trigger: 'text-orange-400',
  action: 'text-phoenix-cyan-400',
  ai: 'text-phoenix-purple-400',
  condition: 'text-yellow-400',
  loop: 'text-emerald-400',
  delay: 'text-slate-400',
  http: 'text-blue-400',
  database: 'text-purple-400',
  webhook: 'text-pink-400',
};

export function WorkflowNode({
  id,
  type,
  name,
  position,
  selected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const config = nodeConfig[type];
  const Icon = config.icon;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.node-handle')) return;

      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const nodeStartX = position.x;
      const nodeStartY = position.y;

      dragRef.current = { startX, startY, nodeStartX, nodeStartY };
      onDragStart?.(id, position);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current) return;

        const deltaX = moveEvent.clientX - dragRef.current.startX;
        const deltaY = moveEvent.clientY - dragRef.current.startY;

        const newX = dragRef.current.nodeStartX + deltaX;
        const newY = dragRef.current.nodeStartY + deltaY;

        onDrag?.(id, { x: newX, y: newY });
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        setIsDragging(false);

        if (dragRef.current) {
          const deltaX = upEvent.clientX - dragRef.current.startX;
          const deltaY = upEvent.clientY - dragRef.current.startY;
          const newX = dragRef.current.nodeStartX + deltaX;
          const newY = dragRef.current.nodeStartY + deltaY;

          onDragEnd?.(id, { x: newX, y: newY });
        }

        dragRef.current = null;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, position, onDragStart, onDrag, onDragEnd]
  );

  return (
    <div
      ref={nodeRef}
      className={`
        absolute select-none
        ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      <div
        className={`
          relative min-w-[200px] rounded-xl
          bg-gradient-to-br ${config.colorClass}
          border ${selected ? 'border-phoenix-orange-400 shadow-glow-orange' : config.borderClass}
          transition-all duration-200
          hover:shadow-lg
        `}
      >
        <div className="node-handle absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-dark-800 border-2 border-phoenix-purple-400 -translate-y-1/2 cursor-crosshair hover:scale-125 transition-transform" />
        <div className="node-handle absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-dark-800 border-2 border-phoenix-cyan-400 -translate-y-1/2 cursor-crosshair hover:scale-125 transition-transform" />

        <div className="flex items-center gap-2 p-3 border-b border-dark-700/50">
          <GripVertical className="w-4 h-4 text-dark-500" />
          <div className={`p-1.5 rounded-lg bg-dark-800/50 ${iconColors[type]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-dark-100 flex-1 truncate">{name}</span>
          <button className="p-1 rounded hover:bg-dark-700/50 text-dark-500 hover:text-dark-200 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 text-xs text-dark-400">{config.label}</div>
      </div>
    </div>
  );
}
