import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, Terminal } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@phoenixai.studio');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate premium login validation
    setTimeout(() => {
      setLoading(false);
      onLogin(true);
    }, 1200);
  };

  return (
    <div className="login-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: '#000000'
    }}>
      {/* Background radial effects */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div className="glass-panel-glow" style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        textAlign: 'center',
        margin: '1.5rem'
      }}>
        {/* Header Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(249, 115, 22, 0.05) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
          }}>
            <Terminal size={32} color="#f97316" />
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem'
          }}>
            PHOENIX <span style={{ color: '#f97316' }}>CORE</span>
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>
            Workflow Automation SaaS Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#52525b'
              }}>
                <User size={18} />
              </span>
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <a href="#forgot" style={{ color: '#f97316', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '500' }}>
                Forgot?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#52525b'
              }}>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#52525b',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: '46px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : (
              <>
                <Shield size={18} />
                Access Console
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#52525b' }}>
          By logging in, you agree to the Terms of Service & Privacy Policy.<br />
          Core Version 2.4.0 (Stable)
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
