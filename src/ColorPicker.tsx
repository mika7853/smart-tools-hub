import React, { useState } from 'react';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [selectedHex, setSelectedHex] = useState<string>('#3b82f6');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(selectedHex);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedHex(code);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Generate color palette variations
  const generatePalette = () => {
    const { r, g, b } = rgb;
    return [
      selectedHex,
      `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      `#${r.toString(16).padStart(2, '0')}${Math.min(255, g + 40).toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${Math.min(255, b + 40).toString(16).padStart(2, '0')}`,
      `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`,
    ];
  };

  const palette = generatePalette();

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-100 dark:border-emerald-900/60">
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Color Picker & Palette Generator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pick colors, convert between HEX, RGB, and HSL formats, and copy designer color codes.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Color Display Canvas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 text-center">
          <div
            className="w-full h-40 rounded-2xl shadow-inner flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: selectedHex }}
          >
            <input
              type="color"
              value={selectedHex}
              onChange={(e) => setSelectedHex(e.target.value)}
              className="w-16 h-16 rounded-full cursor-pointer border-4 border-white shadow-lg opacity-0 hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Select Custom Color:</span>
            <input
              type="color"
              value={selectedHex}
              onChange={(e) => setSelectedHex(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Code Formats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => copyCode(selectedHex.toUpperCase())}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-emerald-500 transition-colors flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">HEX</span>
                <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">{selectedHex.toUpperCase()}</span>
              </div>
              {copiedHex === selectedHex.toUpperCase() ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </div>

            <div
              onClick={() => copyCode(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-emerald-500 transition-colors flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">RGB</span>
                <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</span>
              </div>
              {copiedHex === `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </div>

            <div
              onClick={() => copyCode(`hsl(217, 91%, 60%)`)}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-emerald-500 transition-colors flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">CSS Variable</span>
                <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">var(--color)</span>
              </div>
              <Copy className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Generated Palette */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Generated Palette Harmonies
          </span>
          <div className="grid grid-cols-5 gap-2 h-20">
            {palette.map((color, idx) => (
              <div
                key={idx}
                onClick={() => copyCode(color)}
                className="h-full rounded-xl cursor-pointer shadow-xs hover:scale-105 transition-transform flex flex-col justify-end p-1.5 text-center"
                style={{ backgroundColor: color }}
              >
                <span className="font-mono text-[10px] font-bold text-white drop-shadow-md">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
