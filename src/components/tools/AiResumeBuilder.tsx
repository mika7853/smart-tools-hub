import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, Printer, FileBadge, RefreshCw, Layers } from 'lucide-react';

export const AiResumeBuilder: React.FC = () => {
  const [name, setName] = useState('Alex Morgan');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Developer');
  const [experience, setExperience] = useState('6+ years (Senior)');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Express, Tailwind CSS, PostgreSQL, Cloud Deployments, System Design');
  const [keyAchievements, setKeyAchievements] = useState('Led a team of 5 engineers to revamp core platform, improving page speed by 45% and boosting user retention by 28%. Managed migration to microservices.');
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiData, setAiData] = useState<{
    headline: string;
    professionalSummary: string;
    bulletPoints: string[];
    suggestedSkills: string[];
  }>({
    headline: 'Senior Full Stack Developer | Scalable Web Systems & Cloud Architecture',
    professionalSummary: 'Results-driven Senior Full Stack Developer with 6+ years of expertise in architecting high-performance web applications, cloud solutions, and responsive user interfaces. Proven track record of boosting system efficiency by 45% and leading high-performing engineering teams.',
    bulletPoints: [
      'Architected and deployed enterprise React & Node.js applications serving 500k+ monthly active users with 99.9% uptime.',
      'Led cross-functional team of 5 developers to overhaul legacy monolithic architecture into modern REST & GraphQL microservices.',
      'Optimized database queries and API response times, resulting in a 45% improvement in page load speed and 28% increase in retention.',
      'Mentored junior engineers, established automated CI/CD pipelines, and reduced release deployment times by 60%.'
    ],
    suggestedSkills: ['React.js', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'REST APIs', 'System Design', 'CI/CD Pipelines', 'Team Leadership']
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          jobTitle,
          experience,
          skills,
          keyAchievements,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiData({
          headline: data.headline || `${jobTitle} | ${experience}`,
          professionalSummary: data.professionalSummary,
          bulletPoints: data.bulletPoints || [],
          suggestedSkills: data.suggestedSkills || skills.split(',').map(s => s.trim()),
        });
      } else {
        // Fallback generator
        generateFallback();
      }
    } catch {
      generateFallback();
    } finally {
      setLoading(false);
    }
  };

  const generateFallback = () => {
    setAiData({
      headline: `${jobTitle} | ${experience}`,
      professionalSummary: `Dynamic and detail-oriented ${jobTitle} with ${experience} delivering top-tier digital products. Demonstrated expertise in ${skills.split(',').slice(0, 3).join(', ')}, specializing in creating scalable solutions that drive measurable business outcomes.`,
      bulletPoints: [
        `Spearheaded major technical initiatives in ${jobTitle} role, improving team efficiency and system reliability.`,
        `Successfully integrated key technologies including ${skills.split(',').slice(0, 4).join(', ')}.`,
        `Achieved key operational milestone: ${keyAchievements || 'Streamlined core workflows and enhanced overall productivity.'}`,
        `Collaborated with cross-functional stakeholders to deliver features on schedule while maintaining strict code quality.`
      ],
      suggestedSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  const handleCopyText = () => {
    const fullResumeText = `
NAME: ${name}
TITLE: ${aiData.headline}

SUMMARY:
${aiData.professionalSummary}

KEY HIGHLIGHTS & ACHIEVEMENTS:
${aiData.bulletPoints.map(b => `• ${b}`).join('\n')}

CORE SKILLS:
${aiData.suggestedSkills.join(' • ')}
    `.trim();

    navigator.clipboard.writeText(fullResumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const fullResumeText = `
========================================
${name.toUpperCase()}
${aiData.headline}
========================================

PROFESSIONAL SUMMARY
----------------------------------------
${aiData.professionalSummary}

KEY RESPONSIBILITIES & ACHIEVEMENTS
----------------------------------------
${aiData.bulletPoints.map(b => `• ${b}`).join('\n')}

SKILLS & COMPETENCIES
----------------------------------------
${aiData.suggestedSkills.join(', ')}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([fullResumeText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
            <FileBadge className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Resume & CV Builder</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fill in your basic details and let Gemini AI generate tailored executive summary & bullet points.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all disabled:opacity-50 text-sm whitespace-nowrap cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating AI Content...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-base border-b border-gray-100 dark:border-gray-700 pb-3">
              Candidate Information
            </h4>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Target Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Years / Level of Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Key Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Key Achievements & Metrics
              </label>
              <textarea
                rows={3}
                value={keyAchievements}
                onChange={(e) => setKeyAchievements(e.target.value)}
                placeholder="Mention specific numbers, team sizes, percent improvements..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Resume Style Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTemplate('modern')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    template === 'modern'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Modern
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate('minimal')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    template === 'minimal'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Minimal
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate('executive')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    template === 'executive'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Executive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action toolbar */}
          <div className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
              Live Preview & Export
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable Resume Canvas */}
          <div
            id="printable-resume"
            className={`p-8 bg-white text-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[500px] space-y-6 ${
              template === 'executive'
                ? 'font-serif border-t-8 border-t-slate-800'
                : template === 'minimal'
                ? 'font-sans border-l-4 border-l-indigo-600'
                : 'font-sans'
            }`}
          >
            {/* Header section */}
            <div className={`${template === 'modern' ? 'border-b-2 border-indigo-600 pb-4' : 'border-b border-gray-200 pb-3'}`}>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{name || 'Your Name'}</h1>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mt-0.5">
                {aiData.headline}
              </p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {aiData.professionalSummary}
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
                Key Accomplishments & Experience Highlights
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 pl-4 list-disc">
                {aiData.bulletPoints.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Skills Badges */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
                Core Competencies & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {aiData.suggestedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
