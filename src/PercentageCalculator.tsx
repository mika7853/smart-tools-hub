import React, { useState } from 'react';
import { Percent, Calculator } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [p1, setP1] = useState<number>(15);
  const [v1, setV1] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [v2a, setV2a] = useState<number>(40);
  const [v2b, setV2b] = useState<number>(200);

  // Mode 3: % Increase/Decrease from X to Y
  const [v3a, setV3a] = useState<number>(100);
  const [v3b, setV3b] = useState<number>(150);

  const res1 = (p1 / 100) * v1;
  const res2 = v2b !== 0 ? ((v2a / v2b) * 100).toFixed(2) : 0;
  const diff3 = v3b - v3a;
  const res3 = v3a !== 0 ? ((diff3 / v3a) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border border-violet-100 dark:border-violet-900/60">
        <div className="p-3 bg-violet-600 text-white rounded-xl shadow-md">
          <Percent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Percentage Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Calculate percentage values, percentage ratios, and percentage increases or decreases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mode 1 */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
            1. What is X% of Y?
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Percentage (X)</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Total Value (Y)</label>
              <input
                type="number"
                value={v1}
                onChange={(e) => setV1(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div className="p-4 bg-violet-50 dark:bg-violet-950/40 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Result</span>
              <span className="text-2xl font-black text-violet-600">{res1}</span>
            </div>
          </div>
        </div>

        {/* Mode 2 */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
            2. X is what % of Y?
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Value (X)</label>
              <input
                type="number"
                value={v2a}
                onChange={(e) => setV2a(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Total (Y)</label>
              <input
                type="number"
                value={v2b}
                onChange={(e) => setV2b(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div className="p-4 bg-violet-50 dark:bg-violet-950/40 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Percentage</span>
              <span className="text-2xl font-black text-violet-600">{res2}%</span>
            </div>
          </div>
        </div>

        {/* Mode 3 */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
            3. % Change from X to Y
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Original (X)</label>
              <input
                type="number"
                value={v3a}
                onChange={(e) => setV3a(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">New (Y)</label>
              <input
                type="number"
                value={v3b}
                onChange={(e) => setV3b(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold"
              />
            </div>
            <div className="p-4 bg-violet-50 dark:bg-violet-950/40 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                {Number(res3) >= 0 ? 'Increase' : 'Decrease'}
              </span>
              <span className={`text-2xl font-black ${Number(res3) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {res3}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
