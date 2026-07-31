import React, { useState } from 'react';
import { Tool, ToolCategory, BlogPost } from '../types';
import { TOOLS, CATEGORIES } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import {
  Bot,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Calculator,
  Code2,
  Sparkles,
  ArrowRight,
  Search,
  Heart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from 'lucide-react';

interface CategoryViewProps {
  categoryId: string;
  favoriteIds?: string[];
  onToggleFavorite?: (toolId: string) => void;
  onSelectTool: (tool: Tool) => void;
  onSelectPost: (post: BlogPost) => void;
  onBackHome: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  favoriteIds = [],
  onToggleFavorite,
  onSelectTool,
  onSelectPost,
  onBackHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const category = CATEGORIES.find((c) => c.id === categoryId) || {
    id: categoryId,
    name: `${categoryId.toUpperCase()} Tools`,
    description: 'Explore high-speed utilities and automated workflow converters.',
    iconName: 'Sparkles',
  };

  const categoryTools = TOOLS.filter((t) => t.category === categoryId);

  const filteredTools = categoryTools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage) || 1;
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryPosts = BLOG_POSTS.filter((p) => p.category === categoryId).slice(0, 3);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
      case 'Bot':
        return <Bot className="w-8 h-8" />;
      case 'FileText':
        return <FileText className="w-8 h-8" />;
      case 'Image':
      case 'ImageIcon':
        return <ImageIcon className="w-8 h-8" />;
      case 'Type':
      case 'AlignLeft':
        return <AlignLeft className="w-8 h-8" />;
      case 'Calculator':
        return <Calculator className="w-8 h-8" />;
      case 'Code':
      case 'Code2':
        return <Code2 className="w-8 h-8" />;
      default:
        return <Sparkles className="w-8 h-8" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Category Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${category.name} - SmartToolsHub`,
            description: category.description,
            url: `${window.location.origin}/#category-${category.id}`,
            hasPart: categoryTools.map((t) => ({
              '@type': 'SoftwareApplication',
              name: t.name,
              applicationCategory: 'UtilityApplication',
              url: `${window.location.origin}/#tool-${t.id}`,
            })),
          }),
        }}
      />

      {/* Header Hero */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5 max-w-2xl">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shrink-0 border border-white/20">
            {getCategoryIcon(category.iconName)}
          </div>
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200">
              Tool Category Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">{category.name}</h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              {category.description} Free, client-side, browser-accelerated utilities with zero speed caps or paywalls.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold text-white border border-white/20">
            {categoryTools.length} Utilities Available
          </span>
        </div>
      </div>

      {/* Search & Sub-Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search within ${category.name}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Showing {paginatedTools.length} of {filteredTools.length} tools
        </div>
      </div>

      {/* Tools Grid */}
      {paginatedTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedTools.map((tool) => {
            const isFav = favoriteIds.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md">
                      {tool.category}
                    </span>

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
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-3">
          <Wrench className="w-10 h-10 mx-auto text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No tools found matching "{searchQuery}"
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try searching for a different keyword or view all tools in other categories.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-indigo-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-indigo-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Related Category Blog Articles */}
      {categoryPosts.length > 0 && (
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Recommended {category.name} Guides
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-500">
                    {post.readTime}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
