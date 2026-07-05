import { useState } from 'react';
import { Zap, Plus, Globe, Clock, Mail, Mouse, Database, Webhook, MessageSquare } from 'lucide-react';
import { GlassCard, Button, StatusBadge } from '../components/ui';

interface TriggerItem {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  workflows: number;
  description: string;
  lastTriggered?: Date;
  status: 'active' | 'inactive';
}

const mockTriggers: TriggerItem[] = [
  { id: '1', name: 'Webhook - New Lead', type: 'webhook', icon: Webhook, workflows: 3, description: 'Triggered when a new lead is submitted via webhook', lastTriggered: new Date(Date.now() - 300000), status: 'active' },
  { id: '2', name: 'Schedule - Daily Report', type: 'schedule', icon: Clock, workflows: 1, description: 'Runs every day at 9:00 AM UTC', lastTriggered: new Date(Date.now() - 3600000), status: 'active' },
  { id: '3', name: 'Email - Support Received', type: 'email', icon: Mail, workflows: 2, description: 'Triggers when a new support email arrives', lastTriggered: new Date(Date.now() - 7200000), status: 'active' },
  { id: '4', name: 'Form Submission', type: 'form', icon: Mouse, workflows: 1, description: 'Triggers on contact form submissions', status: 'inactive' },
  { id: '5', name: 'Database Change', type: 'database', icon: Database, workflows: 2, description: 'Triggers when a new record is inserted', lastTriggered: new Date(Date.now() - 1800000), status: 'active' },
  { id: '6', name: 'Slack Command', type: 'slack', icon: MessageSquare, workflows: 1, description: 'Triggers on /phoenix slash command', status: 'inactive' },
];

const triggerTypes = [
  { type: 'webhook', icon: Webhook, label: 'Webhook', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
  { type: 'schedule', icon: Clock, label: 'Schedule', color: 'from-slate-500/20 to-gray-500/20 border-slate-500/30' },
  { type: 'email', icon: Mail, label: 'Email', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
  { type: 'form', icon: Mouse, label: 'Form', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30' },
  { type: 'http', icon: Globe, label: 'HTTP', color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30' },
];

export function Triggers() {
  const [triggers] = useState(mockTriggers);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Zap className="w-7 h-7 text-phoenix-orange-400" />
            Triggers
          </h2>
          <p className="text-dark-500 text-sm mt-1">Configure triggers that start your workflows</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Create Trigger
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {triggerTypes.map((type) => {
          const Icon = type.icon;
          return (
            <GlassCard
              key={type.type}
              hover
              className={`p-4 text-center bg-gradient-to-br ${type.color} cursor-pointer`}
            >
              <div className="inline-flex p-3 rounded-xl bg-dark-800/50 mb-2">
                <Icon className="w-6 h-6 text-dark-200" />
              </div>
              <p className="text-sm font-medium text-dark-100">{type.label}</p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="divide-y divide-dark-700">
        {triggers.map((trigger, index) => {
          const Icon = trigger.icon;
          const triggerType = triggerTypes.find((t) => t.type === trigger.type) || triggerTypes[0];

          return (
            <div
              key={trigger.id}
              className="p-4 flex items-center gap-4 hover:bg-dark-800/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${triggerType.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-dark-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-dark-100">{trigger.name}</h3>
                  <StatusBadge status={trigger.status} />
                </div>
                <p className="text-sm text-dark-500 truncate">{trigger.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark-100">{trigger.workflows} workflow{trigger.workflows !== 1 ? 's' : ''}</p>
                {trigger.lastTriggered && (
                  <p className="text-xs text-dark-500">
                    {Math.floor((Date.now() - trigger.lastTriggered.getTime()) / 60000)}m ago
                  </p>
                )}
              </div>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
}
