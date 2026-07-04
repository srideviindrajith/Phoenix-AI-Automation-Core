import React from 'react';
import { PREBUILT_TEMPLATES } from '../utils/simulator';
import { Send, Zap, FileText, UserPlus, CreditCard, Calendar, MessageSquare } from 'lucide-react';

export default function Templates({ onDeployTemplate }) {
  
  const getTemplateIcon = (triggerType) => {
    if (triggerType === 'form_submission') return <FileText size={24} color="#ea580c" />;
    if (triggerType === 'whatsapp_message') return <MessageSquare size={24} color="#25d366" />;
    if (triggerType === 'email_received') return <Send size={24} color="#3b82f6" />;
    if (triggerType === 'new_lead') return <UserPlus size={24} color="#8b5cf6" />;
    if (triggerType === 'payment_success') return <CreditCard size={24} color="#10b981" />;
    if (triggerType === 'appointment_booked') return <Calendar size={24} color="#fbbf24" />;
    return <Zap size={24} color="#f97316" />;
  };

  return (
    <div className="main-content">
      {/* Templates Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
          Automation Templates
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Deploy pre-configured production workflows instantly into your editor canvas.
        </p>
      </div>

      {/* Grid of Templates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {PREBUILT_TEMPLATES.map((tpl) => (
          <div 
            key={tpl.id}
            className="glass-panel-glow" 
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px'
            }}
          >
            <div>
              {/* Icon & Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {getTemplateIcon(tpl.trigger.type)}
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  {tpl.nodes.length} Blocks
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: '#ffffff' }}>
                {tpl.name}
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                {tpl.description}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                Trigger: <span style={{ color: '#f97316', fontWeight: '600' }}>{tpl.trigger.label}</span>
              </span>
              <button 
                className="btn-primary" 
                onClick={() => onDeployTemplate(tpl)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                Deploy Flow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
