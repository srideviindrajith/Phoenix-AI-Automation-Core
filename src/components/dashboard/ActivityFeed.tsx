import { Activity, AlertCircle, CheckCircle, Zap, Bot, Link2 } from 'lucide-react';
import type { ActivityEvent } from '../../types';

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

const typeIcons = {
  execution: { icon: Zap, color: 'text-phoenix-cyan-400', bg: 'bg-phoenix-cyan-500/20' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
  connection: { icon: Link2, color: 'text-phoenix-purple-400', bg: 'bg-phoenix-purple-500/20' },
  ai: { icon: Bot, color: 'text-phoenix-orange-400', bg: 'bg-phoenix-orange-500/20' },
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((activity, index) => {
        const typeStyle = typeIcons[activity.type];
        const Icon = typeStyle.icon;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg glass-light hover:bg-dark-800/40 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`p-2 rounded-lg ${typeStyle.bg}`}>
              <Icon className={`w-4 h-4 ${typeStyle.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-dark-100 truncate">{activity.message}</p>
              {activity.workflow && (
                <p className="text-xs text-dark-500 mt-0.5">{activity.workflow}</p>
              )}
            </div>
            <span className="text-xs text-dark-500 whitespace-nowrap">
              {formatTime(activity.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
