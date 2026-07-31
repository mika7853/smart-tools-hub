import React, { useState } from 'react';
import { Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { ArrowLeft, Share2, Check, Sparkles, ShieldCheck, Heart, ArrowRight, Wrench } from 'lucide-react';

import { AiResumeBuilder } from './tools/AiResumeBuilder';
import { AiLetterWriter } from './tools/AiLetterWriter';
import { QrCodeGenerator } from './tools/QrCodeGenerator';
import { ImageCompressor } from './tools/ImageCompressor';
import { PdfToWord } from './tools/PdfToWord';
import { WordCounter } from './tools/WordCounter';
import { AgeCalculator } from './tools/AgeCalculator';
import { EmiCalculator } from './tools/EmiCalculator';
import { JsonFormatter } from './tools/JsonFormatter';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { ImageResizer } from './tools/ImageResizer';
import { ColorPicker } from './tools/ColorPicker';
import { CaseConverter } from './tools/CaseConverter';
import { LoremGenerator } from './tools/LoremGenerator';
import { PercentageCalculator } from './tools/PercentageCalculator';
import { AiPromptEnhancer } from './tools/AiPromptEnhancer';
import { PdfMerger } from './tools/PdfMerger';
import { PdfSplitter } from './tools/PdfSplitter';
import { PdfCompressor } from './tools/PdfCompressor';
import { GstCalculator } from './tools/GstCalculator';

interface ToolContainerProps {
  tool: Tool;
  favoriteIds?: string[];
  onToggleFavorite?: (toolId: string) => void;
  onSelectTool?: (tool: Tool) => void;
  onBack: () => void;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({
  tool,
  favoriteIds = [],
  onToggleFavorite,
  onSelectTool,
  onBack,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const isFav = favoriteIds.includes(tool.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };


  const renderToolComponent = () => {
    switch (tool.id) {
      case 'ai-resume-builder':
        return <AiResumeBuilder />;
      case 'ai-letter-writer':
        return <AiLetterWriter />;
      case 'qr-code-generator':
      case 'qr-generator':
        return <QrCodeGenerator />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'pdf-to-word':
        return <PdfToWord />;
      case 'word-counter':
        return <WordCounter />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'emi-calculator':
        return <EmiCalculator />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'color-picker':
        return <ColorPicker />;
      case 'case-converter':
        return <CaseConverter />;
      case 'lorem-generator':
        return <LoremGenerator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'ai-prompt-enhancer':
        return <AiPromptEnhancer />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'gst-calculator':
        return <GstCalculator />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Tool implementation in progress...
          </div>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Controls & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tools
        </button>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isFav
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
              <span>{isFav ? 'Saved' : 'Favorite'}</span>
            </button>
          )}

          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free & Private
          </span>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-medium text-xs rounded-lg cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Share Tool'}
          </button>
        </div>
      </div>

      {/* Tool Title Block */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
            {tool.category}
          </span>
          {tool.badge && (
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-md">
              {tool.badge}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {tool.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tool.description}
        </p>
      </div>

      {/* Active Tool Workspace */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        {renderToolComponent()}
      </div>

      {/* Related Tools Section */}
      {(() => {
        const related = TOOLS.filter(
          (t) => t.id !== tool.id && (t.category === tool.category || t.tags.some((tag) => tool.tags.includes(tag)))
        ).slice(0, 4);

        if (related.length === 0) return null;

        return (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Related Tools You Might Like
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  More utilities in {tool.categoryName} and related topics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((relTool) => (
                <div
                  key={relTool.id}
                  onClick={() => {
                    if (onSelectTool) {
                      onSelectTool(relTool);
                    } else {
                      onBack();
                    }
                  }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                        {relTool.category}
                      </span>
                      {relTool.badge && (
                        <span className="text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md">
                          {relTool.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {relTool.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {relTool.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Try Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
