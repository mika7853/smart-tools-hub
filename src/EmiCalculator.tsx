import React, { useState } from 'react';
import { BadgePercent, Calculator, PieChart, Printer, Table } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Calculation formulas
  const tenureMonths = tenureType === 'years' ? tenureYears * 12 : tenureYears;
  const monthlyRate = interestRate / 12 / 100;

  const calculateEmi = () => {
    if (loanAmount <= 0 || interestRate <= 0 || tenureMonths <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const { emi, totalInterest, totalPayment } = calculateEmi();

  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 0;
  const interestPercent = 100 - principalPercent;

  // Generate monthly schedule table (first 12 months preview + total)
  const generateSchedule = () => {
    const schedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= Math.min(tenureMonths, 12); month++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);

      schedule.push({
        month,
        principal: Math.round(principalForMonth),
        interest: Math.round(interestForMonth),
        balance: Math.round(balance),
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border border-violet-100 dark:border-violet-900/60">
        <div className="p-3 bg-violet-600 text-white rounded-xl shadow-md">
          <BadgePercent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Loan EMI Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Calculate home loans, car loans, and personal loan EMIs with interest breakdown & amortization schedule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                Loan Details
              </h4>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>

            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span>Loan Amount</span>
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-24 text-right font-bold text-gray-900 dark:text-white bg-transparent outline-none text-xs"
                  />
                </div>
              </div>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span>Interest Rate (% p.a.)</span>
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-16 text-right font-bold text-gray-900 dark:text-white bg-transparent outline-none text-xs"
                  />
                  <span className="text-gray-400 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span>Loan Tenure</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-16 text-right font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 outline-none text-xs"
                  />
                  <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setTenureType('years')}
                      className={`px-2 py-0.5 rounded-md ${
                        tenureType === 'years' ? 'bg-white dark:bg-gray-800 text-violet-600 shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Yr
                    </button>
                    <button
                      type="button"
                      onClick={() => setTenureType('months')}
                      className={`px-2 py-0.5 rounded-md ${
                        tenureType === 'months' ? 'bg-white dark:bg-gray-800 text-violet-600 shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={tenureType === 'years' ? 30 : 360}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* EMI Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main EMI Highlight Box */}
          <div className="p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-lg space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-violet-200 font-semibold">
              Monthly EMI Payment
            </span>
            <div className="text-3xl sm:text-4xl font-black">
              {currencySymbol}{emi.toLocaleString()} <span className="text-sm font-normal text-violet-200">/ month</span>
            </div>
          </div>

          {/* Breakdown Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Principal Amount
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {currencySymbol}{loanAmount.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Total Interest Payable
              </span>
              <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                {currencySymbol}{totalInterest.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Total Amount Payable
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {currencySymbol}{totalPayment.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span>Principal ({principalPercent}%)</span>
              <span className="text-violet-600">Interest ({interestPercent}%)</span>
            </div>
            <div className="h-4 w-full bg-violet-100 dark:bg-violet-950/60 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="h-full bg-violet-400 transition-all duration-300"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
          </div>

          {/* Amortization Schedule Preview */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Amortization Preview (First 12 Months)
              </span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Schedule
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase font-semibold">
                    <th className="py-2">Month</th>
                    <th className="py-2">Principal</th>
                    <th className="py-2">Interest</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="py-2 font-medium">Month {row.month}</td>
                      <td className="py-2">{currencySymbol}{row.principal.toLocaleString()}</td>
                      <td className="py-2 text-violet-600 dark:text-violet-400">{currencySymbol}{row.interest.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium">{currencySymbol}{row.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
