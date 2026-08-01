import React, { useState } from 'react';
import { AlignLeft, Copy, Check, RefreshCw } from 'lucide-react';

export const LoremGenerator: React.FC = () => {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startLorem, setStartLorem] = useState<boolean>(true);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const baseText = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tiddunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit."
  ];

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      const paras = [];
      for (let i = 0; i < count; i++) {
        let p = baseText[i % baseText.length];
        if (i === 0 && startLorem && !p.startsWith('Lorem ipsum')) {
          p = 'Lorem ipsum dolor sit amet, ' + p.toLowerCase();
        }
        paras.push(p);
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents = [];
      for (let i = 0; i < count; i++) {
        sents.push(baseText[i % baseText.length]);
      }
      result = sents.join(' ');
    } else {
      const words = baseText.join(' ').split(' ');
      result = words.slice(0, count).join(' ');
    }
    setOutput(result);
  };

  React.useEffect(() => {
    generate();
  }, [type, count, startLorem]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-100 dark:border-amber-900/60">
        <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md">
          <AlignLeft className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lorem Ipsum Placeholder Generator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Generate clean dummy text by paragraphs, sentences, or word counts for design mockups.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Count ({count})</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-800 dark:text-gray-200"
              />
            </div>

            <label className="flex items-center gap-2 pt-4 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startLorem}
                onChange={(e) => setStartLorem(e.target.checked)}
                className="accent-amber-600"
              />
              Start with "Lorem ipsum"
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          readOnly
          value={output}
          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-sans leading-relaxed outline-none"
        />
      </div>
    </div>
  );
};
