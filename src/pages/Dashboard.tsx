import { Activity, CheckCircle, AlertCircle, Zap, Bot, Workflow, Cpu } from 'lucide-react';
import { GlassCard, AnimatedCounter, StatusBadge } from '../components/ui';
import { MetricCard, ActivityFeed, TrendChart, PerformanceChart } from '../components/dashboard';
import { mockDashboardMetrics, mockActivity, mockWorkflows, mockExecutions } from '../data/mockData';

export function Dashboard() {
  const runningExecutions = mockExecutions.filter((e) => e.status === 'running').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Executions"
          value={<AnimatedCounter value={mockDashboardMetrics.totalExecutions} />}
          change={12.5}
          changeLabel="vs last week"
          icon={<Activity className="w-5 h-5" />}
          trend="up"
          color="cyan"
        />
        <MetricCard
          title="Success Rate"
          value={`${mockDashboardMetrics.successRate}%`}
          change={0.8}
          changeLabel="vs last week"
          icon={<CheckCircle className="w-5 h-5" />}
          trend="up"
          color="emerald"
        />
        <MetricCard
          title="Error Rate"
          value={`${mockDashboardMetrics.errorRate}%`}
          change={-0.3}
          changeLabel="vs last week"
          icon={<AlertCircle className="w-5 h-5" />}
          trend="down"
          color="orange"
        />
        <MetricCard
          title="Active Workflows"
          value={mockDashboardMetrics.activeWorkflows}
          change={5}
          changeLabel="new this week"
          icon={<Workflow className="w-5 h-5" />}
          trend="up"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendChart
            data={mockDashboardMetrics.executionsTrend}
            title="Executions This Week"
            color="cyan"
          />
          <PerformanceChart
            data={mockDashboardMetrics.performanceTrend}
            title="Avg. Execution Time (ms)"
          />
        </div>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-phoenix-orange-400" />
              AI Usage
            </h3>
            <StatusBadge status="active" pulse>
              Active
            </StatusBadge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-400">Tokens Used</span>
                <span className="text-dark-100 font-mono">
                  {(mockDashboardMetrics.aiUsage.tokens / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-phoenix-purple-500 to-phoenix-cyan-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-400">API Requests</span>
                <span className="text-dark-100 font-mono">
                  {mockDashboardMetrics.aiUsage.requests.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-phoenix-orange-500 to-phoenix-orange-400 rounded-full" />
              </div>
            </div>
            <div className="pt-3 border-t border-dark-700">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-phoenix-cyan-400" />
                <span className="text-dark-400">Model usage:</span>
                <span className="text-dark-100">GPT-4 (65%), Claude (35%)</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="text-sm font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-phoenix-orange-400" />
            Active Workflows
          </h3>
          <div className="space-y-3">
            {mockWorkflows.slice(0, 5).map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-3 rounded-lg glass-light hover:bg-dark-800/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-phoenix-purple-500/20 to-phoenix-cyan-500/20 flex items-center justify-center border border-phoenix-purple-500/20">
                    <Workflow className="w-5 h-5 text-phoenix-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-100 group-hover:text-white transition-colors">
                      {workflow.name}
                    </p>
                    <p className="text-xs text-dark-500">{workflow.executionCount.toLocaleString()} runs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-mono text-dark-100">{workflow.successRate}%</p>
                    <p className="text-xs text-dark-500">Success</p>
                  </div>
                  <StatusBadge status={workflow.status} pulse={workflow.status === 'active'} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-phoenix-cyan-400" />
            Live Activity
            {runningExecutions > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-phoenix-cyan-500/20 text-phoenix-cyan-400 border border-phoenix-cyan-500/30 animate-pulse">
                {runningExecutions} running
              </span>
            )}
          </h3>
          <ActivityFeed activities={mockActivity} />
        </GlassCard>
      </div>
    </div>
  );
}
