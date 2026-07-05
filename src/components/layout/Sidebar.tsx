import { useState } from 'react';
import {
  LayoutDashboard,
  Workflow,
  LayoutTemplate,
  Bot,
  Zap,
  Play,
  Link2,
  Activity,
  FileText,
  Store,
  Lock,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { Module } from '../../types';

interface SidebarProps {
  currentModule: Module;
  onModuleChange: (module: Module) => void;
}

interface NavItem {
  id: Module;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot, badge: 'AI' },
  { id: 'triggers', label: 'Triggers', icon: Zap },
  { id: 'actions', label: 'Actions', icon: Play },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'executions', label: 'Executions', icon: Activity },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'secrets', label: 'Secrets', icon: Lock },
  { id: 'api', label: 'API', icon: Code2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentModule, onModuleChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40
        glass border-r border-phoenix-purple-500/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center h-16 px-4 border-b border-phoenix-purple-500/10 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-phoenix-orange-500 to-phoenix-orange-600 flex items-center justify-center shadow-glow-orange">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-phoenix-cyan-400 rounded-full border-2 border-dark-950 animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-gradient-phoenix">Phoenix</h1>
                <p className="text-[10px] text-dark-500 font-mono tracking-wider">AUTOMATION CORE</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onModuleChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-phoenix-purple-600/20 to-phoenix-cyan-600/10 text-white border border-phoenix-purple-500/30'
                        : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-phoenix-purple-400' : ''
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-phoenix-orange-500/20 text-phoenix-orange-400 border border-phoenix-orange-500/30">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className={`p-4 border-t border-phoenix-purple-500/10 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-phoenix-purple-500 to-phoenix-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-100 truncate">John Doe</p>
                <p className="text-xs text-dark-500 truncate">Enterprise Plan</p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-phoenix-purple-500 to-phoenix-cyan-500 flex items-center justify-center text-white font-semibold text-sm mx-auto">
              JD
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
