import React from 'react';
import { Tool, RecentToolItem } from '../types';
import { TOOLS } from '../data/toolsData';
import { Clock, ArrowRight, Sparkles, Trash2 } from 'lucide-react';

interface RecentlyUsedSectionProps {
  recentTools: RecentToolItem[];
  onSelectTool: (tool: Tool) => void;
  onClearHistory?: () => void;
}

export const RecentlyUsedSection: React.FC<RecentlyUsedSectionProps> = ({
  recentTools,
  onSelectTool,
  onClearHistory,
}) => {
  if (!recentTools || recentTools.length === 0) return null;

  // Map recent items to tools
  const toolItems = recentTools
    .map((item) => {
      const tool = TOOLS.find((t) => t.id === item.toolId);
      return tool ? { tool, visitedAt: item.visitedAt } : null;
    })
    .filter((item): item is { tool: Tool; visitedAt: number } => item !== null)
    .slice(0, 6);

  if (toolItems.length === 0) return null;

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <section className="py-8 bg-indigo-50/40 dark:bg-gray-900/40 border-b border-indigo-100/60 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Recently Used Tools
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Jump right back into your recently opened utilities
              </p>
            </div>
          </div>

          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {toolItems.map(({ tool, visitedAt }) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                  {tool.category}
                </span>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {tool.name}
                </h4>
              </div>

              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span>{formatTimeAgo(visitedAt)}</span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
