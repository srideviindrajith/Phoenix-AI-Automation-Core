import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, Mail, MessageSquare, UserPlus, CreditCard, Calendar, 
  CheckSquare, UserCheck, RefreshCw, FileSpreadsheet, Bell, 
  HelpCircle, Play, Save, Plus, Trash2, ArrowRight, Brain, Clock, GitFork, X
} from 'lucide-react';
import { MOCK_TRIGGERS, MOCK_ACTIONS } from '../utils/simulator';

export default function WorkflowBuilder({ 
  workflows, 
  setWorkflows, 
  activeWorkflowId, 
  setActiveWorkflowId 
}) {
  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingNodeId, setConnectingNodeId] = useState(null);
  const [connectingPort, setConnectingPort] = useState('output'); // 'output', 'true', 'false'
  
  // Animation state for manual workflow testing
  const [animatingNodeId, setAnimatingNodeId] = useState(null);
  const [activePaths, setActivePaths] = useState([]); // Array of strings like "n1-n2"
  const [isTesting, setIsTesting] = useState(false);

  const canvasRef = useRef(null);

  // Set default workflow if none selected
  useEffect(() => {
    if (!activeWorkflowId && workflows.length > 0) {
      setActiveWorkflowId(workflows[0].id);
    }
  }, [activeWorkflowId, workflows]);

  if (!activeWorkflow) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center', color: '#71717a' }}>
          <p>No active workflows. Select or create one.</p>
        </div>
      </div>
    );
  }

  const { nodes = [], connections = [] } = activeWorkflow;

  // Add node to active workflow
  const addNode = (type, category = '', label = 'New Block') => {
    const id = 'n_' + Math.random().toString(36).substr(2, 9);
    const newNode = {
      id,
      type,
      category,
      label,
      x: 150 + Math.random() * 150,
      y: 100 + Math.random() * 200,
      details: type === 'ai_decision' ? { prompt: 'Analyze incoming data...' } : {}
    };

    const updated = workflows.map(w => {
      if (w.id === activeWorkflowId) {
        return { ...w, nodes: [...nodes, newNode] };
      }
      return w;
    });
    setWorkflows(updated);
    setSelectedNodeId(id);
  };

  // Delete node
  const deleteNode = (nodeId) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedConns = connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    
    const updated = workflows.map(w => {
      if (w.id === activeWorkflowId) {
        return { ...w, nodes: updatedNodes, connections: updatedConns };
      }
      return w;
    });
    setWorkflows(updated);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Node Drag Handlers
  const handleNodePointerDown = (e, nodeId) => {
    if (e.target.closest('.anchor')) return; // ignore anchor clicks
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      setDragOffset({
        x: clickX - node.x,
        y: clickY - node.y
      });
    }
    e.target.setPointerCapture(e.pointerId);
  };

  const handleNodePointerMove = (e) => {
    if (draggingNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      const newX = Math.max(20, Math.min(rect.width - 200, currentX - dragOffset.x));
      const newY = Math.max(20, Math.min(rect.height - 120, currentY - dragOffset.y));

      const updated = workflows.map(w => {
        if (w.id === activeWorkflowId) {
          return {
            ...w,
            nodes: nodes.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n)
          };
        }
        return w;
      });
      setWorkflows(updated);
    }
  };

  const handleNodePointerUp = (e) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  // Connection Handlers
  const handleAnchorClick = (e, nodeId, port) => {
    e.stopPropagation();
    
    if (!connectingNodeId) {
      // First node selection (output)
      setConnectingNodeId(nodeId);
      setConnectingPort(port);
    } else {
      // Second node selection (input)
      if (connectingNodeId === nodeId) {
        // Reset if clicking same node
        setConnectingNodeId(null);
        return;
      }

      // Check if connection already exists
      const exists = connections.some(c => 
        c.from === connectingNodeId && c.to === nodeId && c.port === connectingPort
      );

      if (!exists) {
        const newConn = {
          from: connectingNodeId,
          to: nodeId
        };
        if (connectingPort !== 'output') {
          newConn.port = connectingPort; // 'true' or 'false'
        }

        const updated = workflows.map(w => {
          if (w.id === activeWorkflowId) {
            return { ...w, connections: [...connections, newConn] };
          }
          return w;
        });
        setWorkflows(updated);
      }
      setConnectingNodeId(null);
    }
  };

  const deleteConnection = (fromId, toId, port) => {
    const updatedConns = connections.filter(c => 
      !(c.from === fromId && c.to === toId && c.port === port)
    );
    const updated = workflows.map(w => {
      if (w.id === activeWorkflowId) {
        return { ...w, connections: updatedConns };
      }
      return w;
    });
    setWorkflows(updated);
  };

  // Node details modification
  const handleDetailsChange = (field, value) => {
    const updated = workflows.map(w => {
      if (w.id === activeWorkflowId) {
        return {
          ...w,
          nodes: nodes.map(n => {
            if (n.id === selectedNodeId) {
              return { ...n, details: { ...n.details, [field]: value } };
            }
            return n;
          })
        };
      }
      return w;
    });
    setWorkflows(updated);
  };

  const handleLabelChange = (newVal) => {
    const updated = workflows.map(w => {
      if (w.id === activeWorkflowId) {
        return {
          ...w,
          nodes: nodes.map(n => n.id === selectedNodeId ? { ...n, label: newVal } : n)
        };
      }
      return w;
    });
    setWorkflows(updated);
  };

  // Manual Flow Tester Simulator
  const runFlowTest = () => {
    if (nodes.length === 0 || isTesting) return;
    setIsTesting(true);
    setAnimatingNodeId(null);
    setActivePaths([]);

    // Find trigger node
    const triggerNode = nodes.find(n => n.type === 'trigger') || nodes[0];
    if (!triggerNode) return;

    let currentNode = triggerNode;
    
    const animateNext = (node) => {
      setAnimatingNodeId(node.id);
      
      setTimeout(() => {
        // Find outgoing connections
        const outConns = connections.filter(c => c.from === node.id);
        if (outConns.length === 0) {
          setIsTesting(false);
          setAnimatingNodeId(null);
          setActivePaths([]);
          return;
        }

        // Handle Branching Logic for AI Decision / Condition
        let pathToGo = outConns[0];
        if (node.type === 'condition' || node.type === 'ai_decision') {
          // Randomly choose true/false path to showcase logic
          const randomBranch = Math.random() > 0.5 ? 'true' : 'false';
          const branchConn = outConns.find(c => c.port === randomBranch) || outConns[0];
          pathToGo = branchConn;
        }

        // Set path active
        const pathKey = `${pathToGo.from}-${pathToGo.to}${pathToGo.port ? '-' + pathToGo.port : ''}`;
        setActivePaths(prev => [...prev, pathKey]);
        setAnimatingNodeId(null);

        // Find target node
        const nextNode = nodes.find(n => n.id === pathToGo.to);
        if (nextNode) {
          setTimeout(() => {
            animateNext(nextNode);
          }, 800);
        } else {
          setIsTesting(false);
          setActivePaths([]);
        }
      }, 1000);
    };

    animateNext(currentNode);
  };

  // Node Icons helper
  const getNodeIcon = (type, category) => {
    if (type === 'trigger') {
      const match = MOCK_TRIGGERS.find(t => t.type === category);
      if (match) {
        if (category === 'form_submission') return <Plus size={18} color="#ea580c" />;
        if (category === 'whatsapp_message') return <MessageSquare size={18} color="#25d366" />;
        if (category === 'email_received') return <Mail size={18} color="#3b82f6" />;
        if (category === 'new_lead') return <UserPlus size={18} color="#8b5cf6" />;
        if (category === 'payment_success') return <CreditCard size={18} color="#10b981" />;
        if (category === 'appointment_booked') return <Calendar size={18} color="#fbbf24" />;
      }
      return <Zap size={18} color="#ea580c" />;
    }

    if (type === 'action') {
      if (category === 'send_email') return <Mail size={18} color="#3b82f6" />;
      if (category === 'send_whatsapp') return <MessageSquare size={18} color="#25d366" />;
      if (category === 'create_task') return <CheckSquare size={18} color="#84cc16" />;
      if (category === 'assign_sales') return <UserCheck size={18} color="#8b5cf6" />;
      if (category === 'update_crm') return <RefreshCw size={18} color="#f59e0b" />;
      if (category === 'create_invoice') return <FileSpreadsheet size={18} color="#06b6d4" />;
      if (category === 'send_notification') return <Bell size={18} color="#ef4444" />;
      return <Zap size={18} color="#a1a1aa" />;
    }

    if (type === 'ai_decision') return <Brain size={18} color="#ec4899" />;
    if (type === 'delay') return <Clock size={18} color="#fbbf24" />;
    if (type === 'condition') return <GitFork size={18} color="#3b82f6" />;

    return <HelpCircle size={18} color="#a1a1aa" />;
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="main-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem' }}>
      {/* Builder Sub Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
              Workflow Builder
            </h1>
            <span style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#f97316',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {activeWorkflow.name}
            </span>
          </div>
          <p style={{ color: '#71717a', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Visually assemble automations, map triggers, logical delays, and AI actions.
          </p>
        </div>

        {/* Builder Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn-secondary" 
            onClick={runFlowTest}
            disabled={isTesting}
            style={{ opacity: isTesting ? 0.6 : 1 }}
          >
            <Play size={16} />
            Test Path Run
          </button>
          <button className="btn-primary">
            <Save size={16} />
            Save Automation
          </button>
        </div>
      </div>

      {/* Workspace Area: Blocks + Canvas + Details */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Blocks Panel */}
        <div className="glass-panel" style={{ width: '250px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          
          {/* Triggers */}
          <div>
            <h4 className="form-label" style={{ fontSize: '0.7rem', marginBottom: '0.75rem', color: '#ea580c' }}>Triggers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {MOCK_TRIGGERS.map(t => (
                <button 
                  key={t.id}
                  onClick={() => addNode('trigger', t.type, t.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#e4e4e7',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(234,88,12,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  {getNodeIcon('trigger', t.type)}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logic elements */}
          <div>
            <h4 className="form-label" style={{ fontSize: '0.7rem', marginBottom: '0.75rem', color: '#fbbf24' }}>Flow Elements</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => addNode('ai_decision', '', 'AI Decision (Gemini)')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  color: '#e4e4e7',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <Brain size={18} color="#ec4899" />
                AI Decision Block
              </button>
              <button 
                onClick={() => addNode('delay', '', 'Delay Action')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  color: '#e4e4e7',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <Clock size={18} color="#fbbf24" />
                Delay Block
              </button>
              <button 
                onClick={() => addNode('condition', '', 'Branch Condition')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  color: '#e4e4e7',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <GitFork size={18} color="#3b82f6" />
                Condition Block
              </button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="form-label" style={{ fontSize: '0.7rem', marginBottom: '0.75rem', color: '#10b981' }}>Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {MOCK_ACTIONS.map(a => (
                <button 
                  key={a.id}
                  onClick={() => addNode('action', a.type, a.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#e4e4e7',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  {getNodeIcon('action', a.type)}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Center: Canvas */}
        <div 
          ref={canvasRef}
          className="canvas-grid" 
          onPointerMove={handleNodePointerMove}
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        >
          {/* SVG Connection layer */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {connections.map((c, idx) => {
              const fromN = nodes.find(n => n.id === c.from);
              const toN = nodes.find(n => n.id === c.to);
              
              if (!fromN || !toN) return null;

              // Calculate anchor coordinates
              // Node sizes: width is 180px, height is 64px
              let fromX = fromN.x + 180;
              let fromY = fromN.y + 32;
              
              // Branch conditions shift output coordinate slightly
              if (fromN.type === 'condition' || fromN.type === 'ai_decision') {
                if (c.port === 'true') {
                  fromY = fromN.y + 20;
                } else if (c.port === 'false') {
                  fromY = fromN.y + 44;
                }
              }

              const toX = toN.x;
              const toY = toN.y + 32;

              // Cubic Bezier curve paths
              const controlPointOffset = Math.abs(toX - fromX) * 0.5;
              const d = `M ${fromX} ${fromY} C ${fromX + controlPointOffset} ${fromY}, ${toX - controlPointOffset} ${toY}, ${toX} ${toY}`;

              const pathKey = `${c.from}-${c.to}${c.port ? '-' + c.port : ''}`;
              const isPathActive = activePaths.includes(pathKey);

              return (
                <g key={idx}>
                  <path 
                    d={d} 
                    className={`connection-line ${isPathActive ? 'active' : ''}`} 
                  />
                  {/* Invisible clickable thick line for deletion */}
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={10}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => deleteConnection(c.from, c.to, c.port)}
                    title="Click to delete connection"
                  />
                </g>
              );
            })}
          </svg>

          {/* Node Elements */}
          {nodes.map(n => {
            const isSelected = selectedNodeId === n.id;
            const isNodeAnimating = animatingNodeId === n.id;
            
            return (
              <div
                key={n.id}
                onPointerDown={(e) => handleNodePointerDown(e, n.id)}
                onPointerUp={handleNodePointerUp}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  width: '180px',
                  minHeight: '64px',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: draggingNodeId === n.id ? 'grabbing' : 'grab',
                  zIndex: isSelected ? 30 : 10,
                  transition: draggingNodeId === n.id ? 'none' : 'border-color 0.2s, box-shadow 0.2s',
                  userSelect: 'none',
                  border: isSelected ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.08)'
                }}
                className={`glass-panel ${isSelected ? 'node-active' : ''} ${isNodeAnimating ? 'node-success-exec' : ''}`}
              >
                {/* Node icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)'
                }}>
                  {getNodeIcon(n.type, n.category)}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.label}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'capitalize' }}>
                    {n.type === 'trigger' ? 'Trigger' : n.type === 'action' ? 'Action' : n.type.replace('_', ' ')}
                  </div>
                </div>

                {/* Left (Input) Anchor */}
                {n.type !== 'trigger' && (
                  <div 
                    className="anchor"
                    onClick={(e) => handleAnchorClick(e, n.id, 'input')}
                    style={{
                      position: 'absolute',
                      left: '-6px',
                      top: 'calc(50% - 6px)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: connectingNodeId && connectingNodeId !== n.id ? '#f97316' : '#27272a',
                      border: '2px solid #000000',
                      cursor: 'pointer',
                      zIndex: 20
                    }}
                    title="Connect input here"
                  />
                )}

                {/* Right (Output) Anchor(s) */}
                {n.type !== 'condition' && n.type !== 'ai_decision' ? (
                  <div 
                    className="anchor"
                    onClick={(e) => handleAnchorClick(e, n.id, 'output')}
                    style={{
                      position: 'absolute',
                      right: '-6px',
                      top: 'calc(50% - 6px)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: connectingNodeId === n.id && connectingPort === 'output' ? '#f97316' : '#27272a',
                      border: '2px solid #000000',
                      cursor: 'pointer',
                      zIndex: 20
                    }}
                    title="Connect output"
                  />
                ) : (
                  // Conditional True/False Anchors
                  <>
                    <div 
                      className="anchor"
                      onClick={(e) => handleAnchorClick(e, n.id, 'true')}
                      style={{
                        position: 'absolute',
                        right: '-6px',
                        top: '14px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: connectingNodeId === n.id && connectingPort === 'true' ? '#10b981' : '#10b981',
                        border: '2px solid #000000',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                      title="True branch"
                    />
                    <div 
                      className="anchor"
                      onClick={(e) => handleAnchorClick(e, n.id, 'false')}
                      style={{
                        position: 'absolute',
                        right: '-6px',
                        bottom: '14px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: connectingNodeId === n.id && connectingPort === 'false' ? '#ef4444' : '#ef4444',
                        border: '2px solid #000000',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                      title="False branch"
                    />
                  </>
                )}

                {/* Delete button (displays on select) */}
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNode(n.id); }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: '#ef4444',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      zIndex: 40
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Prompt/Instruction overlays for connecting nodes */}
          {connectingNodeId && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid #f97316',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none'
            }}>
              <ArrowRight size={14} color="#f97316" />
              Select another node's input anchor to link them.
            </div>
          )}
        </div>

        {/* Right Side: Details Configuration Slider Panel */}
        {selectedNode ? (
          <div className="glass-panel" style={{ width: '300px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Block Config</h3>
              <button 
                onClick={() => setSelectedNodeId(null)}
                style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Label */}
            <div>
              <label className="form-label">Block Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={selectedNode.label} 
                onChange={(e) => handleLabelChange(e.target.value)}
              />
            </div>

            {/* Type-specific Fields */}
            {selectedNode.type === 'ai_decision' && (
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Brain size={14} color="#ec4899" />
                  Gemini AI Prompt Instructions
                </label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Ask Gemini to make a logical routing decision, clean data, extract key terms, etc..."
                  value={selectedNode.details?.prompt || ''}
                  onChange={(e) => handleDetailsChange('prompt', e.target.value)}
                />
                <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block', marginTop: '0.5rem' }}>
                  Passes inputs to gemini-2.5-flash to run real-time logic. Output variables can be queried in downstream condition blocks.
                </span>
              </div>
            )}

            {selectedNode.type === 'delay' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Duration</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={selectedNode.details?.duration || 1} 
                    onChange={(e) => handleDetailsChange('duration', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Time Unit</label>
                  <select 
                    className="form-input"
                    value={selectedNode.details?.unit || 'minutes'}
                    onChange={(e) => handleDetailsChange('unit', e.target.value)}
                    style={{ background: '#09090b', color: '#ffffff' }}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode.type === 'condition' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Variable</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Lead Score"
                    value={selectedNode.details?.variable || ''} 
                    onChange={(e) => handleDetailsChange('variable', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Condition Test</label>
                  <select 
                    className="form-input"
                    value={selectedNode.details?.operator || 'greater_than'}
                    onChange={(e) => handleDetailsChange('operator', e.target.value)}
                    style={{ background: '#09090b', color: '#ffffff' }}
                  >
                    <option value="greater_than">Is Greater Than &gt;</option>
                    <option value="less_than">Is Less Than &lt;</option>
                    <option value="equals">Equals ==</option>
                    <option value="contains">Contains String</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Compare Value</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 7"
                    value={selectedNode.details?.value || ''} 
                    onChange={(e) => handleDetailsChange('value', e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'action' && selectedNode.category === 'send_email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Email Subject</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={selectedNode.details?.subject || ''} 
                    onChange={(e) => handleDetailsChange('subject', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Email Body</label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '80px', fontFamily: 'inherit' }}
                    value={selectedNode.details?.body || ''} 
                    onChange={(e) => handleDetailsChange('body', e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'action' && selectedNode.category === 'send_whatsapp' && (
              <div>
                <label className="form-label">WhatsApp Text</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '100px', fontFamily: 'inherit' }}
                  value={selectedNode.details?.message || ''} 
                  onChange={(e) => handleDetailsChange('message', e.target.value)}
                />
              </div>
            )}

            {selectedNode.type === 'action' && selectedNode.category === 'assign_sales' && (
              <div>
                <label className="form-label">Assignee Rep</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={selectedNode.details?.rep || ''} 
                  onChange={(e) => handleDetailsChange('rep', e.target.value)}
                />
              </div>
            )}

            {/* Static guidance */}
            <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>
                Node ID: <span style={{ fontFamily: 'monospace' }}>{selectedNode.id}</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block', marginTop: '0.2rem' }}>
                Canvas Coordinates: X={selectedNode.x}, Y={selectedNode.y}
              </span>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ width: '300px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', fontSize: '0.85rem', textAlign: 'center' }}>
            Click a node block on the canvas to configure variables.
          </div>
        )}

      </div>
    </div>
  );
}
