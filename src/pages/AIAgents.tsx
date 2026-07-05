import { useState } from 'react';
import { Bot, Plus, Cpu, Zap, TrendingUp, Settings, Play, Pause, Trash2 } from 'lucide-react';
import { GlassCard, AnimatedCounter, StatusBadge, Button, ProgressBar } from '../components/ui';
import { mockAIAgents } from '../data/mockData';
import type { AIAgent } from '../types';

const agentConfig = {
  'gpt-4-turbo': { color: 'from-emerald-500 to-teal-500', badge: 'GPT-4' },
  'gpt-4-vision': { color: 'from-blue-500 to-indigo-500', badge: 'GPT-4V' },
  'claude-3-opus': { color: 'from-orange-500 to-amber-500', badge: 'Claude' },
  'gpt-3.5-turbo': { color: 'from-green-500 to-emerald-500', badge: 'GPT-3.5' },
};

export function AIAgents() {
  const [agents] = useState<AIAgent[]>(mockAIAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const totalTokens = agents.reduce((sum, a) => sum + a.usage.tokens, 0);
  const totalRequests = agents.reduce((sum, a) => sum + a.usage.requests, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Bot className="w-7 h-7 text-phoenix-purple-400" />
            AI Agents
          </h2>
          <p className="text-dark-500 text-sm mt-1">Configure and monitor your AI-powered automation agents</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-5 bg-gradient-to-br from-phoenix-purple-500/10 to-phoenix-purple-600/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-phoenix-purple-500/20">
              <Bot className="w-5 h-5 text-phoenix-purple-400" />
            </div>
            <span className="text-sm text-dark-400">Active Agents</span>
          </div>
          <p className="text-3xl font-bold text-dark-100">
            {agents.filter((a) => a.status === 'active').length}
          </p>
        </GlassCard>

        <GlassCard className="p-5 bg-gradient-to-br from-phoenix-cyan-500/10 to-phoenix-cyan-600/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-phoenix-cyan-500/20">
              <Cpu className="w-5 h-5 text-phoenix-cyan-400" />
            </div>
            <span className="text-sm text-dark-400">Total Tokens</span>
          </div>
          <p className="text-3xl font-bold text-dark-100">
            {(totalTokens / 1000000).toFixed(1)}M
          </p>
        </GlassCard>

        <GlassCard className="p-5 bg-gradient-to-br from-phoenix-orange-500/10 to-phoenix-orange-600/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-phoenix-orange-500/20">
              <Zap className="w-5 h-5 text-phoenix-orange-400" />
            </div>
            <span className="text-sm text-dark-400">API Requests</span>
          </div>
          <p className="text-3xl font-bold text-dark-100">
            {totalRequests.toLocaleString()}
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent, index) => {
          const config = agentConfig[agent.model as keyof typeof agentConfig] || agentConfig['gpt-4-turbo'];

          return (
            <GlassCard
              key={agent.id}
              glow="purple"
              hover
              className={`p-5 space-y-4 group animate-fade-in ${
                selectedAgent?.id === agent.id ? 'ring-2 ring-phoenix-purple-500' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100 group-hover:text-white transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-dark-500">{config.badge}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} pulse={agent.status === 'active'} />
              </div>

              <p className="text-sm text-dark-400 line-clamp-2">{agent.description}</p>

              <div className="flex flex-wrap gap-2">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-1 rounded-md text-xs bg-dark-800/50 text-dark-300 border border-dark-700"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-500">Token Usage</span>
                  <span className="text-dark-300 font-mono">
                    {(agent.usage.tokens / 1000).toFixed(0)}K
                  </span>
                </div>
                <ProgressBar
                  value={agent.usage.tokens}
                  max={5000000}
                  color="gradient"
                  size="sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant={agent.status === 'active' ? 'secondary' : 'primary'}
                  size="sm"
                  className="flex-1"
                >
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Activate
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
