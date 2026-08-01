import React, { useState } from 'react';
import {
  Lightbulb,
  Send,
  MessageSquare,
  Bug,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Wrench,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { ToolCategory } from '../types';

interface RequestToolViewProps {
  onBackHome: () => void;
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const RequestToolView: React.FC<RequestToolViewProps> = ({ onBackHome, onToast }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'feedback' | 'bug'>('request');
  const [submitted, setSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [toolTitle, setToolTitle] = useState('');
  const [category, setCategory] = useState<ToolCategory>('ai');
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      onToast('error', 'Please describe your request or feedback.');
      return;
    }

    setSubmitted(true);
    onToast(
      'success',
      activeTab === 'request'
        ? 'Tool request submitted! Our team will review it.'
        : 'Thank you for your feedback!'
    );
  };

  const resetForm = () => {
    setSubmitted(false);
    setToolTitle('');
    setDescription('');
    setUseCase('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
          Community Driven Development
        </span>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl space-y-4">
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20">
          <Lightbulb className="w-8 h-8 text-amber-300" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Request a New Tool or Give Feedback</h1>
        <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-2xl">
          Have an idea for a web utility or feature? Found a bug? Tell us what you need and our engineering team will build it zero-paywall for everyone.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            setActiveTab('request');
            resetForm();
          }}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'request'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Request a Tool
        </button>
        <button
          onClick={() => {
            setActiveTab('feedback');
            resetForm();
          }}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          General Feedback
        </button>
        <button
          onClick={() => {
            setActiveTab('bug');
            resetForm();
          }}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bug'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Bug className="w-4 h-4" />
          Report a Bug
        </button>
      </div>

      {/* Form or Confirmation */}
      {submitted ? (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Submission Received!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Thank you for helping improve SmartToolsHub. Your submission has been routed directly to our developer team backlog.
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {activeTab === 'request' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Tool Title / Idea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SVG to PNG Batch Converter"
                  value={toolTitle}
                  onChange={(e) => setToolTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ToolCategory)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ai">AI Tools</option>
                  <option value="pdf">PDF Utilities</option>
                  <option value="image">Image Processing</option>
                  <option value="text">Text Tools</option>
                  <option value="calculator">Calculators</option>
                  <option value="developer">Developer Tools</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {activeTab === 'request'
                ? 'Tool Description & Key Requirements *'
                : activeTab === 'bug'
                ? 'Describe the Bug & Steps to Reproduce *'
                : 'Your Feedback / Experience *'}
            </label>
            <textarea
              rows={4}
              required
              placeholder={
                activeTab === 'request'
                  ? 'Describe what the tool should do, input formats, output options, etc...'
                  : activeTab === 'bug'
                  ? 'Which tool had an issue? What happened vs expected?'
                  : 'Tell us how SmartToolsHub is working for you and what we can do better...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {activeTab === 'request' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Primary Use Case / Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. Designers needing high-res raster exports from Figma"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Free & Open Source Community Project
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Request</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
