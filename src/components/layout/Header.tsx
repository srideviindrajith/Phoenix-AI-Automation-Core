import { Search, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../ui';

interface HeaderProps {
  moduleTitle: string;
  moduleDescription?: string;
}

export function Header({ moduleTitle, moduleDescription }: HeaderProps) {
  return (
    <header className="h-16 glass border-b border-phoenix-purple-500/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
            {moduleTitle}
            <Sparkles className="w-4 h-4 text-phoenix-orange-400 animate-pulse" />
          </h2>
          {moduleDescription && (
            <p className="text-sm text-dark-500">{moduleDescription}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search workflows, templates..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-dark-900/50 border border-dark-700 text-dark-100 placeholder-dark-500 text-sm focus:border-phoenix-purple-500/50 focus:ring-1 focus:ring-phoenix-purple-500/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-dark-800 text-dark-500 text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>

        <button className="relative p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-phoenix-orange-500 rounded-full" />
        </button>

        <Button variant="primary" size="sm">
          Upgrade Plan
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
