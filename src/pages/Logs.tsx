import { useState } from 'react';
import { FileText, Search, Filter, Download, ChevronDown, ChevronRight, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard, Button } from '../components/ui';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  workflow: string;
  message: string;
  details?: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 60000), level: 'success', workflow: 'Customer Onboarding', message: 'Workflow completed successfully', details: 'Processed 5 nodes in 2.3s' },
  { id: '2', timestamp: new Date(Date.now() - 120000), level: 'info', workflow: 'Data Sync Pipeline', message: 'Starting data synchronization', details: 'Connecting to Salesforce API...' },
  { id: '3', timestamp: new Date(Date.now() - 180000), level: 'error', workflow: 'Invoice Generator', message: 'API timeout exceeded', details: 'Request to Stripe API timed out after 30s. Retrying...' },
  { id: '4', timestamp: new Date(Date.now() - 240000), level: 'warn', workflow: 'AI Lead Scoring', message: 'Rate limit approaching', details: 'Used 950/1000 API calls this hour' },
  { id: '5', timestamp: new Date(Date.now() - 300000), level: 'info', workflow: 'Support Ticket Router', message: 'New ticket received', details: 'Ticket #12345 assigned to Support Team A' },
  { id: '6', timestamp: new Date(Date.now() - 360000), level: 'success', workflow: 'Email Campaign', message: 'Sent 152 emails', details: 'Delivery rate: 99.2%' },
  { id: '7', timestamp: new Date(Date.now() - 420000), level: 'error', workflow: 'Database Backup', message: 'Connection failed', details: 'Could not connect to replica database. Fallback activated.' },
  { id: '8', timestamp: new Date(Date.now() - 480000), level: 'warn', workflow: 'Social Media Manager', message: 'Token expired', details: 'Twitter API token needs refresh' },
];

const levelStyles = {
  info: { icon: Info, color: 'text-phoenix-cyan-400', bg: 'bg-phoenix-cyan-500/10' },
  warn: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export function Logs() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => levelFilter === 'all' || log.level === levelFilter);

  const toggleExpand = (id: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-phoenix-purple-400" />
            Execution Logs
          </h2>
          <p className="text-dark-500 text-sm mt-1">Detailed logs for debugging and auditing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search logs..."
            className="input-glass pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'info', 'warn', 'error', 'success'].map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium capitalize
                transition-all duration-200
                ${
                  levelFilter === level
                    ? 'bg-gradient-to-r from-phoenix-purple-600 to-phoenix-cyan-600 text-white'
                    : 'glass-light text-dark-300 hover:text-dark-100'
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="divide-y divide-dark-700">
        {filteredLogs.map((log, index) => {
          const config = levelStyles[log.level];
          const Icon = config.icon;
          const isExpanded = expandedLogs.has(log.id);

          return (
            <div
              key={log.id}
              className="p-4 hover:bg-dark-800/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleExpand(log.id)}
                  className="text-dark-500 hover:text-dark-300 transition-colors mt-0.5"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className={`p-1.5 rounded ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-dark-500">{formatTime(log.timestamp)}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-dark-800 text-dark-400">
                      {log.workflow}
                    </span>
                  </div>
                  <p className="text-sm text-dark-100 font-medium">{log.message}</p>
                  {isExpanded && log.details && (
                    <pre className="mt-2 p-3 rounded-lg bg-dark-900/50 text-xs text-dark-400 font-mono overflow-x-auto animate-slide-down">
                      {log.details}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
}
