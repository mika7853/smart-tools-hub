import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface NewsletterSectionProps {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onToast('error', 'Please enter a valid email address.');
      return;
    }

    setSubscribed(true);
    onToast('success', 'Thank you! You have subscribed to SmartToolsHub updates.');
    setEmail('');
  };

  return (
    <section className="my-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-800/50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-indigo-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Weekly Productivity & Utility Digest
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Get New Tools & Tech Guides In Your Inbox
          </h2>
          <p className="text-sm sm:text-base text-indigo-100/80 max-w-xl mx-auto leading-relaxed">
            Join over 25,000+ developers, creators, and students. Get instant updates whenever we release new AI, PDF, or image utilities. No spam ever.
          </p>
        </div>

        {subscribed ? (
          <div className="p-6 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-500/40 text-emerald-200 flex items-center justify-center gap-3 animate-in fade-in max-w-md mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left">
              <h4 className="font-bold text-sm">Subscription Confirmed!</h4>
              <p className="text-xs text-emerald-300">You're on the list. We'll send you our monthly tool release summary.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm font-medium text-white placeholder-indigo-200/60 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-indigo-200/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Privacy Protected
          </span>
          <span>•</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </section>
  );
};
