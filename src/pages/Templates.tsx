import { useState } from 'react';
import { Search, Star, Download, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { GlassCard, StatusBadge, Button } from '../components/ui';
import { mockTemplates } from '../data/mockData';

const categories = ['All', 'Sales', 'Support', 'Data', 'Marketing', 'Finance', 'DevOps'];

export function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100">Workflow Templates</h2>
          <p className="text-dark-500 text-sm mt-1">Pre-built automation templates to get you started</p>
        </div>
        <Button variant="primary">
          <Sparkles className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg glass-light hover:bg-dark-800/60 text-dark-300 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-phoenix-purple-600 to-phoenix-cyan-600 text-white shadow-glow'
                  : 'glass-light text-dark-300 hover:text-dark-100 hover:bg-dark-800/60'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => (
          <GlassCard
            key={template.id}
            glow="purple"
            hover
            className="p-5 space-y-4 group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-phoenix-purple-500/20 to-phoenix-cyan-500/20 flex items-center justify-center border border-phoenix-purple-500/20">
                  <Sparkles className="w-6 h-6 text-phoenix-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-100 group-hover:text-white transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-dark-500">{template.author}</p>
                </div>
              </div>
              <StatusBadge status="available">{template.category}</StatusBadge>
            </div>

            <p className="text-sm text-dark-400 line-clamp-2">{template.description}</p>

            <div className="flex items-center gap-4 text-xs text-dark-500">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{template.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>{template.installs.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{template.nodes} nodes</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1">
                Use Template
              </Button>
              <Button variant="secondary" size="sm">
                Preview
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
