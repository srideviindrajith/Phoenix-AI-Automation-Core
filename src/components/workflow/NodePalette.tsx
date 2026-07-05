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
  Plus,
} from 'lucide-react';
import type { NodeType } from '../../types';

interface NodePaletteProps {
  onDragStart: (type: NodeType) => void;
}

const nodeItems: { type: NodeType; icon: React.ElementType; label: string; color: string }[] = [
  { type: 'trigger', icon: Zap, label: 'Trigger', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { type: 'action', icon: Play, label: 'Action', color: 'text-phoenix-cyan-400 border-phoenix-cyan-500/30 bg-phoenix-cyan-500/10' },
  { type: 'ai', icon: Bot, label: 'AI Agent', color: 'text-phoenix-purple-400 border-phoenix-purple-500/30 bg-phoenix-purple-500/10' },
  { type: 'condition', icon: GitBranch, label: 'Condition', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
  { type: 'loop', icon: Repeat, label: 'Loop', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { type: 'delay', icon: Clock, label: 'Delay', color: 'text-slate-400 border-slate-500/30 bg-slate-500/10' },
  { type: 'http', icon: Globe, label: 'HTTP', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { type: 'database', icon: Database, label: 'Database', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { type: 'webhook', icon: Webhook, label: 'Webhook', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
];

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-dark-100 flex items-center gap-2">
        <Plus className="w-4 h-4 text-phoenix-cyan-400" />
        Add Node
      </h3>

      <div className="space-y-2">
        {nodeItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', item.type);
                onDragStart(item.type);
              }}
              className={`
                flex items-center gap-3 p-3 rounded-lg border cursor-grab
                hover:scale-[1.02] transition-all duration-200
                ${item.color}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium text-dark-200">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
