import React, { useState } from 'react';
import { BlogPost, Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Wrench,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBackToBlog: () => void;
  onSelectTool: (tool: Tool) => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBackToBlog,
  onSelectTool,
  onSelectPost,
}) => {
  const [copied, setCopied] = useState(false);

  const relatedTool = post.relatedToolId
    ? TOOLS.find((t) => t.id === post.relatedToolId)
    : null;

  const otherArticles = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Schema.org BlogPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: {
              '@type': 'Organization',
              name: post.author,
              url: window.location.origin,
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartToolsHub',
              logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${window.location.origin}/#blog-${post.slug}`,
            },
          }),
        }}
      />

      {/* Back Button */}
      <button
        onClick={onBackToBlog}
        className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-500 transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog Directory
      </button>

      {/* Article Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs rounded-full uppercase tracking-wider border border-indigo-200/50 dark:border-indigo-800/50">
              {post.category}
            </span>
            <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>

        {/* H1 Main Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {/* Author Meta */}
        <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 font-bold">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-500" />
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Published on {post.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Prominent Related Online Tool Banner */}
      {relatedTool && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-white/20 text-indigo-100 px-2 py-0.5 rounded-md">
                Featured Online Tool
              </span>
              <h3 className="text-lg font-black mt-1">{relatedTool.name}</h3>
              <p className="text-xs text-indigo-100 mt-0.5 max-w-lg">
                {relatedTool.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTool(relatedTool)}
            className="px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <span>Launch Free Tool</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Article Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div
          className="prose prose-indigo dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-4 text-sm sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Recommended Articles Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          More Recommended Guides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectPost(art)}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-indigo-500">
                  {art.category}
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {art.title}
                </h4>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
