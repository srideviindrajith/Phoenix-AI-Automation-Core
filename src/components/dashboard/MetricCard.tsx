import { ReactNode } from 'react';
import { GlassCard } from '../ui';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'purple' | 'cyan' | 'orange' | 'emerald';
}

const colorStyles = {
  purple: 'from-phoenix-purple-500/20 to-phoenix-purple-600/10 border-phoenix-purple-500/20',
  cyan: 'from-phoenix-cyan-500/20 to-phoenix-cyan-600/10 border-phoenix-cyan-500/20',
  orange: 'from-phoenix-orange-500/20 to-phoenix-orange-600/10 border-phoenix-orange-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
};

const iconBgStyles = {
  purple: 'bg-phoenix-purple-500/20 text-phoenix-purple-400',
  cyan: 'bg-phoenix-cyan-500/20 text-phoenix-cyan-400',
  orange: 'bg-phoenix-orange-500/20 text-phoenix-orange-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
};

export function MetricCard({ title, value, change, changeLabel, icon, trend = 'neutral', color = 'purple' }: MetricCardProps) {
  const trendStyles = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-dark-400',
  };

  const trendArrows = {
    up: '↑',
    down: '↓',
    neutral: '',
  };

  return (
    <GlassCard className={`p-5 bg-gradient-to-br ${colorStyles[color]} hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark-100">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trendStyles[trend]}`}>
              <span>{trendArrows[trend]}</span>
              <span>{change > 0 ? '+' : ''}{change}%</span>
              {changeLabel && <span className="text-dark-500">{changeLabel}</span>}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[color]}`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
