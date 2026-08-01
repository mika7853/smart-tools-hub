import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, BarChart3, Search, Sparkles } from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [gaMeasurementId, setGaMeasurementId] = useState<string>(() => {
    return localStorage.getItem('smarttoolshub_ga_id') || '';
  });
  const [gscMetaTag, setGscMetaTag] = useState<string>(() => {
    return localStorage.getItem('smarttoolshub_gsc_meta') || '';
  });
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (gaMeasurementId) {
      // Dynamically inject GA tag if provided
      const existingScript = document.getElementById('ga-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline-script';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    if (gscMetaTag) {
      let metaCode = gscMetaTag;
      if (metaCode.includes('content=')) {
        const match = metaCode.match(/content=["']([^"']+)["']/);
        if (match) metaCode = match[1];
      }
      let existingMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!existingMeta) {
        existingMeta = document.createElement('meta');
        existingMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(existingMeta);
      }
      existingMeta.setAttribute('content', metaCode);
    }
  }, [gaMeasurementId, gscMetaTag]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('smarttoolshub_ga_id', gaMeasurementId);
    localStorage.setItem('smarttoolshub_gsc_meta', gscMetaTag);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            SEO & Webmaster Tools
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">
            Google Analytics & Search Console
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Integrate live Google Analytics tracking and verify ownership with Google Search Console.
          </p>
        </div>

        {saved ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 text-center font-bold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            SEO Configurations Saved & Applied!
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Google Analytics Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={gaMeasurementId}
                onChange={(e) => setGaMeasurementId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Enables real-time pageview and event tracking directly in your Google Analytics dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Google Search Console Meta Verification Code
              </label>
              <input
                type="text"
                value={gscMetaTag}
                onChange={(e) => setGscMetaTag(e.target.value)}
                placeholder="google-site-verification code or full meta tag"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Injects the official verification meta tag into document &lt;head&gt;.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              Save & Apply SEO Integration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
