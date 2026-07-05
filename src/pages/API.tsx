import { useState } from 'react';
import { Code2, Copy, Key, Globe, Book, RefreshCw, CheckCircle } from 'lucide-react';
import { GlassCard, Button, StatusBadge } from '../components/ui';

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
}

const mockAPIKeys: APIKey[] = [
  { id: '1', name: 'Production Key', prefix: 'pk_live_abc123', createdAt: new Date('2024-01-15'), lastUsed: new Date(Date.now() - 3600000), permissions: ['read', 'write', 'execute'] },
  { id: '2', name: 'Development Key', prefix: 'pk_test_xyz789', createdAt: new Date('2024-01-10'), permissions: ['read', 'execute'] },
];

const endpointCategories = [
  {
    name: 'Workflows',
    endpoints: [
      { method: 'GET', path: '/v1/workflows', description: 'List all workflows' },
      { method: 'POST', path: '/v1/workflows', description: 'Create a new workflow' },
      { method: 'GET', path: '/v1/workflows/:id', description: 'Get workflow by ID' },
      { method: 'PUT', path: '/v1/workflows/:id', description: 'Update workflow' },
      { method: 'DELETE', path: '/v1/workflows/:id', description: 'Delete workflow' },
    ],
  },
  {
    name: 'Executions',
    endpoints: [
      { method: 'POST', path: '/v1/workflows/:id/execute', description: 'Execute a workflow' },
      { method: 'GET', path: '/v1/executions', description: 'List all executions' },
      { method: 'GET', path: '/v1/executions/:id', description: 'Get execution details' },
    ],
  },
  {
    name: 'AI Agents',
    endpoints: [
      { method: 'GET', path: '/v1/agents', description: 'List AI agents' },
      { method: 'POST', path: '/v1/agents/:id/complete', description: 'AI completion endpoint' },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function API() {
  const [keys] = useState(mockAPIKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Code2 className="w-7 h-7 text-phoenix-cyan-400" />
            API
          </h2>
          <p className="text-dark-500 text-sm mt-1">Manage API keys and access the Phoenix API</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Book className="w-4 h-4" />
            Documentation
          </Button>
          <Button variant="primary">
            <Key className="w-4 h-4" />
            Create Key
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {keys.map((key, index) => (
          <GlassCard
            key={key.id}
            className="p-5 space-y-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-dark-100">{key.name}</h3>
                <p className="text-xs text-dark-500 mt-1">
                  Created {key.createdAt.toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={key.lastUsed ? 'active' : 'inactive'}>
                {key.lastUsed ? 'Active' : 'Inactive'}
              </StatusBadge>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-dark-900/80 text-dark-300 font-mono text-sm truncate border border-dark-700">
                {key.prefix}••••••••••••••••••••
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(key.prefix, key.id)}
              >
                {copiedId === key.id ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {key.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-1 rounded text-xs bg-phoenix-purple-500/10 text-phoenix-purple-400 border border-phoenix-purple-500/20 capitalize"
                >
                  {perm}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dark-700">
              <span className="text-xs text-dark-500">
                Last used: {key.lastUsed ? key.lastUsed.toLocaleString() : 'Never'}
              </span>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-phoenix-cyan-400" />
            API Endpoints
          </h3>
          <span className="text-sm text-dark-500">
            Base URL: <code className="text-phoenix-cyan-400">https://api.phoenix.io</code>
          </span>
        </div>

        {endpointCategories.map((category, catIndex) => (
          <div key={category.name} className="space-y-2">
            <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
              {category.name}
            </h4>
            <div className="space-y-1">
              {category.endpoints.map((endpoint, epIndex) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(catIndex * 3 + epIndex) * 30}ms` }}
                >
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono font-semibold border ${methodColors[endpoint.method]}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-dark-100 font-mono">{endpoint.path}</code>
                  <span className="text-sm text-dark-500 ml-auto">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-dark-100">Quick Start</h3>
        <pre className="p-4 rounded-lg bg-dark-900/80 text-sm text-dark-200 font-mono overflow-x-auto border border-dark-700">
{`curl -X POST https://api.phoenix.io/v1/workflows \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Workflow",
    "nodes": [...]
  }'`}
        </pre>
      </GlassCard>
    </div>
  );
}
