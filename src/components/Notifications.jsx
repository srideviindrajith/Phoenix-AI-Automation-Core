import React from 'react';
import { Bell, AlertTriangle, AlertCircle, RefreshCw, Info, Trash2, Check, ArrowRight } from 'lucide-react';

export default function Notifications({ 
  notifications, 
  setNotifications, 
  onNavigate, 
  setActiveWorkflowId, 
  workflows 
}) {

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleInvestigate = (n) => {
    handleMarkRead(n.id);
    if (n.workflowId) {
      setActiveWorkflowId(n.workflowId);
    }
    // Navigate to logs to inspect execution details
    onNavigate('logs');
  };

  const getAlertIcon = (type) => {
    if (type === 'error') return <AlertCircle size={18} color="#ef4444" />;
    if (type === 'warning') return <AlertTriangle size={18} color="#fbbf24" />;
    return <Info size={18} color="#3b82f6" />;
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
            System Alerts & Updates
          </h1>
          <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Live status reports, critical failures, and integrations log.
          </p>
        </div>

        {notifications.length > 0 && (
          <button className="btn-secondary" onClick={handleClearAll} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <Trash2 size={14} />
            Dismiss All
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        {notifications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>
            <Bell size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.95rem' }}>System status nominal. No active alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              className="glass-panel" 
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#fbbf24' : '#3b82f6'}`,
                background: n.read ? 'rgba(12, 12, 14, 0.4)' : 'rgba(12, 12, 14, 0.75)',
                boxShadow: n.read ? 'none' : '0 0 15px rgba(249, 115, 22, 0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                opacity: n.read ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex'
                }}>
                  {getAlertIcon(n.type)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {n.title}
                    {!n.read && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#f97316',
                        display: 'inline-block'
                      }} />
                    )}
                  </h4>
                  <p style={{ color: '#a1a1aa', fontSize: '0.825rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#71717a', display: 'block', marginTop: '0.5rem' }}>
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'center' }}>
                {!n.read && (
                  <button 
                    onClick={() => handleMarkRead(n.id)}
                    className="btn-icon" 
                    title="Mark as Read"
                  >
                    <Check size={14} />
                  </button>
                )}
                {n.workflowId && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleInvestigate(n)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    Investigate
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
