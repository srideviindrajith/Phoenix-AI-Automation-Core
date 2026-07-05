import { useState, useCallback } from 'react';
import { Play, Save, Settings, Undo, Redo, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button, GlassCard, StatusBadge } from '../components/ui';
import { NodePalette, WorkflowCanvas } from '../components/workflow';
import type { WorkflowNode, NodeType } from '../types';

const initialNodes: WorkflowNode[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    name: 'Webhook Trigger',
    position: { x: 100, y: 100 },
    data: { url: '/api/webhook/new-lead' },
    connections: { inputs: [], outputs: ['action-1'] },
  },
  {
    id: 'action-1',
    type: 'action',
    name: 'Send Email',
    position: { x: 400, y: 100 },
    data: { template: 'welcome-email' },
    connections: { inputs: ['trigger-1'], outputs: ['ai-1'] },
  },
  {
    id: 'ai-1',
    type: 'ai',
    name: 'GPT-4 Lead Scoring',
    position: { x: 700, y: 100 },
    data: { model: 'gpt-4', prompt: 'Score this lead...' },
    connections: { inputs: ['action-1'], outputs: ['condition-1'] },
  },
  {
    id: 'condition-1',
    type: 'condition',
    name: 'Score Threshold',
    position: { x: 1000, y: 100 },
    data: { condition: 'score > 70' },
    connections: { inputs: ['ai-1'], outputs: ['action-2'] },
  },
];

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSelectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const handleUpdateNodePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, position } : node
      )
    );
  }, []);

  const handleAddNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position,
      data: {},
      connections: { inputs: [], outputs: [] },
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-phoenix-purple-500/10 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-100">Invoice Workflow</h2>
            <StatusBadge status="draft" />
          </div>
          <p className="text-sm text-dark-500">Last saved 5 mins ago</p>
        </div>

        <NodePalette onDragStart={() => {}} />

        <div className="space-y-3 pt-4 border-t border-dark-700">
          <h3 className="text-sm font-semibold text-dark-200">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 p-2 rounded-lg glass-light hover:bg-dark-800/60 text-dark-300 hover:text-dark-100 text-xs transition-colors">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg glass-light hover:bg-dark-800/60 text-dark-300 hover:text-dark-100 text-xs transition-colors">
              <Undo className="w-3.5 h-3.5" />
              Undo
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg glass-light hover:bg-dark-800/60 text-dark-300 hover:text-dark-100 text-xs transition-colors">
              <Redo className="w-3.5 h-3.5" />
              Redo
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg glass-light hover:bg-dark-800/60 text-dark-300 hover:text-dark-100 text-xs transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-phoenix-purple-500/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button variant="orange" size="sm">
              <Play className="w-4 h-4" />
              Run Workflow
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-dark-400">
            <span>{nodes.length} nodes</span>
            <span>•</span>
            <span>4 connections</span>
          </div>
        </div>

        <WorkflowCanvas
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onUpdateNodePosition={handleUpdateNodePosition}
          onAddNode={handleAddNode}
        />
      </div>

      {selectedNode && (
        <div className="w-80 border-l border-phoenix-purple-500/10 p-4 space-y-4 overflow-y-auto animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dark-100">Node Configuration</h3>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-dark-400 hover:text-dark-100 transition-colors"
            >
              ×
            </button>
          </div>

          <GlassCard className="p-4 space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Node Name</label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => {
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === selectedNode.id ? { ...n, name: e.target.value } : n
                    )
                  );
                }}
                className="input-glass text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-1">Node Type</label>
              <div className="text-sm text-dark-100 capitalize">{selectedNode.type}</div>
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-1">Position</label>
              <div className="text-sm text-dark-100 font-mono">
                {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-dark-200 uppercase tracking-wider">
              Configuration
            </h4>

            {selectedNode.type === 'trigger' && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Webhook URL</label>
                <input
                  type="text"
                  placeholder="/api/webhook/endpoint"
                  className="input-glass text-sm"
                />
              </div>
            )}

            {selectedNode.type === 'ai' && (
              <>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Model</label>
                  <select className="input-glass text-sm">
                    <option>GPT-4 Turbo</option>
                    <option>GPT-3.5 Turbo</option>
                    <option>Claude 3 Opus</option>
                    <option>Claude 3 Sonnet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Prompt</label>
                  <textarea
                    placeholder="Enter your prompt..."
                    className="input-glass text-sm h-24 resize-none"
                  />
                </div>
              </>
            )}

            {selectedNode.type === 'action' && (
              <>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Action Type</label>
                  <select className="input-glass text-sm">
                    <option>Send Email</option>
                    <option>Create Record</option>
                    <option>Update Record</option>
                    <option>HTTP Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Description</label>
                  <textarea
                    placeholder="Action description..."
                    className="input-glass text-sm h-20 resize-none"
                  />
                </div>
              </>
            )}

            {selectedNode.type === 'condition' && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Condition</label>
                <textarea
                  placeholder="e.g., score > 70"
                  className="input-glass text-sm h-20 resize-none"
                />
              </div>
            )}
          </GlassCard>

          <Button variant="secondary" className="w-full">
            Apply Changes
          </Button>
        </div>
      )}
    </div>
  );
}
