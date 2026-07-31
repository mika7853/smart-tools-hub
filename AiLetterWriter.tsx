import React, { useState } from 'react';
import { PenTool, Sparkles, Copy, Check, Download, RefreshCw, FileText } from 'lucide-react';

export const AiLetterWriter: React.FC = () => {
  const [letterType, setLetterType] = useState('Cover Letter');
  const [senderName, setSenderName] = useState('Sarah Jenkins');
  const [recipient, setRecipient] = useState('Hiring Manager');
  const [jobTitle, setJobTitle] = useState('Product Marketing Manager');
  const [company, setCompany] = useState('Acme Technologies');
  const [tone, setTone] = useState('Professional & Persuasive');
  const [keyPoints, setKeyPoints] = useState('Increased SaaS revenue by 35% in previous role, passion for brand strategy, strong cross-functional background');

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<{
    subject: string;
    letterBody: string;
    keyHighlightsSummary: string[];
    tips: string;
  }>({
    subject: 'Application for Product Marketing Manager Position - Sarah Jenkins',
    letterBody: `Dear Hiring Manager,

I am writing to express my enthusiasm for the Product Marketing Manager role at Acme Technologies. With over 5 years of experience scaling tech products and a proven track record of boosting revenue by 35%, I am eager to contribute to Acme's strategic growth.

In my previous position, I spearheaded integrated marketing campaigns that reached over 1 million users, driving both brand awareness and qualified customer acquisition. My background in cross-functional collaboration allows me to seamlessly bridge the gap between product development and market execution.

What excites me most about Acme Technologies is your commitment to customer-centric innovation. I look forward to bringing my strategic mindset and hands-on execution skills to your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my background aligns with your vision.

Sincerely,
Sarah Jenkins`,
    keyHighlightsSummary: [
      'Tailored opening highlighting key role interest',
      'Quantifiable achievement (35% revenue boost)',
      'Value alignment with target company mission'
    ],
    tips: 'Always customize the hiring manager name if available on LinkedIn before sending.'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType,
          senderName,
          recipient,
          jobTitle,
          company,
          tone,
          keyPoints,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOutput({
          subject: data.subject || `${letterType}: ${jobTitle} - ${senderName}`,
          letterBody: data.letterBody,
          keyHighlightsSummary: data.keyHighlightsSummary || [],
          tips: data.tips || 'Review and personalize before sending.',
        });
      } else {
        fallbackGenerate();
      }
    } catch {
      fallbackGenerate();
    } finally {
      setLoading(false);
    }
  };

  const fallbackGenerate = () => {
    let body = '';
    if (letterType.toLowerCase().includes('resignation')) {
      body = `Dear ${recipient || 'Manager'},\n\nPlease accept this letter as formal notification that I am resigning from my position as ${jobTitle || 'Team Member'} at ${company || 'the company'}. My last day of employment will be two weeks from today.\n\nI want to express my sincere gratitude for the opportunities I have had during my time with ${company || 'the team'}. I have enjoyed working alongside my colleagues and appreciate the professional growth I experienced here.\n\nDuring my remaining time, I am committed to facilitating a smooth handover of my responsibilities: ${keyPoints}.\n\nI wish the company continued success in the future.\n\nSincerely,\n${senderName}`;
    } else if (letterType.toLowerCase().includes('thank')) {
      body = `Dear ${recipient || 'Interviewer'},\n\nThank you for taking the time to speak with me today regarding the ${jobTitle || 'open position'} at ${company || 'your organization'}.\n\nOur conversation reinforced my enthusiasm for the role, particularly our discussion regarding ${keyPoints || 'team goals and upcoming initiatives'}. I am confident that my background aligns well with what you are seeking.\n\nPlease let me know if you need any additional information. I look forward to hearing from you regarding next steps.\n\nBest regards,\n${senderName}`;
    } else {
      body = `Dear ${recipient || 'Hiring Manager'},\n\nI am writing to express my strong interest in the ${jobTitle || 'Role'} position at ${company || 'Company'}.\n\nWith a strong background and proven track record (${keyPoints}), I am confident in my ability to make an immediate impact. My focus has always been delivering results with a ${tone.toLowerCase()} approach.\n\nThank you for considering my application. I look forward to discussing how my experience will benefit ${company}.\n\nSincerely,\n${senderName}`;
    }

    setOutput({
      subject: `${letterType} - ${jobTitle} - ${senderName}`,
      letterBody: body,
      keyHighlightsSummary: ['Formal greeting & purpose statement', 'Core highlights & value proposition', 'Polite closing and next steps'],
      tips: 'Read aloud once before sending to verify tone flow.'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`SUBJECT: ${output.subject}\n\n${output.letterBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textContent = `SUBJECT: ${output.subject}\n\n${output.letterBody}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${letterType.replace(/\s+/g, '_')}_${senderName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Formal Letter Writer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate custom cover letters, resignation letters, thank you notes, and formal emails instantly.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all disabled:opacity-50 text-sm cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating Letter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Letter
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-base border-b border-gray-100 dark:border-gray-700 pb-3">
              Letter Specifications
            </h4>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Letter Type
              </label>
              <select
                value={letterType}
                onChange={(e) => setLetterType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Cover Letter">Cover Letter</option>
                <option value="Resignation Letter">Resignation Letter</option>
                <option value="Thank You / Post-Interview Letter">Thank You / Post-Interview Letter</option>
                <option value="Formal Request / Proposal Letter">Formal Request / Proposal Letter</option>
                <option value="Recommendation Request">Recommendation Request</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Job Role / Subject
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Writing Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Professional & Persuasive">Professional & Persuasive</option>
                <option value="Confident & Enthusiastic">Confident & Enthusiastic</option>
                <option value="Formal & Direct">Formal & Direct</option>
                <option value="Polite & Grateful">Polite & Grateful</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Key Points to Emphasize
              </label>
              <textarea
                rows={3}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Key accomplishments, notice periods, or special details..."
              />
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Generated Letter Output
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Text
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Subject Line
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                {output.subject}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Editable Letter Body
              </span>
              <textarea
                rows={12}
                value={output.letterBody}
                onChange={(e) => setOutput({ ...output, letterBody: e.target.value })}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              />
            </div>

            {output.tips && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <strong>Pro Tip:</strong> {output.tips}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
