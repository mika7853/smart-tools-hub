import React, { useState } from 'react';
import { Sparkle, Copy, Check, RefreshCw } from 'lucide-react';

export const AiPromptEnhancer: React.FC = () => {
  const [draftPrompt, setDraftPrompt] = useState<string>('Write a blog post about artificial intelligence in healthcare');
  const [targetAi, setTargetAi] = useState<string>('Gemini');
  const [role, setRole] = useState<string>('Senior Technical Writer & Medical AI Specialist');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const enhance = () => {
    const master = `ACT AS AN EXPERT ${role.toUpperCase()}.

PRIMARY TASK:
${draftPrompt}

CONTEXT & TARGET AUDIENCE:
Targeted for professionals and decision-makers looking for practical insights, clear examples, and actionable takeaways.

CONSTRAINTS & GUIDELINES:
- Use clear, authoritative, yet engaging language.
- Structure content with concise headings, subheadings, and bullet points.
- Include 3 specific real-world case studies or examples.
- Provide a summary table or key takeaways section at the end.
- Avoid generic buzzwords; explain technical concepts simply.

OUTPUT FORMAT:
Fully formatted Markdown with title, introduction, main body, actionable steps, and conclusion.`;

    setEnhancedPrompt(master);
  };

  React.useEffect(() => {
    enhance();
  }, [draftPrompt, role, targetAi]);

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
          <Sparkle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Master Prompt Generator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Transform simple 1-line ideas into structured, high-performing master prompts for Gemini, ChatGPT, and Claude.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Your Initial Rough Idea
              </label>
              <textarea
                rows={4}
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Assigned AI Persona / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Target AI Model
              </label>
              <select
                value={targetAi}
                onChange={(e) => setTargetAi(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none"
              >
                <option value="Gemini">Google Gemini</option>
                <option value="ChatGPT">ChatGPT / OpenAI</option>
                <option value="Claude">Anthropic Claude</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
              Optimized Master Prompt Output
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Master Prompt'}
            </button>
          </div>

          <textarea
            rows={12}
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-900 text-indigo-300 font-mono text-xs leading-relaxed outline-none"
          />
        </div>
      </div>
    </div>
  );
};
