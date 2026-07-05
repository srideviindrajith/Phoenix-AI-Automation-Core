import { useState } from 'react';
import { Link2, Plus, Settings, ExternalLink, Check, Clock, X, Plug, Zap } from 'lucide-react';
import { GlassCard, StatusBadge, Button } from '../components/ui';
import { mockIntegrations } from '../data/mockData';

const integrationIcons: Record<string, string> = {
  salesforce: '☁️',
  slack: '💬',
  hubspot: '🧡',
  stripe: '💳',
  notion: '📝',
  openai: '🤖',
};

export function Integrations() {
  const [integrations] = useState(mockIntegrations);
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(integrations.map((i) => i.category)))];

  const filteredIntegrations = integrations.filter(
    (i) => category === 'All' || i.category === category
  );

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Link2 className="w-7 h-7 text-phoenix-cyan-400" />
            Integrations
          </h2>
          <p className="text-dark-500 text-sm mt-1">
            {connectedCount} of {integrations.length} integrations connected
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Add Integration
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${
                category === cat
                  ? 'bg-gradient-to-r from-phoenix-purple-600 to-phoenix-cyan-600 text-white shadow-glow'
                  : 'glass-light text-dark-300 hover:text-dark-100 hover:bg-dark-800/60'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration, index) => (
          <GlassCard
            key={integration.id}
            glow={integration.status === 'connected' ? 'cyan' : 'none'}
            hover
            className="p-5 space-y-4 group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark-800/80 flex items-center justify-center text-2xl border border-dark-700">
                  {integrationIcons[integration.icon] || '🔌'}
                </div>
                <div>
                  <h3 className="font-semibold text-dark-100 group-hover:text-white transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-dark-500">{integration.category}</p>
                </div>
              </div>
              <StatusBadge status={integration.status} />
            </div>

            <p className="text-sm text-dark-400">{integration.description}</p>

            {integration.status === 'connected' && (
              <div className="flex items-center gap-2 text-xs text-dark-500">
                <Zap className="w-3.5 h-3.5 text-phoenix-cyan-400" />
                <span>{integration.workflows} active workflows</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {integration.status === 'connected' ? (
                <>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Settings className="w-3.5 h-3.5" />
                    Configure
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              ) : integration.status === 'available' ? (
                <Button variant="primary" size="sm" className="w-full">
                  <Plug className="w-3.5 h-3.5" />
                  Connect
                </Button>
              ) : (
                <Button variant="secondary" size="sm" className="w-full" disabled>
                  <Clock className="w-3.5 h-3.5" />
                  Coming Soon
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
