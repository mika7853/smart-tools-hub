import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Shield,
  CopyCheck,
  Layers,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Info,
  Lock,
} from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [incUpper, setIncUpper] = useState<boolean>(true);
  const [incLower, setIncLower] = useState<boolean>(true);
  const [incNumbers, setIncNumbers] = useState<boolean>(true);
  const [incSymbols, setIncSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [copiedMain, setCopiedMain] = useState<boolean>(false);

  // Bulk generation state
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [copiedBulkIndex, setCopiedBulkIndex] = useState<number | null>(null);
  const [copiedAllBulk, setCopiedAllBulk] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<string[]>([]);
  const [copiedHistoryIndex, setCopiedHistoryIndex] = useState<number | null>(null);

  // Accordion open/close state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const generateSinglePassword = (pwdLength: number): string => {
    let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      upperChars = upperChars.replace(/[OI]/g, '');
      lowerChars = lowerChars.replace(/[l]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
    }

    let charPool = '';
    const guaranteedChars: string[] = [];

    if (incUpper && upperChars) {
      charPool += upperChars;
      guaranteedChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (incLower && lowerChars) {
      charPool += lowerChars;
      guaranteedChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (incNumbers && numberChars) {
      charPool += numberChars;
      guaranteedChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (incSymbols && symbolChars) {
      charPool += symbolChars;
      guaranteedChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
    }

    if (!charPool) return '';

    let result = [...guaranteedChars];
    const remainingLength = pwdLength - result.length;

    if (remainingLength > 0) {
      const array = new Uint32Array(remainingLength);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < remainingLength; i++) {
        result.push(charPool[array[i] % charPool.length]);
      }
    }

    // Shuffle result using Fisher-Yates algorithm
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.slice(0, pwdLength).join('');
  };

  const handleGenerate = () => {
    if (!incUpper && !incLower && !incNumbers && !incSymbols) {
      setPassword('');
      setBulkPasswords([]);
      return;
    }

    const mainPwd = generateSinglePassword(length);
    setPassword(mainPwd);

    // Save to history (keep last 10 unique)
    if (mainPwd) {
      setHistory((prev) => {
        const filtered = prev.filter((p) => p !== mainPwd);
        return [mainPwd, ...filtered].slice(0, 10);
      });
    }

    // Bulk passwords
    const bulkList: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      bulkList.push(generateSinglePassword(length));
    }
    setBulkPasswords(bulkList);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, incUpper, incLower, incNumbers, incSymbols, excludeSimilar, bulkCount]);

  const handleCopyMain = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleCopyBulk = (pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedBulkIndex(index);
    setTimeout(() => setCopiedBulkIndex(null), 2000);
  };

  const handleCopyAllBulk = () => {
    if (bulkPasswords.length === 0) return;
    navigator.clipboard.writeText(bulkPasswords.join('\n'));
    setCopiedAllBulk(true);
    setTimeout(() => setCopiedAllBulk(false), 2000);
  };

  const handleCopyHistory = (pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedHistoryIndex(index);
    setTimeout(() => setCopiedHistoryIndex(null), 2000);
  };

  // Password Strength Calculation
  const getStrength = (pwd: string) => {
    if (!pwd) return { level: 'Weak', score: 0, color: 'bg-rose-500', text: 'text-rose-500', width: '15%' };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 2;
    if (pwd.length >= 16) score += 2;
    if (pwd.length >= 24) score += 1;

    let typesCount = 0;
    if (/[A-Z]/.test(pwd)) typesCount++;
    if (/[a-z]/.test(pwd)) typesCount++;
    if (/[0-9]/.test(pwd)) typesCount++;
    if (/[^A-Za-z0-9]/.test(pwd)) typesCount++;

    score += typesCount * 1.5;

    if (score >= 9) {
      return { level: 'Strong', score, color: 'bg-emerald-500', text: 'text-emerald-500', width: '100%' };
    } else if (score >= 5) {
      return { level: 'Medium', score, color: 'bg-amber-500', text: 'text-amber-500', width: '65%' };
    } else {
      return { level: 'Weak', score, color: 'bg-rose-500', text: 'text-rose-500', width: '30%' };
    }
  };

  const currentStrength = getStrength(password);

  const faqs = [
    {
      q: 'How long should a strong password be?',
      a: 'Security experts recommend a minimum password length of 12 to 16 characters. Using a combination of uppercase letters, lowercase letters, numbers, and special symbols significantly increases entropy, making brute-force attacks practically impossible.',
    },
    {
      q: 'Are passwords generated here stored on any server?',
      a: 'No. SmartToolsHub runs 100% client-side in your web browser using the native Web Crypto API (window.crypto.getRandomValues). No passwords ever touch an external server or database.',
    },
    {
      q: 'What makes a password cryptographically secure?',
      a: 'A cryptographically secure password relies on unpredictable pseudorandom number generators (PRNGs) with high entropy, ensuring that even advanced GPU password crackers cannot predict the character patterns.',
    },
    {
      q: 'Why should I avoid using ambiguous characters?',
      a: 'Ambiguous characters like capital "O", number "0", lowercase "l", and capital "I" look visually identical in many fonts. Excluding them prevents typing errors when entering passwords manually on mobile keyboards or paper backups.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Cryptographic Password Generator',
            url: window.location.href,
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Generate ultra-secure, cryptographically random passwords with custom lengths (8-128 characters), character options, bulk generation, and password strength metrics.',
          }),
        }}
      />

      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Cryptographic Password Generator</h2>
            <p className="text-xs text-cyan-100 mt-1">
              Create strong, custom, unbreakable passwords (8–128 characters) using Web Crypto entropy.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          100% Client-Side Private
        </span>
      </div>

      {/* Main Generator Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        {/* Output Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Generated Password
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {password.length} Characters
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={password || 'Select at least one character set'}
              className="w-full pl-4 pr-32 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-700 font-mono text-base sm:text-lg font-bold text-gray-900 dark:text-white outline-none select-all"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                onClick={handleGenerate}
                className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                title="Regenerate Password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyMain}
                disabled={!password}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {copiedMain ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedMain ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-gray-500 dark:text-gray-400">Password Strength:</span>
              <span className={currentStrength.text}>
                {currentStrength.level} ({currentStrength.level === 'Strong' ? 'High Entropy' : currentStrength.level === 'Medium' ? 'Moderate Security' : 'Low Security'})
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${currentStrength.color} transition-all duration-300 rounded-full`}
                style={{ width: currentStrength.width }}
              />
            </div>
          </div>
        </div>

        {/* Options & Controls Grid */}
        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Password Length (8 - 128 characters)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={8}
                  max={128}
                  value={length}
                  onChange={(e) => {
                    const val = Math.max(8, Math.min(128, Number(e.target.value) || 8));
                    setLength(val);
                  }}
                  className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center font-bold text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Character Rules Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-indigo-400 transition-colors">
              <input
                type="checkbox"
                checked={incUpper}
                onChange={(e) => setIncUpper(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              Uppercase Letters (A-Z)
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-indigo-400 transition-colors">
              <input
                type="checkbox"
                checked={incLower}
                onChange={(e) => setIncLower(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              Lowercase Letters (a-z)
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-indigo-400 transition-colors">
              <input
                type="checkbox"
                checked={incNumbers}
                onChange={(e) => setIncNumbers(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              Numeric Digits (0-9)
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-indigo-400 transition-colors">
              <input
                type="checkbox"
                checked={incSymbols}
                onChange={(e) => setIncSymbols(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              Special Symbols (!@#$)
            </label>

            <label className="sm:col-span-2 flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-indigo-400 transition-colors">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              Exclude Ambiguous Characters (e.g. 0, O, I, l, 1)
            </label>
          </div>
        </div>
      </div>

      {/* Bulk Generator Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Bulk Password Generator</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
              <span>Quantity:</span>
              <select
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-xs outline-none"
              >
                <option value={5}>5 Passwords</option>
                <option value={10}>10 Passwords</option>
                <option value={15}>15 Passwords</option>
                <option value={20}>20 Passwords</option>
              </select>
            </div>

            <button
              onClick={handleCopyAllBulk}
              className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedAllBulk ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAllBulk ? 'Copied All!' : 'Copy All'}
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {bulkPasswords.map((pwd, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2"
            >
              <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                {pwd}
              </span>
              <button
                onClick={() => handleCopyBulk(pwd, idx)}
                className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                title="Copy password"
              >
                {copiedBulkIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Password History</h3>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {history.map((pwd, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2"
              >
                <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                  {pwd}
                </span>
                <button
                  onClick={() => handleCopyHistory(pwd, idx)}
                  className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                >
                  {copiedHistoryIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-gray-900 dark:text-white flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>

              {openFaq === idx && (
                <div className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
