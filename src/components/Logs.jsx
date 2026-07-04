import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, ArrowRight, CornerDownRight, 
  Play, Edit2, AlertCircle, CheckCircle, FileText, UserPlus, 
  Calendar, CreditCard, Mail, MessageSquare, X 
} from 'lucide-react';

export default function Logs({ logs, setLogs, onNavigate, setActiveWorkflowId, workflows }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLogId, setSelectedLogId] = useState(null);

  const selectedLog = logs.find(l => l.id === selectedLogId);

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.triggerType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && log.status === statusFilter;
  });

  const getTriggerIcon = (label) => {
    if (label.includes('Form')) return <FileText size={16} color="#ea580c" />;
    if (label.includes('WhatsApp')) return <MessageSquare size={16} color="#25d366" />;
    if (label.includes('Email')) return <Mail size={16} color="#3b82f6" />;
    if (label.includes('Lead')) return <UserPlus size={16} color="#8b5cf6" />;
    if (label.includes('Payment')) return <CreditCard size={16} color="#10b981" />;
    if (label.includes('Appointment') || label.includes('Booking')) return <Calendar size={16} color="#fbbf24" />;
    return <CheckCircle size={16} color="#a1a1aa" />;
  };

  const handleEditWorkflow = (name) => {
    const found = workflows.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
    if (found) {
      setActiveWorkflowId(found.id);
      onNavigate('builder');
    }
  };

  const handleReRun = (log) => {
    // Add a duplicate successful log entry simulating re-run success
    const newLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'success',
      steps: log.steps.map(s => ({ ...s, status: 'success', error: null }))
    };
    setLogs([newLog, ...logs]);
    setSelectedLogId(newLog.id);
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Logs Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
          Workflow Execution Logs
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Audit history and stack traces for all automated processes.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }}>
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search logs by workflow or trigger..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="glass-tabs">
          <button 
            className={`glass-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Logs
          </button>
          <button 
            className={`glass-tab-btn ${statusFilter === 'success' ? 'active' : ''}`}
            onClick={() => setStatusFilter('success')}
          >
            Success
          </button>
          <button 
            className={`glass-tab-btn ${statusFilter === 'failed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('failed')}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Main Grid: Table (Left) + Drawer (Right) */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Table Container */}
        <div className="glass-panel" style={{
          flex: selectedLog ? '2' : '1',
          overflowY: 'auto',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <tr>
                <th style={{ padding: '1rem', color: '#a1a1aa', fontWeight: '600' }}>Workflow Name</th>
                <th style={{ padding: '1rem', color: '#a1a1aa', fontWeight: '600' }}>Trigger Type</th>
                <th style={{ padding: '1rem', color: '#a1a1aa', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', color: '#a1a1aa', fontWeight: '600' }}>Duration</th>
                <th style={{ padding: '1rem', color: '#a1a1aa', fontWeight: '600' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#71717a' }}>
                    No execution logs match the criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isActive = selectedLogId === log.id;
                  return (
                    <tr 
                      key={log.id}
                      onClick={() => setSelectedLogId(log.id)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                        background: isActive ? 'rgba(249, 115, 22, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'; }}
                      onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '1rem', fontWeight: '600', color: '#ffffff' }}>
                        {log.workflowName}
                      </td>
                      <td style={{ padding: '1rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getTriggerIcon(log.triggerType)}
                        {log.triggerType}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${log.status}`}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#71717a', fontFamily: 'monospace' }}>
                        {log.durationMs}ms
                      </td>
                      <td style={{ padding: '1rem', color: '#71717a' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Details Panel (Drawer) */}
        {selectedLog && (
          <div className="glass-panel" style={{
            flex: '1',
            minWidth: '320px',
            maxWidth: '420px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'fadeInRight 0.3s ease-out',
            border: '1px solid rgba(249, 115, 22, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Execution Trace</h3>
                <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'monospace' }}>ID: {selectedLog.id}</span>
              </div>
              <button 
                onClick={() => setSelectedLogId(null)}
                style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* General Log Summary */}
            <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Status</span>
                <span className={`badge badge-${selectedLog.status}`}>{selectedLog.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Total Latency</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: '600' }}>{selectedLog.durationMs}ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Time Ran</span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{new Date(selectedLog.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Execution Steps */}
            <div>
              <h4 className="form-label" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>Block-by-Block Execution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '0.75rem' }}>
                {/* Visual vertical connector line */}
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '12px',
                  width: '1px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1
                }} />

                {selectedLog.steps.map((step, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', gap: '0.75rem', zIndex: 2 }}>
                    {step.status === 'success' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', outline: '4px solid rgba(16,185,129,0.1)', marginTop: '0.25rem' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', outline: '4px solid rgba(239,68,68,0.1)', marginTop: '0.25rem' }} />
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: step.status === 'success' ? '#ffffff' : '#ef4444' }}>
                          {step.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'monospace' }}>{step.time}</span>
                      </div>
                      
                      {step.error && (
                        <div style={{
                          marginTop: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <AlertCircle size={12} />
                          {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button 
                className="btn-primary" 
                onClick={() => handleReRun(selectedLog)}
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
              >
                <Play size={14} />
                Re-Run Path
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleEditWorkflow(selectedLog.workflowName)}
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
              >
                <Edit2 size={14} />
                Edit Flow
              </button>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
