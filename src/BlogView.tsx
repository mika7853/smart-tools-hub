import React, { useState } from 'react';
import { BlogPost, ToolCategory, Tool } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { TOOLS } from '../data/toolsData';
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, Sparkles, Tag, Wrench } from 'lucide-react';

interface BlogViewProps {
  onSelectPost: (post: BlogPost) => void;
  onSelectTool: (tool: Tool) => void;
  onBackHome: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onSelectPost, onSelectTool, onBackHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'pdf', name: 'PDF Tools' },
    { id: 'image', name: 'Image Tools' },
    { id: 'ai', name: 'AI Guides' },
    { id: 'calculator', name: 'Financial & Math' },
    { id: 'developer', name: 'Developer' },
    { id: 'text', name: 'Text Utilities' },
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Schema.org Blog List JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'SmartToolsHub Tech & Productivity Blog',
            description: 'Free guides, tutorials, and tips on PDF compression, AI resume building, image optimization, financial calculations, and web development tools.',
            url: `${window.location.origin}/#blog`,
            blogPost: BLOG_POSTS.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              author: {
                '@type': 'Organization',
                name: post.author,
              },
              url: `${window.location.origin}/#blog-${post.slug}`,
            })),
          }),
        }}
      />

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-indigo-100 border border-white/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SmartToolsHub Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Productivity & Tech Guides
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            In-depth tutorials, expert SEO tips, and workflow guides on PDF editing, image optimization, AI tools, and developer utilities.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold text-white border border-white/20">
            20+ Free Articles
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto sm:mx-0">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by keyword or tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const relatedTool = post.relatedToolId ? TOOLS.find((t) => t.id === post.relatedToolId) : null;

            return (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700/80 p-6 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
                      {post.category}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Related Tool Pill */}
                  {relatedTool && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(relatedTool);
                      }}
                      className="p-2.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Wrench className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                          Try: {relatedTool.name}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.publishedAt}</span>
                  </div>

                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No Articles Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try adjusting your search query or switching category filters.
          </p>
        </div>
      )}
    </div>
  );
};
