import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, Pause, Search, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { GlassCard, StatusBadge, Button, ProgressBar } from '../components/ui';
import { mockExecutions } from '../data/mockData';
import type { Execution } from '../types';

const statusIcons = {
  running: { icon: Loader2, color: 'text-phoenix-cyan-400', animate: 'animate-spin' },
  success: { icon: CheckCircle, color: 'text-emerald-400', animate: '' },
  failed: { icon: XCircle, color: 'text-red-400', animate: '' },
  pending: { icon: Pause, color: 'text-dark-400', animate: '' },
};

function formatDuration(ms?: number): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function Executions() {
  const [executions] = useState<Execution[]>(mockExecutions);
  const [filter, setFilter] = useState<string>('all');

  const filteredExecutions = executions.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const stats = {
    total: executions.length,
    running: executions.filter((e) => e.status === 'running').length,
    success: executions.filter((e) => e.status === 'success').length,
    failed: executions.filter((e) => e.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100">Execution History</h2>
          <p className="text-dark-500 text-sm mt-1">Monitor and review all workflow executions</p>
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-dark-100">{stats.total}</p>
          <p className="text-xs text-dark-500">Total</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-gradient-to-br from-phoenix-cyan-500/5 to-phoenix-cyan-600/5 border-phoenix-cyan-500/20">
          <p className="text-2xl font-bold text-phoenix-cyan-400">{stats.running}</p>
          <p className="text-xs text-dark-500">Running</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 border-emerald-500/20">
          <p className="text-2xl font-bold text-emerald-400">{stats.success}</p>
          <p className="text-xs text-dark-500">Success</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-gradient-to-br from-red-500/5 to-red-600/5 border-red-500/20">
          <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
          <p className="text-xs text-dark-500">Failed</p>
        </GlassCard>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search executions..."
            className="input-glass pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'running', 'success', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium capitalize
                transition-all duration-200
                ${
                  filter === status
                    ? 'bg-gradient-to-r from-phoenix-purple-600 to-phoenix-cyan-600 text-white'
                    : 'glass-light text-dark-300 hover:text-dark-100'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Workflow
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Started
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {filteredExecutions.map((execution, index) => {
              const statusConfig = statusIcons[execution.status];
              const Icon = statusConfig.icon;

              return (
                <tr
                  key={execution.id}
                  className="hover:bg-dark-800/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-phoenix-purple-500/20 to-phoenix-cyan-500/20 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-phoenix-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-100">{execution.workflowName}</p>
                        <p className="text-xs text-dark-500 font-mono">ID: {execution.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={execution.status} pulse={execution.status === 'running'} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-32">
                      <ProgressBar
                        value={execution.nodesExecuted}
                        max={execution.totalNodes}
                        color={execution.status === 'failed' ? 'orange' : 'gradient'}
                        size="sm"
                      />
                      <p className="text-xs text-dark-500 mt-1">
                        {execution.nodesExecuted}/{execution.totalNodes} nodes
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-mono text-dark-300">
                      {formatDuration(execution.duration)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-dark-400">
                      {formatTime(execution.startedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
