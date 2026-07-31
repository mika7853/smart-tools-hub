import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Tool } from '../types';
import { TOOLS } from '../data/toolsData';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTool: (tool: Tool) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectTool,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Filter tools live for the hero dropdown
  const filteredTools = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleExploreClick = () => {
    const categoriesEl = document.getElementById('categories-section');
    if (categoriesEl) {
      categoriesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-16 sm:py-24 border-b border-gray-200/60 dark:border-gray-800">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>20+ Powerful Online Utilities • 100% Free Forever</span>
        </div>

        {/* Big Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.15]">
          Free AI & Online Tools for Everyone
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Use powerful AI tools, PDF tools, calculators, image tools, and text tools — all in one place.
        </p>

        {/* Search Bar Container */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-indigo-500/5 border border-gray-200 dark:border-gray-700 p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <div className="pl-3.5 pr-2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search tools (e.g., AI Resume, QR Code, Image Compressor, EMI)..."
              className="w-full py-2 bg-transparent text-gray-900 dark:text-white text-base outline-none placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleExploreClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0 ml-2"
            >
              <span>Explore Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search Dropdown Results */}
          {isFocused && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-30 overflow-hidden text-left divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool);
                      setSearchQuery('');
                    }}
                    className="p-3.5 hover:bg-indigo-50/60 dark:hover:bg-gray-700/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                        <p className="text-xs text-gray-500 truncate max-w-md">{tool.description}</p>
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-md">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  No matching tools found for "{searchQuery}". Try searching for PDF, Image, or Resume.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons for Mobile & Quick Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleExploreClick}
            className="sm:hidden w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
          >
            <span>Explore Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Selling Points Badges */}
        <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Fast Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No Login Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Mobile Friendly</span>
          </div>
        </div>
      </div>
    </section>
  );
};
