import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Globe, Palette, Save } from 'lucide-react';
import { GlassCard, Button } from '../components/ui';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const sections: SettingsSection[] = [
  { id: 'general', label: 'General', icon: SettingsIcon, description: 'Basic workspace settings' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and in-app alerts' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Two-factor and auth settings' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Payment and subscription' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and display' },
  { id: 'api', label: 'API', icon: Globe, description: 'API keys and webhooks' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    workspaceName: 'Phoenix Automation',
    timezone: 'UTC',
    language: 'en',
    emailNotifications: true,
    slackNotifications: false,
    weeklyReport: true,
    twoFactor: false,
    executionAlerts: true,
  });

  return (
    <div className="p-6 flex gap-6 animate-fade-in">
      <div className="w-64 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-phoenix-purple-600/20 to-phoenix-cyan-600/10 border border-phoenix-purple-500/30 text-white'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-phoenix-purple-400' : ''}`} />
              <div>
                <p className="text-sm font-medium">{section.label}</p>
                <p className={`text-xs ${isActive ? 'text-dark-400' : 'text-dark-600'}`}>
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark-100">
              {sections.find((s) => s.id === activeSection)?.label}
            </h2>
            <p className="text-dark-500 text-sm mt-1">
              Manage your {activeSection.toLowerCase()} preferences
            </p>
          </div>
          <Button variant="primary">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {activeSection === 'general' && (
          <GlassCard className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={settings.workspaceName}
                onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                className="input-glass"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="input-glass"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="CET">Central European</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="input-glass"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </GlassCard>
        )}

        {activeSection === 'notifications' && (
          <GlassCard className="p-6 space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email alerts for important events' },
              { key: 'executionAlerts', label: 'Execution Alerts', desc: 'Get notified when workflows complete or fail' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary of your automations' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-dark-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark-100">{item.label}</p>
                  <p className="text-xs text-dark-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                  className={`
                    w-12 h-6 rounded-full transition-colors duration-200
                    ${settings[item.key as keyof typeof settings] ? 'bg-phoenix-purple-600' : 'bg-dark-700'}
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded-full bg-white transition-transform duration-200
                      ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0.5'}
                    `}
                  />
                </button>
              </div>
            ))}
          </GlassCard>
        )}

        {activeSection === 'security' && (
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-dark-700">
              <div>
                <p className="text-sm font-medium text-dark-100">Two-Factor Authentication</p>
                <p className="text-xs text-dark-500">Add an extra layer of security to your account</p>
              </div>
              <Button variant="secondary" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-dark-700">
              <div>
                <p className="text-sm font-medium text-dark-100">Session Management</p>
                <p className="text-xs text-dark-500">View and manage active sessions</p>
              </div>
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-dark-100">Password</p>
                <p className="text-xs text-dark-500">Last changed 30 days ago</p>
              </div>
              <Button variant="secondary" size="sm">
                Change Password
              </Button>
            </div>
          </GlassCard>
        )}

        {activeSection === 'billing' && (
          <GlassCard className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-phoenix-purple-600/20 to-phoenix-cyan-600/10 border border-phoenix-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-dark-100">Enterprise Plan</p>
                  <p className="text-sm text-dark-400">$299/month</p>
                </div>
                <Button variant="orange" size="sm">
                  Upgrade
                </Button>
              </div>
              <p className="text-xs text-dark-400">
                Unlimited workflows, 10M AI tokens, priority support
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-dark-200 mb-3">Billing Method</p>
              <div className="flex items-center gap-4 p-4 rounded-lg glass-light">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-sm text-dark-100">•••• •••• •••• 4242</p>
                  <p className="text-xs text-dark-500">Expires 12/2025</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Update
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {activeSection === 'api' && (
          <GlassCard className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="pk_live_****************************"
                  className="input-glass font-mono"
                  readOnly
                />
                <Button variant="secondary">Copy</Button>
              </div>
              <p className="text-xs text-dark-500 mt-2">
                Use this key to authenticate API requests
              </p>
            </div>

            <div className="pt-4 border-t border-dark-700">
              <Button variant="secondary" size="sm">
                Regenerate Key
              </Button>
              <p className="text-xs text-red-400 mt-2">
                Warning: Regenerating will invalidate your current key
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
