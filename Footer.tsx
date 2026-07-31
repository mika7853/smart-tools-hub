import React, { useState } from 'react';
import { ShieldCheck, Heart, Wrench, Sparkles, Send, CheckCircle2, FileCode, Search } from 'lucide-react';
import { ActiveView } from '../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onSelectCategory?: (category: string) => void;
  onOpenAnalytics?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onSelectCategory, onOpenAnalytics }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                SmartTools<span className="text-indigo-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              SmartToolsHub is an all-in-one suite offering free AI tools, PDF converters, calculators, image utilities, and developer tools — fast, secure, and mobile optimized.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Stay Updated
              </h5>
              {subscribed ? (
                <div className="p-2.5 bg-emerald-950/60 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Subscribed! Thank you.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-xs rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Featured Tool Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('ai');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('pdf');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PDF Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('image');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Image Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('text');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Text Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('calculator');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    if (onSelectCategory) onSelectCategory('developer');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Developer Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Pages & Legal */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('request-tool')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer font-bold text-indigo-400 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Request a Tool / Bug Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('blog')}
                  className="hover:text-white transition-colors cursor-pointer text-indigo-300"
                >
                  Blog & Tech Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Webmaster & SEO Tools */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              SEO & Webmaster Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('sitemap')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Sitemap.xml
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('robots')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Robots.txt
                </button>
              </li>
              {onOpenAnalytics && (
                <li>
                  <button
                    onClick={onOpenAnalytics}
                    className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5 text-indigo-400 font-semibold"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Google Analytics & GSC
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} SmartToolsHub. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Fast • Secure • Private • Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
