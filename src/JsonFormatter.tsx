import React, { useState } from 'react';
import { Braces, Copy, Check, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(
    JSON.stringify({ app: "SmartToolsHub", status: "ok", features: ["Fast", "Free", "No Login"], stats: { toolsCount: 20, rating: 4.9 } }, null, 2)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatJson = (indent: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border border-cyan-100 dark:border-cyan-900/60">
        <div className="p-3 bg-cyan-600 text-white rounded-xl shadow-md">
          <Braces className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">JSON Formatter & Validator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Prettify, format, minify, and validate raw JSON with instant syntax error highlighting.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => formatJson(2)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Prettify (2 Spaces)
            </button>
            <button
              onClick={() => formatJson(4)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer"
            >
              Prettify (4 Spaces)
            </button>
            <button
              onClick={minifyJson}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer"
            >
              Minify
            </button>
            <button
              onClick={validateJson}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 text-xs font-medium cursor-pointer"
            >
              Validate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              title="Copy JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              title="Download JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setInput('')}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error or Success Banner */}
        {error ? (
          <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>JSON Error: {error}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-medium">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Valid JSON Document</span>
          </div>
        )}

        {/* Code Editor */}
        <textarea
          rows={15}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-900 text-emerald-400 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-cyan-500 outline-none shadow-inner resize-y"
        />
      </div>
    </div>
  );
};
