import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  Share2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Gift,
  Heart,
  CalendarCheck,
  Star
} from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [now, setNow] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live timer for second-by-second countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birthDate = new Date(dob);
  const refDate = targetDate ? new Date(targetDate) : now;

  // Age calculations
  const calculateAge = () => {
    if (isNaN(birthDate.getTime())) return null;

    let years = refDate.getFullYear() - birthDate.getFullYear();
    let months = refDate.getMonth() - birthDate.getMonth();
    let days = refDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total units
    const diffMs = refDate.getTime() - birthDate.getTime();
    if (diffMs < 0) return null;

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDaysInWeeks = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Next birthday countdown
    let nextBday = new Date(refDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < refDate) {
      nextBday.setFullYear(refDate.getFullYear() + 1);
    }
    const nextBdayMs = nextBday.getTime() - now.getTime();
    const bdayDays = Math.max(0, Math.floor(nextBdayMs / (1000 * 60 * 60 * 24)));
    const bdayHours = Math.max(0, Math.floor((nextBdayMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const bdayMins = Math.max(0, Math.floor((nextBdayMs % (1000 * 60 * 60)) / (1000 * 60)));
    const bdaySecs = Math.max(0, Math.floor((nextBdayMs % (1000 * 60)) / 1000));

    // Zodiac sign
    const zodiac = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDayOfWeek = daysOfWeek[birthDate.getDay()];

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      remDaysInWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      bdayDays,
      bdayHours,
      bdayMins,
      bdaySecs,
      zodiac,
      bornDayOfWeek,
    };
  };

  const getZodiacSign = (month: number, day: number) => {
    const signs = [
      { sign: 'Capricorn ♑', element: 'Earth' },
      { sign: 'Aquarius ♒', element: 'Air' },
      { sign: 'Pisces ♓', element: 'Water' },
      { sign: 'Aries ♈', element: 'Fire' },
      { sign: 'Taurus ♉', element: 'Earth' },
      { sign: 'Gemini ♊', element: 'Air' },
      { sign: 'Cancer ♋', element: 'Water' },
      { sign: 'Leo ♌', element: 'Fire' },
      { sign: 'Virgo ♍', element: 'Earth' },
      { sign: 'Libra ♎', element: 'Air' },
      { sign: 'Scorpio ♏', element: 'Water' },
      { sign: 'Sagittarius ♐', element: 'Fire' },
    ];

    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 23, 22, 22];
    const index = month - (day < dates[month - 1] ? 1 : 0);
    return signs[index < 0 ? 11 : index % 12];
  };

  const ageData = calculateAge();

  const handleCopy = () => {
    if (!ageData) return;
    const text = `🎉 Age Calculation Summary 🎉\nDate of Birth: ${dob}\nExact Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days\nTotal Months: ${ageData.totalMonths.toLocaleString()}\nTotal Weeks: ${ageData.totalWeeks.toLocaleString()} weeks & ${ageData.remDaysInWeeks} days\nTotal Days: ${ageData.totalDays.toLocaleString()}\nTotal Hours: ${ageData.totalHours.toLocaleString()}\nTotal Minutes: ${ageData.totalMinutes.toLocaleString()}\nTotal Seconds: ${ageData.totalSeconds.toLocaleString()}\nNext Birthday in: ${ageData.bdayDays} days, ${ageData.bdayHours}h ${ageData.bdayMins}m ${ageData.bdaySecs}s\nZodiac Sign: ${ageData.zodiac.sign}\nCalculated via SmartToolsHub Age Calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Age Calculator - SmartToolsHub',
      text: ageData
        ? `I am ${ageData.years} years, ${ageData.months} months, and ${ageData.days} days old! Check your exact age online.`
        : 'Calculate your exact age in years, months, days, hours, and seconds with live countdown.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback copy url
        navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const faqs = [
    {
      q: 'How is chronological age calculated?',
      a: 'Chronological age is calculated as the exact duration of time elapsed between your date of birth and the target date (or current date), measured precisely in years, months, days, hours, and seconds.',
    },
    {
      q: 'How does the Age Calculator handle leap years?',
      a: 'Our algorithm accounts for February 29th in leap years (every 4 years, excluding century years not divisible by 400). It automatically calculates the correct number of days for each month based on leap year rules.',
    },
    {
      q: 'What is the difference between chronological age and biological age?',
      a: 'Chronological age is strictly calendar-based (time elapsed since birth). Biological age refers to how old your cells and organs physically appear based on lifestyle, genetic, and environmental factors.',
    },
    {
      q: 'Why does total age in months or weeks differ across tools?',
      a: 'Some basic tools assume 30 days per month or 365 days per year. SmartToolsHub calculates exact calendar months and leap years down to the second for 100% precision.',
    },
    {
      q: 'Is my Date of Birth stored on any server?',
      a: 'No! All calculations happen 100% locally in your web browser. Your birth date and age data are never sent to external servers, keeping your privacy completely secure.',
    },
  ];

  // FAQ Schema Markup
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Inject FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/50 dark:via-purple-950/40 dark:to-indigo-950/50 border border-violet-100 dark:border-violet-900/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-violet-600 text-white rounded-2xl shadow-md shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Chronological Age Calculator
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              Calculate your exact age in years, months, days, hours, and seconds with live birthday countdown.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleCopy}
            disabled={!ageData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-violet-500" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {shared ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Date Selection Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                Date Parameters
              </h4>
              <CalendarCheck className="w-5 h-5 text-violet-500" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Age at Date (Default Today)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            {ageData && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Day of Week Born:</span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-300">
                    {ageData.bornDayOfWeek}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Zodiac Sign:</span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-300">
                    {ageData.zodiac.sign}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Zodiac Element:</span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-300">
                    {ageData.zodiac.element}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Output */}
        <div className="lg:col-span-8 space-y-6">
          {ageData ? (
            <>
              {/* Primary Age Banner */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Gift className="w-32 h-32" />
                </div>
                <span className="text-xs uppercase tracking-widest text-violet-200 font-bold block">
                  Exact Chronological Age
                </span>
                <div className="text-3xl sm:text-5xl font-black tracking-tight flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span>{ageData.years} <span className="text-xl font-medium text-violet-200">years</span></span>
                  <span>{ageData.months} <span className="text-xl font-medium text-violet-200">months</span></span>
                  <span>{ageData.days} <span className="text-xl font-medium text-violet-200">days</span></span>
                </div>
                <p className="text-xs text-violet-100 font-medium">
                  Calculated precisely based on calendar months and leap years.
                </p>
              </div>

              {/* Next Birthday Live Countdown */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Next Birthday Live Countdown
                  </div>
                  <Gift className="w-4 h-4 text-violet-500" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 bg-violet-50/80 dark:bg-violet-950/40 rounded-2xl border border-violet-100 dark:border-violet-900/60">
                    <span className="text-3xl font-black text-violet-700 dark:text-violet-300 block">{ageData.bdayDays}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Days</span>
                  </div>
                  <div className="p-4 bg-violet-50/80 dark:bg-violet-950/40 rounded-2xl border border-violet-100 dark:border-violet-900/60">
                    <span className="text-3xl font-black text-violet-700 dark:text-violet-300 block">{ageData.bdayHours}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Hours</span>
                  </div>
                  <div className="p-4 bg-violet-50/80 dark:bg-violet-950/40 rounded-2xl border border-violet-100 dark:border-violet-900/60">
                    <span className="text-3xl font-black text-violet-700 dark:text-violet-300 block">{ageData.bdayMins}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Minutes</span>
                  </div>
                  <div className="p-4 bg-violet-50/80 dark:bg-violet-950/40 rounded-2xl border border-violet-100 dark:border-violet-900/60">
                    <span className="text-3xl font-black text-violet-700 dark:text-violet-300 block">{ageData.bdaySecs}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Seconds</span>
                  </div>
                </div>
              </div>

              {/* Total Life Stats Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Total Age Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Months
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalMonths.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Weeks
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalWeeks.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold block mt-0.5">
                      + {ageData.remDaysInWeeks} days
                    </span>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Days
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalDays.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Hours
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalHours.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Minutes
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalMinutes.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Total Seconds
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {ageData.totalSeconds.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
              Please enter a valid Date of Birth.
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ Section for SEO) */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-sm text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-violet-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
