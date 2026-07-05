import { useState } from 'react';
import { Store, Search, Star, Download, ExternalLink, Users, TrendingUp, Filter } from 'lucide-react';
import { GlassCard, Button, StatusBadge } from '../components/ui';

interface MarketplaceItem {
  id: string;
  name: string;
  author: string;
  rating: number;
  installs: number;
  category: string;
  description: string;
  featured?: boolean;
}

const mockMarketplace: MarketplaceItem[] = [
  { id: '1', name: 'AI Lead Scoring Pro', author: 'Phoenix Labs', rating: 4.9, installs: 24500, category: 'AI', description: 'Advanced lead scoring with GPT-4 integration', featured: true },
  { id: '2', name: 'Multi-Channel Outreach', author: 'Sales Pro', rating: 4.7, installs: 18200, category: 'Sales', description: 'Automate outreach across email, LinkedIn, and phone' },
  { id: '3', name: 'Smart Document Parser', author: 'DocFlow', rating: 4.8, installs: 15600, category: 'Data', description: 'Extract data from invoices, contracts, and forms', featured: true },
  { id: '4', name: 'Customer Journey Tracker', author: 'Analytics Co', rating: 4.6, installs: 12300, category: 'Analytics', description: 'Track and analyze customer touchpoints' },
  { id: '5', name: 'Support Bot Bundle', author: 'HelpDesk AI', rating: 4.9, installs: 21000, category: 'Support', description: 'Pre-built support automation with AI responses', featured: true },
  { id: '6', name: 'E-commerce Sync', author: 'StoreSync', rating: 4.5, installs: 9800, category: 'E-commerce', description: 'Sync inventory across Shopify, WooCommerce, Amazon' },
  { id: '7', name: 'HR Onboarding Kit', author: 'PeopleOps', rating: 4.7, installs: 7500, category: 'HR', description: 'Complete employee onboarding automation' },
  { id: '8', name: 'Finance Reconciler', author: 'FinTech Tools', rating: 4.8, installs: 11200, category: 'Finance', description: 'Automate financial reconciliation and reporting' },
];

const categories = ['All', 'AI', 'Sales', 'Data', 'Analytics', 'Support', 'E-commerce', 'HR', 'Finance'];

export function Marketplace() {
  const [items] = useState(mockMarketplace);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItems = items.filter((item) => item.featured);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
            <Store className="w-7 h-7 text-phoenix-purple-400" />
            Marketplace
          </h2>
          <p className="text-dark-500 text-sm mt-1">Discover pre-built automation solutions from the community</p>
        </div>
        <Button variant="secondary">
          <Users className="w-4 h-4" />
          Become a Creator
        </Button>
      </div>

      {featuredItems.length > 0 && category === 'All' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredItems.map((item, index) => (
            <GlassCard
              key={item.id}
              glow="purple"
              hover
              className={`p-5 space-y-3 relative overflow-hidden animate-fade-in ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-phoenix-orange-500 to-phoenix-orange-600 text-white text-xs font-medium rounded-bl-lg">
                Featured
              </div>
              <h3 className="text-lg font-semibold text-dark-100">{item.name}</h3>
              <p className="text-sm text-dark-400">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-dark-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {item.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {(item.installs / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  Install
                </Button>
                <Button variant="secondary" size="sm">
                  Preview
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${
                  category === cat
                    ? 'bg-gradient-to-r from-phoenix-purple-600 to-phoenix-cyan-600 text-white'
                    : 'glass-light text-dark-300 hover:text-dark-100'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => (
          <GlassCard
            key={item.id}
            hover
            className="p-5 space-y-3 group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-dark-100 group-hover:text-white transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-dark-500">{item.author}</p>
              </div>
              <StatusBadge status="available">{item.category}</StatusBadge>
            </div>

            <p className="text-sm text-dark-400 line-clamp-2">{item.description}</p>

            <div className="flex items-center justify-between text-sm text-dark-500">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {item.rating}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {item.installs.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1">
                Install
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
