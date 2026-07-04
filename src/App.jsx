import React, { useState, useEffect } from 'react';
import { 
  Terminal, LayoutDashboard, Zap, FileSpreadsheet, 
  History, Bell, Settings as SettingsIcon, LogOut, ShieldAlert
} from 'lucide-react';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import Templates from './components/Templates';
import Logs from './components/Logs';
import Notifications from './components/Notifications';
import Settings from './components/Settings';

// Simulator
import { PREBUILT_TEMPLATES, generateMockLogEntry } from './utils/simulator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  
  // Workflows state - seed with prebuilt templates
  const [workflows, setWorkflows] = useState(() => {
    return PREBUILT_TEMPLATES.map(tpl => ({
      ...tpl,
      id: 'flow_' + Math.random().toString(36).substr(2, 9)
    }));
  });
  const [activeWorkflowId, setActiveWorkflowId] = useState('');

  // Logs & stats
  const [logs, setLogs] = useState(() => {
    // Generate some initial historical logs
    return [
      generateMockLogEntry(PREBUILT_TEMPLATES[0].name, true),
      generateMockLogEntry(PREBUILT_TEMPLATES[1].name, true),
      generateMockLogEntry(PREBUILT_TEMPLATES[2].name, false),
      generateMockLogEntry(PREBUILT_TEMPLATES[3].name, true),
      generateMockLogEntry(PREBUILT_TEMPLATES[4].name, true),
      generateMockLogEntry(PREBUILT_TEMPLATES[5].name, true),
      generateMockLogEntry(PREBUILT_TEMPLATES[0].name, false),
      generateMockLogEntry(PREBUILT_TEMPLATES[1].name, true)
    ];
  });

  const [stats, setStats] = useState({
    totalWorkflows: PREBUILT_TEMPLATES.length,
    activeAutomations: 4,
    successRate: 92.5,
    failedWorkflows: 2
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'n_fail_1',
      title: 'Workflow Execution Failure',
      message: 'Appointment Reminders & Follow-ups failed: WhatsApp API returned error code 400 (Invalid Number).',
      type: 'error',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      workflowId: ''
    },
    {
      id: 'n_warn_1',
      title: 'API Rate Limit Warning',
      message: 'HubSpot integration deal updates are approaching 90% of daily API limit.',
      type: 'warning',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    }
  ]);

  const [simulatorActive, setSimulatorActive] = useState(true);

  // Set default active workflow id on load
  useEffect(() => {
    if (workflows.length > 0 && !activeWorkflowId) {
      setActiveWorkflowId(workflows[0].id);
    }
  }, [workflows, activeWorkflowId]);

  // Sync Stats whenever Logs or Workflows change
  useEffect(() => {
    const total = workflows.length;
    const active = Math.min(total, 5); // Mock active count
    const totalRuns = logs.length || 1;
    const failedRuns = logs.filter(l => l.status === 'failed').length;
    const rate = parseFloat(((totalRuns - failedRuns) / totalRuns * 100).toFixed(1));

    setStats({
      totalWorkflows: total,
      activeAutomations: active,
      successRate: rate,
      failedWorkflows: failedRuns
    });
  }, [logs, workflows]);

  // Real-time Event Simulator Engine Loop
  useEffect(() => {
    if (!simulatorActive || !isAuthenticated) return;

    const interval = setInterval(() => {
      // Pick random workflow
      const randomWorkflow = workflows[Math.floor(Math.random() * workflows.length)];
      if (!randomWorkflow) return;

      // 90% Success probability
      const isSuccess = Math.random() > 0.12;
      const newLog = generateMockLogEntry(randomWorkflow.name, isSuccess);

      // Append Log
      setLogs(prev => [newLog, ...prev]);

      // If failed, trigger critical alert
      if (!isSuccess) {
        const errorStep = newLog.steps.find(s => s.status === 'failed');
        const alertMsg = errorStep ? errorStep.error : 'Connection error in executing automation block paths.';
        
        const newAlert = {
          id: 'n_alert_' + Math.random().toString(36).substr(2, 9),
          title: `Failure: ${randomWorkflow.name}`,
          message: `Automation halted on block: ${newLog.steps[newLog.steps.length - 1].name}. Triggered by ${newLog.triggerType}. Error: ${alertMsg}`,
          type: 'error',
          timestamp: new Date().toISOString(),
          read: false,
          workflowId: randomWorkflow.id
        };

        setNotifications(prev => [newAlert, ...prev]);
      }
    }, 6000); // Trigger every 6 seconds

    return () => clearInterval(interval);
  }, [simulatorActive, workflows, isAuthenticated]);

  // Deploy template flow handler
  const handleDeployTemplate = (template) => {
    const newId = 'flow_' + Math.random().toString(36).substr(2, 9);
    const clonedFlow = {
      ...template,
      id: newId,
      name: `Copy of ${template.name}`
    };

    setWorkflows([...workflows, clonedFlow]);
    setActiveWorkflowId(newId);
    setActivePage('builder');
  };

  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  // Render proper workspace content
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            logs={logs} 
            simulatorActive={simulatorActive} 
            setSimulatorActive={setSimulatorActive}
            onNavigate={setActivePage}
          />
        );
      case 'builder':
        return (
          <WorkflowBuilder 
            workflows={workflows} 
            setWorkflows={setWorkflows}
            activeWorkflowId={activeWorkflowId}
            setActiveWorkflowId={setActiveWorkflowId}
          />
        );
      case 'templates':
        return <Templates onDeployTemplate={handleDeployTemplate} />;
      case 'logs':
        return (
          <Logs 
            logs={logs} 
            setLogs={setLogs}
            onNavigate={setActivePage} 
            setActiveWorkflowId={setActiveWorkflowId} 
            workflows={workflows}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications} 
            setNotifications={setNotifications} 
            onNavigate={setActivePage}
            setActiveWorkflowId={setActiveWorkflowId}
            workflows={workflows}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} logs={logs} />;
    }
  };

  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        background: 'rgba(5, 5, 7, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        height: '100vh',
        zIndex: 50,
        position: 'relative'
      }}>
        {/* Brand/Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--orange-gradient)',
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.3)'
            }}>
              <Terminal size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                PHOENIX <span style={{ color: '#f97316' }}>AI</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.6rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Automation Core
              </span>
            </div>
          </div>

          {/* Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button 
              onClick={() => setActivePage('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'dashboard' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'dashboard' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'dashboard' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <LayoutDashboard size={18} color={activePage === 'dashboard' ? '#f97316' : '#a1a1aa'} />
              Dashboard
            </button>

            <button 
              onClick={() => setActivePage('builder')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'builder' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'builder' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'builder' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={18} color={activePage === 'builder' ? '#f97316' : '#a1a1aa'} />
              Workflow Builder
            </button>

            <button 
              onClick={() => setActivePage('templates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'templates' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'templates' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'templates' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <FileSpreadsheet size={18} color={activePage === 'templates' ? '#f97316' : '#a1a1aa'} />
              Templates
            </button>

            <button 
              onClick={() => setActivePage('logs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'logs' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'logs' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'logs' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <History size={18} color={activePage === 'logs' ? '#f97316' : '#a1a1aa'} />
              Execution Logs
            </button>

            <button 
              onClick={() => setActivePage('notifications')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'notifications' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'notifications' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'notifications' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={18} color={activePage === 'notifications' ? '#f97316' : '#a1a1aa'} />
                Notifications
              </div>
              {unreadAlertsCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
                }}>
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActivePage('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                color: activePage === 'settings' ? '#ffffff' : '#a1a1aa',
                background: activePage === 'settings' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: activePage === 'settings' ? '3px solid #f97316' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <SettingsIcon size={18} color={activePage === 'settings' ? '#f97316' : '#a1a1aa'} />
              Settings
            </button>
          </nav>
        </div>

        {/* User profile / Log out */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              PX
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>Indra</div>
              <span style={{ fontSize: '0.65rem', color: '#71717a' }}>Developer Role</span>
            </div>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="btn-icon" 
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content Render */}
      <main style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {renderPage()}
      </main>
    </div>
  );
}
