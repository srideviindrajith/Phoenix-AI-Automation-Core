import React from 'react';
import { Play, Pause, Activity, Zap, CheckCircle, AlertTriangle, Clock, RefreshCw, Send, ArrowUpRight } from 'lucide-react';
import { MOCK_TRIGGERS } from '../utils/simulator';

export default function Dashboard({ 
  stats, 
  logs, 
  simulatorActive, 
  setSimulatorActive,
  onNavigate 
}) {
  const latestLogs = logs.slice(0, 5);

  // Helper to compute trigger type counts for chart
  const triggerCounts = logs.reduce((acc, log) => {
    acc[log.triggerType] = (acc[log.triggerType] || 0) + 1;
    return acc;
  }, {});

  const totalTriggersCount = Object.values(triggerCounts).reduce((a, b) => a + b, 0) || 1;

  // Render SVG Sparkline
  const renderSparkline = () => {
    // Generate data points based on success rate history
    const points = [40, 50, 45, 60, 55, 75, 80, 85, 90, 92, 95, stats.successRate];
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const xMin = padding;
    const xMax = width - padding;
    const yMin = height - padding;
    const yMax = padding;

    const valMin = 0;
    const valMax = 100;

    const coords = points.map((val, idx) => {
      const x = xMin + (idx / (points.length - 1)) * (xMax - xMin);
      const y = yMin - ((val - valMin) / (valMax - valMin)) * (yMin - yMax);
      return { x, y };
    });

    const pathD = coords.reduce((acc, c, idx) => {
      return idx === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
    }, '');

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${yMin} L ${coords[0].x} ${yMin} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={xMin} y1={yMax} x2={xMax} y2={yMax} stroke="rgba(255, 255, 255, 0.03)" strokeWidth={1} />
        <line x1={xMin} y1={(yMin + yMax)/2} x2={xMax} y2={(yMin + yMax)/2} stroke="rgba(255, 255, 255, 0.03)" strokeWidth={1} />
        <line x1={xMin} y1={yMin} x2={xMax} y2={yMin} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />

        {/* Shaded Area */}
        <path d={areaD} fill="url(#sparklineGrad)" />
        
        {/* Line */}
        <path d={pathD} fill="none" stroke="#f97316" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.3))' }} />

        {/* Data points glow */}
        {coords.map((c, idx) => (
          <circle 
            key={idx} 
            cx={c.x} 
            cy={c.y} 
            r={idx === coords.length - 1 ? 5 : 2} 
            fill={idx === coords.length - 1 ? '#ffffff' : '#ea580c'} 
            stroke="#ea580c" 
            strokeWidth={2}
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="main-content">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', tracking: '-0.02em' }}>
            System Dashboard
          </h1>
          <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time execution analytics and status.
          </p>
        </div>

        {/* Live Simulator Control */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: simulatorActive ? '#10b981' : '#71717a',
              boxShadow: simulatorActive ? '0 0 8px #10b981' : 'none',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e4e4e7', textTransform: 'uppercase' }}>
              {simulatorActive ? 'Live Simulation Active' : 'Simulation Paused'}
            </span>
          </div>
          
          <button 
            onClick={() => setSimulatorActive(!simulatorActive)}
            className="btn-icon"
            title={simulatorActive ? "Pause Simulation" : "Start Simulation"}
          >
            {simulatorActive ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Workflows */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Total Workflows</span>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{stats.totalWorkflows}</h3>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#a1a1aa' }}>
            <Zap size={24} />
          </div>
        </div>

        {/* Active Automations */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Active Automations</span>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#f97316' }}>{stats.activeAutomations}</h3>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
            <Activity size={24} />
          </div>
        </div>

        {/* Success Rate */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Success Rate</span>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#10b981' }}>{stats.successRate}%</h3>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Failed Workflows */}
        <div 
          className="glass-panel" 
          onClick={() => onNavigate('logs')}
          style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
        >
          <div>
            <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Failed Executions</span>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#ef4444' }}>{stats.failedWorkflows}</h3>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        flex: 1
      }}>
        {/* Left Side: Trends and Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={18} color="#f97316" />
              Execution Flow Analytics
            </h3>
            <div style={{ flex: 1, minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {renderSparkline()}
            </div>
          </div>

          {/* Trigger Types Grid */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Trigger Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {MOCK_TRIGGERS.map(trig => {
                const count = triggerCounts[trig.label] || 0;
                const percent = Math.round((count / totalTriggersCount) * 100);
                return (
                  <div key={trig.id} style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: '500' }}>{trig.label}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{count}</span>
                      <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>({percent}%)</span>
                    </div>
                    {/* Tiny Progress Bar */}
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: trig.color || '#f97316',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Live Logs Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#f97316" />
              Live Activity Feed
            </h3>
            <button 
              onClick={() => onNavigate('logs')}
              style={{
                background: 'none',
                border: 'none',
                color: '#f97316',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
            {latestLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#52525b', padding: '2rem 0', fontSize: '0.9rem' }}>
                Waiting for workflow triggers...
              </div>
            ) : (
              latestLogs.map((log) => (
                <div key={log.id} style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.01)',
                  borderLeft: `3px solid ${log.status === 'success' ? '#10b981' : '#ef4444'}`,
                  borderTop: '1px solid rgba(255,255,255,0.03)',
                  borderRight: '1px solid rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                      {log.workflowName}
                    </span>
                    <span className={`badge badge-${log.status}`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#71717a' }}>
                    <span>{log.triggerType}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
