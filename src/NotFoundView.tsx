import React, { useState } from 'react';
import { Search, ArrowLeft, Home, Wrench, Sparkles, HelpCircle } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { Tool } from '../types';

interface NotFoundViewProps {
  onSelectTool: (tool: Tool) => void;
  onNavigateHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onSelectTool, onNavigateHome }) => {
  const [query, setQuery] = useState('');

  const filteredTools = query.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : TOOLS.slice(0, 6);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider border border-rose-200 dark:border-rose-800">
          404 - Page Not Found
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
          Oops! Tool or Page Not Found
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          The page or utility tool you were looking for doesn't exist or has moved. Try searching for a tool below!
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search 20+ free online tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Suggested Tools Grid */}
      <div className="space-y-4 pt-4 text-left">
        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider text-center">
          Popular Suggested Tools
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                  {tool.name}
                </h5>
                <span className="text-[10px] text-gray-400">{tool.categoryName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </button>
      </div>
    </div>
  );
};
