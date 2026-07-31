import React, { useState } from 'react';
import { TOOLS } from '../data/toolsData';
import { Tool } from '../types';
import { Flame, Sparkles, ArrowRight, Heart, Zap, Award } from 'lucide-react';

interface TrendingAndLatestSectionProps {
  onSelectTool: (tool: Tool) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (toolId: string) => void;
}

export const TrendingAndLatestSection: React.FC<TrendingAndLatestSectionProps> = ({
  onSelectTool,
  favoriteIds = [],
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');

  // Filter tools
  const trendingTools = TOOLS.filter((t) => t.isPopular || t.badge === 'Popular').slice(0, 8);
  const latestTools = TOOLS.filter((t) => t.isNew || t.badge === 'New' || t.badge === 'AI Powered').slice(0, 8);

  const displayedTools = activeTab === 'trending' ? trendingTools : latestTools;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Curated Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {activeTab === 'trending' ? '🔥 Trending Utilities' : '✨ Newly Released Tools'}
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Trending ({trendingTools.length})
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'latest'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Latest Additions ({latestTools.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedTools.map((tool) => {
          const isFav = favoriteIds.includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md">
                    {tool.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {tool.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {tool.badge}
                      </span>
                    )}
                    {onToggleFavorite && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isFav
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                            : 'text-gray-300 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
