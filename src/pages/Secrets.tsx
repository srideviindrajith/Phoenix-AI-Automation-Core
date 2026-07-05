import { useState } from 'react';
import { Lock, Plus, Eye, EyeOff, Copy, Trash2, Clock, Shield, AlertCircle } from 'lucide-react';
import { GlassCard, Button, StatusBadge } from '../components/ui';

interface Secret {
  id: string;
  name: string;
  key: string;
  lastUsed?: Date;
  environment: 'production' | 'development' | 'staging';
  createdAt: Date;
}

const mockSecrets: Secret[] = [
  { id: '1', name: 'OPENAI_API_KEY', key: 'sk-proj-****************************', lastUsed: new Date(Date.now() - 3600000), environment: 'production', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'STRIPE_SECRET_KEY', key: 'sk_live_****************************', lastUsed: new Date(Date.now() - 7200000), environment: 'production', createdAt: new Date('2024-01-10') },
  { id: '3', name: 'DATABASE_URL', key: 'postgres://********************', lastUsed: new Date(Date.now() - 1800000), environment: 'production', createdAt: new Date('2024-01-08') },
  { id: '4', name: 'SLACK_BOT_TOKEN', key: 'xoxb-****************************', environment: 'development', createdAt: new Date('2024-01-20') },
  { id: '5', name: 'SENDGRID_API_KEY', key: 'SG.****************************', lastUsed: new Date(Date.now() - 14400000), environment: 'production', createdAt: new Date('2024-01-12') },
  { id: '6', name: 'AWS_SECRET_ACCESS_KEY', key: 'wJalrXUtnFEMI/K7************************', lastUsed: new Date(Date.now() - 86400000), environment: 'staging', createdAt: new Date('2024-01-18') },
];

const envColors = {
  production: 'bg-red-500/10 text-red-400 border-red-500/20',
  development: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  staging: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export function Secrets() {
  const [secrets] = useState(mockSecrets);
  const [showValues, setShowValues] = useState<Set<string>>(new Set());

  const toggleShow = (id: string) => {
    setShowValues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'Never';
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Lock className="w-7 h-7 text-phoenix-orange-400" />
            Secrets Manager
          </h2>
          <p className="text-dark-500 text-sm mt-1">Securely store API keys and connection strings</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Add Secret
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 bg-gradient-to-br from-phoenix-purple-500/10 to-phoenix-purple-600/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-phoenix-purple-400" />
            <span className="text-sm text-dark-400">Total Secrets</span>
          </div>
          <p className="text-2xl font-bold text-dark-100">{secrets.length}</p>
        </GlassCard>

        <GlassCard className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-dark-400">Production</span>
          </div>
          <p className="text-2xl font-bold text-dark-100">
            {secrets.filter((s) => s.environment === 'production').length}
          </p>
        </GlassCard>

        <GlassCard className="p-4 bg-gradient-to-br from-phoenix-cyan-500/10 to-phoenix-cyan-600/5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-phoenix-cyan-400" />
            <span className="text-sm text-dark-400">Recently Used</span>
          </div>
          <p className="text-2xl font-bold text-dark-100">
            {secrets.filter((s) => s.lastUsed && Date.now() - s.lastUsed.getTime() < 86400000).length}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 bg-dark-800/50 border-b border-dark-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <p className="text-sm text-dark-400">
            Secrets are encrypted at rest. They can only be accessed within workflows.
          </p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">Value</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">Environment</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">Last Used</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {secrets.map((secret, index) => (
              <tr
                key={secret.id}
                className="hover:bg-dark-800/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-dark-500" />
                    <span className="font-mono text-sm text-dark-100">{secret.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-dark-400 font-mono bg-dark-900/50 px-2 py-1 rounded">
                      {showValues.has(secret.id) ? secret.key.replace(/\*/g, 'abc') : secret.key}
                    </code>
                    <button
                      onClick={() => toggleShow(secret.id)}
                      className="p-1 text-dark-500 hover:text-dark-300 transition-colors"
                    >
                      {showValues.has(secret.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-xs border ${envColors[secret.environment]}`}>
                    {secret.environment}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-dark-400">{formatTime(secret.lastUsed)}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
