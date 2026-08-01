import React from 'react';
import { Zap, ShieldCheck, UserCheck, Smartphone } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: 'Fast',
      description:
        'Instant processing with zero server lag. Client-side browser execution combined with high-speed Gemini AI models.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'Free',
      description:
        '100% free with no hidden paywalls, subscription tiers, or restrictive daily generation limits.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: 'No Login Required',
      description:
        'Jump right in and start working immediately. We do not require email registration or password accounts.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      title: 'Mobile Friendly',
      description:
        'Responsive layout designed specifically for effortless use on smartphones, tablets, and desktop displays.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Built for Speed, Privacy, & Ease of Use
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-xs">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
