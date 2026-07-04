import React, { useState } from 'react';
import { Key, Globe, Link2, Copy, Trash2, Check, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production Main API Key', key: 'px_live_8f3a9e2d1c7f4b88a91a', created: '2026-05-12' },
    { id: 'key_2', name: 'Staging Webhook Collector', key: 'px_test_2b5d8c3e0f9a4e7a8f1c', created: '2026-06-20' }
  ]);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  
  const [webhookUrl, setWebhookUrl] = useState('https://api.phoenixai.studio/v1/webhooks/receiver');
  const [webhookEvents, setWebhookEvents] = useState({
    on_success: true,
    on_fail: true,
    on_trigger: false
  });

  const [integrations, setIntegrations] = useState([
    { id: 'whatsapp', name: 'WhatsApp Business API', desc: 'Direct message templates dispatch.', connected: true, logo: '💬' },
    { id: 'hubspot', name: 'HubSpot CRM Integration', desc: 'Sync leads and contacts instantly.', connected: true, logo: '🎯' },
    { id: 'gmail', name: 'Gmail SMTP Sender', desc: 'Dispatch automated updates.', connected: false, logo: '✉️' },
    { id: 'stripe', name: 'Stripe Payments', desc: 'Listen to customer payment webhooks.', connected: true, logo: '💳' },
    { id: 'slack', name: 'Slack Alerts Hook', desc: 'Push errors directly to dev channels.', connected: false, logo: '🔔' }
  ]);

  const [notifyPreferences, setNotifyPreferences] = useState({
    email_fail: true,
    realtime_toast: true,
    weekly_report: false
  });

  // Actions
  const handleCopy = (id, keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const handleGenerateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey = {
      id: 'key_' + Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: 'px_live_' + Math.random().toString(36).substr(2, 20),
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
  };

  const handleRevokeKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleToggleIntegration = (id) => {
    setIntegrations(integrations.map(item => 
      item.id === id ? { ...item, connected: !item.connected } : item
    ));
  };

  return (
    <div className="main-content">
      {/* Settings Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
          Console Settings & Integrations
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Configure API credentials, endpoints, webhook distribution, and third-party links.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* API Credentials */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="#f97316" />
            Core API Credentials
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
            Use these tokens to push webhook triggers programmatically to the automation loops.
          </p>

          <form onSubmit={handleGenerateKey} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. Analytics Logger Key"
              className="form-input"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            />
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Create Key
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {apiKeys.map((k) => (
              <div key={k.id} style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{k.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                    {k.key}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button onClick={() => handleCopy(k.id, k.key)} className="btn-icon" title="Copy to clipboard">
                    {copiedKeyId === k.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => handleRevokeKey(k.id)} className="btn-icon" style={{ borderColor: 'rgba(239,68,68,0.2)' }} title="Revoke Key">
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Webhooks */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="#ea580c" />
            Global Webhooks
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
            Specify the REST endpoint to receive structured JSON updates when workflows run.
          </p>

          <div>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Payload URL</label>
            <input
              type="url"
              className="form-input"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Trigger Events</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={webhookEvents.on_success} 
                  onChange={(e) => setWebhookEvents({ ...webhookEvents, on_success: e.target.checked })}
                  style={{ accentColor: '#f97316' }}
                />
                On Workflow Success
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={webhookEvents.on_fail} 
                  onChange={(e) => setWebhookEvents({ ...webhookEvents, on_fail: e.target.checked })}
                  style={{ accentColor: '#f97316' }}
                />
                On Workflow Failure
              </label>
            </div>
          </div>
        </div>

        {/* Connected Hub */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link2 size={18} color="#f97316" />
            Connected Integrations
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {integrations.map((item) => (
              <div key={item.id} style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.logo}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.1rem' }}>{item.desc}</div>
                  </div>
                </div>

                {/* Slider Connect toggle */}
                <div 
                  onClick={() => handleToggleIntegration(item.id)}
                  style={{
                    width: '40px',
                    height: '22px',
                    borderRadius: '9999px',
                    background: item.connected ? 'var(--orange-gradient)' : '#27272a',
                    padding: '2px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    left: item.connected ? '20px' : '2px',
                    top: '2px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
