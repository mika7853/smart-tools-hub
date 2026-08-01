import React, { useState } from 'react';
import { Copy, Check, Download, ShieldCheck, ArrowLeft } from 'lucide-react';

export const RobotsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;

  const robotsTxt = `# SmartToolsHub Robots.txt
User-agent: *
Allow: /

# Disallow private user routes
Disallow: /#dashboard
Disallow: /#auth

# Crawl-delay for optimal performance
Crawl-delay: 1

# Sitemap Location
Sitemap: ${baseUrl}/sitemap.xml
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Robots.txt Directive</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Standard web crawler instructions for Search Engine Optimization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download robots.txt
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl p-6 text-emerald-400 font-mono text-xs overflow-x-auto border border-gray-800 shadow-inner">
        <pre>{robotsTxt}</pre>
      </div>
    </div>
  );
};
