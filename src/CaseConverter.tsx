import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Trash2 } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>(
    'SmartToolsHub provides powerful web tools for productivity, development, and career growth.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());
  const toTitleCase = () =>
    setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()));
  const toSentenceCase = () =>
    setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()));
  const toCamelCase = () =>
    setText(
      text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+/g, '')
    );
  const toKebabCase = () =>
    setText(
      text
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
    );
  const toSnakeCase = () =>
    setText(
      text
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase()
    );

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-100 dark:border-amber-900/60">
        <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Text Case Converter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Convert strings between UPPERCASE, lowercase, Title Case, camelCase, kebab-case, and snake_case.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toUppercase}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              UPPERCASE
            </button>
            <button
              onClick={toLowercase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              lowercase
            </button>
            <button
              onClick={toTitleCase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              Title Case
            </button>
            <button
              onClick={toSentenceCase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              Sentence case
            </button>
            <button
              onClick={toCamelCase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              camelCase
            </button>
            <button
              onClick={toKebabCase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              kebab-case
            </button>
            <button
              onClick={toSnakeCase}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              snake_case
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setText('')}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-amber-500 outline-none resize-y"
        />
      </div>
    </div>
  );
};
