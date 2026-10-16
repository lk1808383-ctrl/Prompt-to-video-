import React, { useState } from 'react';
import { Sparkles, Film, Compass, Clock, Zap, Menu, X, Crown } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'explore' | 'history' | 'pricing';
  setActiveTab: (tab: 'generator' | 'explore' | 'history' | 'pricing') => void;
  credits: number;
  onOpenUpgrade: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  credits,
  onOpenUpgrade,
  historyCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'generator' as const, label: 'Studio', icon: Film },
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'history' as const, label: `History (${historyCount})`, icon: Clock },
    { id: 'pricing' as const, label: 'Pricing', icon: Crown },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/30 bg-[#07070e]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="group flex cursor-pointer items-center gap-2.5 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 p-[1.5px] shadow-[0_0_18px_rgba(168,85,247,0.45)]">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0c0c17]">
              <Sparkles className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="font-extrabold tracking-tight text-lg text-white">
            VibeVideo <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links with hover states */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium transition-all whitespace-nowrap rounded-md ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action lockup with credits and upgrade CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#121124] border border-purple-900/40 text-xs font-mono tabular-nums text-purple-200">
            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span>{credits}</span>
            <span className="text-slate-500 text-[11px]">credits</span>
          </div>

          <button
            onClick={onOpenUpgrade}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Crown className="h-3.5 w-3.5 text-cyan-200" />
            <span>Upgrade Pro</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#121124] border border-purple-900/40 text-xs font-mono text-purple-200">
            <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span>{credits}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-900/30 bg-[#090916] px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenUpgrade();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md"
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to Pro ($14/mo)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
