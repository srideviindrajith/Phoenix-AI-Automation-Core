import { useState } from 'react';
import { Sidebar, Header } from './components/layout';
import {
  Dashboard,
  WorkflowBuilder,
  Templates,
  AIAgents,
  Executions,
  Integrations,
  Settings,
  Logs,
  Triggers,
  Actions,
  Marketplace,
  Secrets,
  API,
} from './pages';
import type { Module } from './types';

const moduleConfig: Record<Module, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Monitor your automation performance' },
  workflows: { title: 'Workflow Builder', description: 'Create and edit automation workflows' },
  templates: { title: 'Templates', description: 'Pre-built automation templates' },
  'ai-agents': { title: 'AI Agents', description: 'Configure AI-powered automation' },
  triggers: { title: 'Triggers', description: 'Set up workflow triggers' },
  actions: { title: 'Actions', description: 'Define workflow actions' },
  integrations: { title: 'Integrations', description: 'Connect external services' },
  executions: { title: 'Executions', description: 'Monitor workflow runs' },
  logs: { title: 'Logs', description: 'Debug with detailed logs' },
  marketplace: { title: 'Marketplace', description: 'Discover community solutions' },
  secrets: { title: 'Secrets', description: 'Manage API keys securely' },
  api: { title: 'API', description: 'Developer API access' },
  settings: { title: 'Settings', description: 'Configure your workspace' },
};

const pageComponents: Record<Module, React.FC> = {
  dashboard: Dashboard,
  workflows: WorkflowBuilder,
  templates: Templates,
  'ai-agents': AIAgents,
  triggers: Triggers,
  actions: Actions,
  integrations: Integrations,
  executions: Executions,
  logs: Logs,
  marketplace: Marketplace,
  secrets: Secrets,
  api: API,
  settings: Settings,
};

function App() {
  const [currentModule, setCurrentModule] = useState<Module>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const moduleInfo = moduleConfig[currentModule];
  const PageComponent = pageComponents[currentModule];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <div className="absolute inset-0 bg-gradient-to-br from-phoenix-purple-900/20 via-dark-950 to-phoenix-cyan-900/10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-phoenix-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-phoenix-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header
          moduleTitle={moduleInfo.title}
          moduleDescription={moduleInfo.description}
        />

        <main className="flex-1 overflow-auto relative">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
