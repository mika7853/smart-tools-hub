import React, { useState } from 'react';
import { ActiveView } from '../types';
import { ArrowLeft, Send, CheckCircle2, ShieldCheck, FileText, Mail, HelpCircle } from 'lucide-react';

interface InfoModalsProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({ activeView, setActiveView }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      setActiveView('home');
    }, 2500);
  };

  if (activeView === 'home') return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => setActiveView('home')}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* About View */}
      {activeView === 'about' && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">About SmartToolsHub</h2>
            <p className="text-sm text-gray-500">Free AI & Online Tools for Everyone</p>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              SmartToolsHub was created to solve a common problem: clutter on the internet. Finding reliable, fast, and free online utilities often meant wading through popups, subscription traps, forced registrations, and bloated interfaces.
            </p>
            <p>
              We built SmartToolsHub as an all-in-one suite where students, developers, writers, and business professionals can access high-performance AI tools, document converters, image utilities, and financial calculators in seconds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Zero Paywalls</h4>
                <p className="text-xs text-gray-500">Every single tool on SmartToolsHub is completely free with unlimited usage.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Privacy Guarantee</h4>
                <p className="text-xs text-gray-500">Your documents, text, and photos are processed locally in your browser wherever possible.</p>
              </div>
            </div>

            {/* Frequently Asked Questions with FAQ Schema */}
            <div className="pt-8 space-y-4 border-t border-gray-100 dark:border-gray-700">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                      {
                        '@type': 'Question',
                        name: 'Are all tools on SmartToolsHub really free?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes! SmartToolsHub provides 100% free access to all 20+ AI, PDF, image, text, and calculator utilities without any hidden subscriptions or usage caps.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Is my data secure when using online tools on SmartToolsHub?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Absolutely. SmartToolsHub processes tools locally inside your web browser using HTML5 Canvas, WebAssembly, and Client JavaScript. Your files and data never leave your computer memory.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Do I need to create an account to use the tools?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'No registration is required to use any utility. However, creating a free profile allows you to save favorite tools and keep track of your recent history across sessions.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Can I use SmartToolsHub on mobile phones and tablets?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes, SmartToolsHub is engineered with responsive, touch-friendly layouts optimized for iPhone, Android, iPad, and desktop computers.',
                        },
                      },
                    ],
                  }),
                }}
              />

              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Are all tools on SmartToolsHub really free?</h4>
                  <p className="text-gray-500 dark:text-gray-400">Yes! SmartToolsHub provides 100% free access to all 20+ AI, PDF, image, text, and calculator utilities without any hidden subscriptions or usage caps.</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Is my data secure when using online tools on SmartToolsHub?</h4>
                  <p className="text-gray-500 dark:text-gray-400">Absolutely. SmartToolsHub processes tools locally inside your web browser using HTML5 Canvas, WebAssembly, and Client JavaScript. Your files and data never leave your computer memory.</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Do I need to create an account to use the tools?</h4>
                  <p className="text-gray-500 dark:text-gray-400">No registration is required to use any utility. However, creating a free profile allows you to save favorite tools and keep track of your recent history across sessions.</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Can I use SmartToolsHub on mobile phones and tablets?</h4>
                  <p className="text-gray-500 dark:text-gray-400">Yes, SmartToolsHub is engineered with responsive, touch-friendly layouts optimized for iPhone, Android, iPad, and desktop computers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact View */}
      {activeView === 'contact' && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Contact & Feedback</h2>
            <p className="text-sm text-gray-500">Have a suggestion or tool request? We'd love to hear from you!</p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-base">Message Received!</h4>
              <p className="text-xs">Thank you for reaching out to SmartToolsHub. Returning to homepage...</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Message or Tool Request</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what tool you'd like us to add next..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* Privacy Policy View */}
      {activeView === 'privacy' && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Privacy Policy</h2>
            <p className="text-sm text-gray-500">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Zero Data Collection & Storage</h3>
            <p>
              SmartToolsHub operates on a privacy-first philosophy. We do not store, archive, sell, or collect personal documents, text entries, uploaded images, or financial calculations performed on our platform.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Client-Side Execution</h3>
            <p>
              Utilities like QR Code Generators, Word Counters, Age Calculators, Image Compressors, and Color Pickers run 100% locally in your web browser. Your data never leaves your device.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">3. AI Service Proxy</h3>
            <p>
              For AI features (e.g. AI Resume Builder and AI Letter Writer), requests pass through a secure backend proxy strictly to handle Google Gemini API authentication. Prompts and outputs are transiently processed in-memory and never saved to a database.
            </p>
          </div>
        </div>
      )}

      {/* Terms View */}
      {activeView === 'terms' && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Terms & Conditions</h2>
            <p className="text-sm text-gray-500">Usage Terms & Guidelines</p>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Free Usage License</h3>
            <p>
              SmartToolsHub grants you a free, non-exclusive, non-transferable license to use all available utilities for personal, educational, or commercial purposes.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Disclaimer of Warranty</h3>
            <p>
              All tools are provided "AS IS" without warranties of any kind. While we strive for absolute accuracy in calculators and conversions, users are advised to verify financial computations independently.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer View */}
      {activeView === 'disclaimer' && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Disclaimer</h2>
            <p className="text-sm text-gray-500">Legal Disclaimers & General Advice Notice</p>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">1. General Information Only</h3>
            <p>
              The content, calculators, generators, and converters provided on SmartToolsHub are intended strictly for general informational, educational, and productivity purposes. They do not constitute financial, legal, tax, or professional medical advice.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Accuracy of Calculators</h3>
            <p>
              Although we design our Loan EMI Calculators, Age Calculators, and Percentage Calculators with high accuracy algorithms, variations in real-world banking compounding rules or interest schemes may occur. Users should verify critical calculations with a licensed professional or bank.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">3. Third-Party Links</h3>
            <p>
              SmartToolsHub may contain links to external web resources. We are not responsible for the contents or privacy practices of external third-party services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
