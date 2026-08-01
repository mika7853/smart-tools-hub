import React from 'react';
import { Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { Sparkles, ArrowRight, Bot, FileText, QrCode, Image as ImageIcon, FileCheck, Hash, Calendar, BadgePercent, Code2, Heart } from 'lucide-react';

interface PopularToolsSectionProps {
  selectedCategory: string | null;
  searchQuery: string;
  favoriteIds?: string[];
  onToggleFavorite?: (toolId: string) => void;
  onSelectTool: (tool: Tool) => void;
}

export const PopularToolsSection: React.FC<PopularToolsSectionProps> = ({
  selectedCategory,
  searchQuery,
  favoriteIds = [],
  onToggleFavorite,
  onSelectTool,
}) => {
  // Filter tools based on category and search query
  let filteredTools = TOOLS;

  if (selectedCategory) {
    filteredTools = filteredTools.filter((t) => t.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredTools = filteredTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'ai-resume-builder':
      case 'ai-letter-writer':
      case 'ai-prompt-enhancer':
        return <Bot className="w-5 h-5" />;
      case 'qr-code-generator':
        return <QrCode className="w-5 h-5" />;
      case 'image-compressor':
      case 'image-resizer':
      case 'color-picker':
        return <ImageIcon className="w-5 h-5" />;
      case 'pdf-to-word':
      case 'pdf-merger':
      case 'pdf-splitter':
      case 'pdf-compressor':
        return <FileCheck className="w-5 h-5" />;
      case 'word-counter':
      case 'case-converter':
      case 'lorem-generator':
        return <Hash className="w-5 h-5" />;
      case 'age-calculator':
        return <Calendar className="w-5 h-5" />;
      case 'emi-calculator':
      case 'percentage-calculator':
      case 'gst-calculator':
        return <BadgePercent className="w-5 h-5" />;
      case 'json-formatter':
      case 'password-generator':
        return <Code2 className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="popular-tools-section" className="py-12 bg-gray-50/60 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">
              {selectedCategory ? `Filtered Tools (${filteredTools.length})` : 'Most Requested Utilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {selectedCategory ? 'Tools in Selected Category' : 'Popular Tools'}
            </h2>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No tools found matching your search. Try adjusting keywords or category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => {
              const isFav = favoriteIds.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {getToolIcon(tool.id)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800">
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
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

