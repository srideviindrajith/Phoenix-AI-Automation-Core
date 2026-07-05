import { useState } from 'react';
import { Play, Plus, Mail, Database, Globe, MessageSquare, FileText, Users, CreditCard, Sparkles } from 'lucide-react';
import { GlassCard, Button, StatusBadge } from '../components/ui';

interface ActionItem {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  workflows: number;
  description: string;
  category: string;
  status: 'active' | 'inactive';
}

const mockActions: ActionItem[] = [
  { id: '1', name: 'Send Email', type: 'email', icon: Mail, workflows: 15, description: 'Send emails via SendGrid, Mailgun, or Amazon SES', category: 'Communication', status: 'active' },
  { id: '2', name: 'Create Record', type: 'database', icon: Database, workflows: 8, description: 'Insert records into databases or spreadsheets', category: 'Data', status: 'active' },
  { id: '3', name: 'HTTP Request', type: 'http', icon: Globe, workflows: 12, description: 'Make REST API calls to any endpoint', category: 'API', status: 'active' },
  { id: '4', name: 'Send Slack Message', type: 'slack', icon: MessageSquare, workflows: 10, description: 'Post messages to Slack channels', category: 'Communication', status: 'active' },
  { id: '5', name: 'Generate Document', type: 'document', icon: FileText, workflows: 5, description: 'Create PDFs, Word docs, or spreadsheets', category: 'Documents', status: 'active' },
  { id: '6', name: 'Add CRM Contact', type: 'crm', icon: Users, workflows: 6, description: 'Add contacts to Salesforce, HubSpot, or Pipedrive', category: 'CRM', status: 'active' },
  { id: '7', name: 'Process Payment', type: 'payment', icon: CreditCard, workflows: 4, description: 'Process payments via Stripe or PayPal', category: 'Finance', status: 'active' },
  { id: '8', name: 'AI Transform', type: 'ai', icon: Sparkles, workflows: 18, description: 'Transform data using GPT-4 or Claude', category: 'AI', status: 'active' },
];

const actionCategories = ['All', 'Communication', 'Data', 'API', 'Documents', 'CRM', 'Finance', 'AI'];

export function Actions() {
  const [actions] = useState(mockActions);
  const [category, setCategory] = useState('All');

  const filteredActions = actions.filter(
    (a) => category === 'All' || a.category === category
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Play className="w-7 h-7 text-phoenix-cyan-400" />
            Actions
          </h2>
          <p className="text-dark-500 text-sm mt-1">Define what happens when your workflows run</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Create Action
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {actionCategories.map((cat) => (
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
        {filteredActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <GlassCard
              key={action.id}
              glow="cyan"
              hover
              className="p-5 space-y-3 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-phoenix-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-phoenix-cyan-500/20">
                    <Icon className="w-5 h-5 text-phoenix-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-100 group-hover:text-white transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-xs text-dark-500">{action.category}</p>
                  </div>
                </div>
                <StatusBadge status={action.status} />
              </div>

              <p className="text-sm text-dark-400 line-clamp-2">{action.description}</p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-dark-500">{action.workflows} workflows</span>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
