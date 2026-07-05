export type Module =
  | 'dashboard'
  | 'workflows'
  | 'templates'
  | 'ai-agents'
  | 'triggers'
  | 'actions'
  | 'integrations'
  | 'executions'
  | 'logs'
  | 'marketplace'
  | 'secrets'
  | 'api'
  | 'settings';

export type NodeType = 'trigger' | 'action' | 'ai' | 'condition' | 'loop' | 'delay' | 'http' | 'database' | 'webhook';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  executionCount: number;
  successRate: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  connections: {
    inputs: string[];
    outputs: string[];
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  nodesExecuted: number;
  totalNodes: number;
  error?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive' | 'training';
  capabilities: string[];
  usage: {
    tokens: number;
    requests: number;
  };
  createdAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'connected' | 'available' | 'coming-soon';
  workflows: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  installs: number;
  rating: number;
  nodes: number;
  icon: string;
}

export interface ActivityEvent {
  id: string;
  type: 'execution' | 'success' | 'error' | 'connection' | 'ai';
  message: string;
  workflow?: string;
  timestamp: Date;
}

export interface DashboardMetrics {
  totalExecutions: number;
  successRate: number;
  errorRate: number;
  activeWorkflows: number;
  aiUsage: {
    tokens: number;
    requests: number;
  };
  executionsTrend: { date: string; count: number }[];
  performanceTrend: { date: string; avgDuration: number }[];
}
