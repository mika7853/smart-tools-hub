import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('smarttoolshub_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('smarttoolshub_cookie_consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('smarttoolshub_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white">Cookie & Privacy Notice</h4>
              <span className="text-[10px] font-bold text-gray-400">Client-Side Analytics & Preferences</span>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          SmartToolsHub uses local browser storage to save your dark mode preferences and recent tool history. All processing happens 100% inside your browser. No personal data is stored on remote servers.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
