import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'running' | 'success' | 'failed' | 'draft' | 'pending' | 'connected' | 'available' | 'coming-soon' | 'training';
  children?: ReactNode;
  pulse?: boolean;
}

const statusStyles = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inactive: 'bg-dark-600/50 text-dark-400 border-dark-500/30',
  running: 'bg-phoenix-cyan-500/20 text-phoenix-cyan-400 border-phoenix-cyan-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  pending: 'bg-phoenix-purple-500/20 text-phoenix-purple-400 border-phoenix-purple-500/30',
  connected: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  available: 'bg-phoenix-cyan-500/20 text-phoenix-cyan-400 border-phoenix-cyan-500/30',
  'coming-soon': 'bg-dark-600/50 text-dark-400 border-dark-500/30',
  training: 'bg-phoenix-orange-500/20 text-phoenix-orange-400 border-phoenix-orange-500/30',
};

const dotStyles = {
  active: 'bg-emerald-400',
  inactive: 'bg-dark-400',
  running: 'bg-phoenix-cyan-400',
  success: 'bg-emerald-400',
  failed: 'bg-red-400',
  draft: 'bg-amber-400',
  pending: 'bg-phoenix-purple-400',
  connected: 'bg-emerald-400',
  available: 'bg-phoenix-cyan-400',
  'coming-soon': 'bg-dark-400',
  training: 'bg-phoenix-orange-400',
};

export function StatusBadge({ status, children, pulse = false }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        border transition-all duration-300
        ${statusStyles[status]}
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full
          ${dotStyles[status]}
          ${pulse ? 'animate-pulse' : ''}
        `}
      />
      {children || status.replace('-', ' ')}
    </span>
  );
}
