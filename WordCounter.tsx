import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Trash2,
  Download,
  Volume2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Hash,
  Share2,
} from 'lucide-react';

interface PlatformLimit {
  id: string;
  name: string;
  max: number;
}

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    `SmartToolsHub is a modern, fast, and privacy-first suite of free online utilities. Whether you need an AI Resume Builder to craft career documents, an Image Compressor to reduce website file sizes, an EMI Calculator for loan planning, or a Cryptographic Password Generator, SmartToolsHub brings all essential web tools under one roof. Try writing or pasting your article here to analyze word count, character limits, reading duration, and keyword density in real-time!`
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [selectedLimitId, setSelectedLimitId] = useState<string>('twitter');
  const [customLimit, setCustomLimit] = useState<number>(500);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Platform character limits
  const platformLimits: PlatformLimit[] = [
    { id: 'twitter', name: 'Twitter / X', max: 280 },
    { id: 'meta', name: 'SEO Meta Description', max: 160 },
    { id: 'linkedin', name: 'LinkedIn Post', max: 3000 },
    { id: 'instagram', name: 'Instagram Caption', max: 2200 },
    { id: 'facebook', name: 'Facebook Post', max: 63206 },
    { id: 'custom', name: 'Custom Limit', max: customLimit },
  ];

  const activeLimitObj = platformLimits.find((p) => p.id === selectedLimitId) || platformLimits[0];
  const maxChars = activeLimitObj.id === 'custom' ? customLimit : activeLimitObj.max;

  // Real-time Text Analysis Calculations
  const cleanText = text.trim();
  const wordsArray = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = wordsArray.length;
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, '').length;
  const sentenceCount = cleanText ? (cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText]).length : 0;
  const paragraphCount = cleanText ? cleanText.split(/\n\s*\n/).filter(Boolean).length : 0;

  // Reading time (average 200 words per minute)
  const readingSeconds = Math.ceil((wordCount / 200) * 60);
  const readingMinutes = Math.floor(readingSeconds / 60);
  const readingRemSeconds = readingSeconds % 60;

  // Speaking time (average 130 words per minute)
  const speakingSeconds = Math.ceil((wordCount / 130) * 60);
  const speakingMinutes = Math.floor(speakingSeconds / 60);
  const speakingRemSeconds = speakingSeconds % 60;

  // Character Limit Progress
  const limitProgress = Math.min(100, Math.round((charCountWithSpaces / maxChars) * 100));
  const charsRemaining = maxChars - charCountWithSpaces;
  const isOverLimit = charCountWithSpaces > maxChars;

  // Keyword Density Analysis (Top 8 Keywords)
  const getTopKeywords = () => {
    if (wordsArray.length === 0) return [];
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'your',
      'you', 'as', 'will', 'can', 'has', 'have', 'had', 'not', 'all', 'we', 'they', 'he', 'she',
    ]);
    const map: Record<string, number> = {};

    wordsArray.forEach((w) => {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (lower.length > 2 && !stopWords.has(lower)) {
        map[lower] = (map[lower] || 0) + 1;
      }
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / wordCount) * 100).toFixed(1),
      }));
  };

  const keywords = getTopKeywords();

  // Case Transformation Utilities
  const transformCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'clean') => {
    if (!text) return;
    if (type === 'upper') setText(text.toUpperCase());
    if (type === 'lower') setText(text.toLowerCase());
    if (type === 'title') {
      setText(
        text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
      );
    }
    if (type === 'sentence') {
      setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()));
    }
    if (type === 'clean') {
      setText(text.replace(/\s+/g, ' ').trim());
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analyzed-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      q: 'How does real-time word and character counting work?',
      a: 'As you type or paste text, SmartToolsHub instantly computes key metrics locally in your browser using regular expressions. It counts words separated by whitespace, characters with/without spaces, sentences, and line breaks without sending data to any external server.',
    },
    {
      q: 'What is ideal Keyword Density for SEO?',
      a: 'For optimal Search Engine Optimization (SEO), key target terms should ideally maintain a keyword density between 1% and 3%. Overusing keywords (keyword stuffing) can trigger search engine penalties, while underusing them might lower relevancy.',
    },
    {
      q: 'How are Reading and Speaking times calculated?',
      a: 'Reading time is computed using the global average silent reading speed of 200 words per minute (WPM). Speaking time uses the standard public presentation rate of 130 WPM, helping you prepare speeches and video scripts accurately.',
    },
    {
      q: 'Why check social media character limits?',
      a: 'Platforms like Twitter/X (280 chars), Instagram (2,200 chars), and Google Meta Descriptions (160 chars) truncate text that exceeds their maximum length. Using our character progress tracker ensures your posts remain un-cropped.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Word Counter & Text Analyzer',
            url: window.location.href,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Real-time word counter, character calculator, sentence counter, reading speed estimator, and keyword density text analysis tool.',
          }),
        }}
      />

      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Word Counter & Text Analyzer</h2>
            <p className="text-xs text-amber-100 mt-1">
              Analyze word count, character limits, reading time, and keyword frequency in real-time.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          Instant Auto-Update
        </span>
      </div>

      {/* Top Real-time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            Words
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {wordCount.toLocaleString()}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            Characters
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {charCountWithSpaces.toLocaleString()}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            No Spaces
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {charCountNoSpaces.toLocaleString()}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            Sentences
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {sentenceCount}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            Paragraphs
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {paragraphCount}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
            Reading Time
          </span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-2 block">
            {readingMinutes > 0 ? `${readingMinutes}m ${readingRemSeconds}s` : `${readingRemSeconds}s`}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => transformCase('sentence')}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                Sentence case
              </button>
              <button
                onClick={() => transformCase('title')}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                Title Case
              </button>
              <button
                onClick={() => transformCase('upper')}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => transformCase('lower')}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                lowercase
              </button>
              <button
                onClick={() => transformCase('clean')}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                Trim Spaces
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                disabled={!text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer transition-colors"
                title="Download as .txt"
              >
                <Download className="w-3.5 h-3.5" />
                TXT
              </button>

              <button
                onClick={() => setText('')}
                disabled={!text}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl disabled:opacity-50 cursor-pointer transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Textarea Input */}
          <textarea
            rows={14}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text content here to start analyzing..."
            className="w-full p-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-amber-500 outline-none resize-y shadow-sm"
          />

          {/* Character Limit Tracker Widget */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Character Limit Progress Bar
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLimitId}
                  onChange={(e) => setSelectedLimitId(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-xl outline-none"
                >
                  {platformLimits.map((plat) => (
                    <option key={plat.id} value={plat.id}>
                      {plat.name} ({plat.id === 'custom' ? customLimit : plat.max} chars)
                    </option>
                  ))}
                </select>

                {selectedLimitId === 'custom' && (
                  <input
                    type="number"
                    min={10}
                    max={100000}
                    value={customLimit}
                    onChange={(e) => setCustomLimit(Math.max(1, Number(e.target.value) || 100))}
                    className="w-20 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-xl text-center"
                  />
                )}
              </div>
            </div>

            {/* Progress Bar & Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">
                  {charCountWithSpaces.toLocaleString()} / {maxChars.toLocaleString()} characters used
                </span>
                <span className={isOverLimit ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-gray-700 dark:text-gray-300'}>
                  {isOverLimit ? `${Math.abs(charsRemaining)} over limit!` : `${charsRemaining} remaining`}
                </span>
              </div>

              <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isOverLimit ? 'bg-rose-500' : limitProgress > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${limitProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Speaking Speed Card */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
              Audio Speech Estimator
            </span>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-800">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Speaking Time (130 WPM)</p>
                <p className="text-base font-black text-gray-900 dark:text-white">
                  {speakingMinutes > 0 ? `${speakingMinutes}m ${speakingRemSeconds}s` : `${speakingRemSeconds}s`}
                </p>
              </div>
            </div>
          </div>

          {/* Top Keyword Density Table */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Top Keyword Density
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {keywords.length} terms
              </span>
            </div>

            {keywords.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Enter text to see keyword frequency breakdown.</p>
            ) : (
              <div className="space-y-3">
                {keywords.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-800 dark:text-gray-200 capitalize">
                        {item.word}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono text-[11px]">{item.count}x</span>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold rounded-md border border-amber-200/50 dark:border-amber-800">
                          {item.percent}%
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, Number(item.percent) * 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-gray-900 dark:text-white flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-amber-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
