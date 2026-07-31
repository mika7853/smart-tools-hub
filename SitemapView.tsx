import React, { useState } from 'react';
import { TOOLS, CATEGORIES } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { Copy, Check, Download, FileCode, ArrowLeft, Globe, ExternalLink, BookOpen } from 'lucide-react';
import { Tool } from '../types';

interface SitemapViewProps {
  onSelectTool: (tool: Tool) => void;
  onNavigateHome: () => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({ onSelectTool, onNavigateHome }) => {
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Site Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/#terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/#disclaimer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Categories -->
  ${CATEGORIES.map(
    (c) => `<url>
    <loc>${baseUrl}/#category-${c.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join('\n  ')}

  <!-- All Online Tools -->
  ${TOOLS.map(
    (t) => `<url>
    <loc>${baseUrl}/#tool-${t.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join('\n  ')}

  <!-- Blog Articles -->
  ${BLOG_POSTS.map(
    (p) => `<url>
    <loc>${baseUrl}/#blog-${p.slug}</loc>
    <lastmod>${p.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n  ')}
</urlset>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([sitemapXml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">XML Sitemap Index</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Structured sitemap index for search engines (Google, Bing, Yandex).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied XML!' : 'Copy XML'}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download sitemap.xml
          </button>
        </div>
      </div>

      {/* Visual Tools Directory Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white">
          Visual Navigation Index ({TOOLS.length} Tools)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">{tool.name}</h4>
                <span className="text-[10px] text-gray-400">{tool.categoryName}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* XML Code Container */}
      <div className="bg-gray-900 rounded-3xl p-6 text-emerald-400 font-mono text-xs overflow-x-auto space-y-2 border border-gray-800 shadow-inner">
        <div className="flex justify-between items-center text-gray-500 text-[11px] pb-2 border-b border-gray-800">
          <span>Raw XML Output</span>
          <span>UTF-8 Encoding</span>
        </div>
        <pre>{sitemapXml}</pre>
      </div>
    </div>
  );
};
