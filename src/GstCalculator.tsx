import React, { useState } from 'react';
import {
  Calculator,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Receipt,
  Percent,
  IndianRupee,
  DollarSign,
  Euro,
  PoundSterling,
  CheckCircle2,
  PieChart,
  FileText,
  Building2,
  FileCheck,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const GstCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<number>(18);
  const [taxMode, setTaxMode] = useState<'intra' | 'inter'>('intra'); // intra = CGST+SGST, inter = IGST
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');

  const [copied, setCopied] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeRate = gstRate === -1 ? customRate : gstRate;

  // Calculation Math
  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (gstType === 'exclusive') {
    // Adding GST to Base Price
    netAmount = amount;
    gstAmount = amount * (activeRate / 100);
    totalAmount = amount + gstAmount;
  } else {
    // Reverse GST calculation (Extracting GST from Gross Price)
    totalAmount = amount;
    netAmount = amount / (1 + activeRate / 100);
    gstAmount = amount - netAmount;
  }

  const cgstAmount = taxMode === 'intra' ? gstAmount / 2 : 0;
  const sgstAmount = taxMode === 'intra' ? gstAmount / 2 : 0;
  const igstAmount = taxMode === 'inter' ? gstAmount : 0;

  const basePercentage = totalAmount > 0 ? ((netAmount / totalAmount) * 100).toFixed(1) : '0';
  const gstPercentage = totalAmount > 0 ? ((gstAmount / totalAmount) * 100).toFixed(1) : '0';

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const presetRates = [3, 5, 12, 18, 28];

  // Actions
  const handleCopyBreakdown = () => {
    const summary = `--- GST Calculation Summary ---
Type: ${gstType === 'exclusive' ? 'GST Exclusive (Added)' : 'GST Inclusive (Extracted)'}
Rate: ${activeRate}% (${taxMode === 'intra' ? 'CGST + SGST' : 'IGST'})
--------------------------------
Net Amount (Base Price): ${formatCurrency(netAmount)}
${
  taxMode === 'intra'
    ? `CGST (${activeRate / 2}%): ${formatCurrency(cgstAmount)}\nSGST (${activeRate / 2}%): ${formatCurrency(sgstAmount)}`
    : `IGST (${activeRate}%): ${formatCurrency(igstAmount)}`
}
Total GST Amount: ${formatCurrency(gstAmount)}
--------------------------------
Total Gross Amount: ${formatCurrency(totalAmount)}
Calculated on SmartToolsHub`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'GST Calculation - SmartToolsHub',
          text: `Base Price: ${formatCurrency(netAmount)}, GST (${activeRate}%): ${formatCurrency(
            gstAmount
          )}, Total Amount: ${formatCurrency(totalAmount)}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Header Branding
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SmartToolsHub - GST Invoice Calculation', 15, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 15, 25);

    // Calculation Method Section
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GST Breakdown Details', 15, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Calculation Mode: GST ${gstType === 'exclusive' ? 'Exclusive (Add GST)' : 'Inclusive (Reverse GST)'}`, 15, 55);
    doc.text(`Taxation Type: ${taxMode === 'intra' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}`, 15, 62);
    doc.text(`Applied GST Rate: ${activeRate}%`, 15, 69);

    // Summary Table Box
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.rect(15, 78, 180, 75, 'FD');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Particulars', 25, 90);
    doc.text('Rate %', 115, 90);
    doc.text('Amount', 155, 90);

    doc.setLineWidth(0.5);
    doc.line(20, 94, 190, 94);

    doc.setFont('helvetica', 'normal');
    doc.text('Net Base Price', 25, 105);
    doc.text('-', 115, 105);
    doc.text(formatCurrency(netAmount), 155, 105);

    if (taxMode === 'intra') {
      doc.text(`Central GST (CGST)`, 25, 115);
      doc.text(`${activeRate / 2}%`, 115, 115);
      doc.text(formatCurrency(cgstAmount), 155, 115);

      doc.text(`State GST (SGST)`, 25, 125);
      doc.text(`${activeRate / 2}%`, 115, 125);
      doc.text(formatCurrency(sgstAmount), 155, 125);
    } else {
      doc.text(`Integrated GST (IGST)`, 25, 118);
      doc.text(`${activeRate}%`, 115, 118);
      doc.text(formatCurrency(igstAmount), 155, 118);
    }

    doc.line(20, 133, 190, 133);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total GST Tax', 25, 142);
    doc.text(`${activeRate}%`, 115, 142);
    doc.text(formatCurrency(gstAmount), 155, 142);

    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.rect(15, 160, 180, 25, 'FD');

    doc.setFontSize(14);
    doc.setTextColor(67, 56, 202); // Indigo 700
    doc.text('Final Payable Amount:', 25, 176);
    doc.text(formatCurrency(totalAmount), 135, 176);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text('SmartToolsHub - Free Online Utility Suite • 100% Client-Side Private', 15, 280);

    doc.save(`GST_Calculation_${Math.round(totalAmount)}.pdf`);
  };

  const faqs = [
    {
      q: 'What is the difference between GST Inclusive and GST Exclusive?',
      a: 'GST Exclusive means the tax percentage is calculated on top of the base price (Net Amount + GST = Total Price). GST Inclusive means the listed price already contains the tax component, and the base price is reverse-calculated from the total.',
    },
    {
      q: 'How is Reverse GST calculated?',
      a: 'When price includes GST, the formula to extract Net Base Price is: Net Price = Gross Amount / (1 + (GST Rate / 100)). The GST tax amount is then calculated as: GST Amount = Gross Amount - Net Price.',
    },
    {
      q: 'What is the distinction between CGST, SGST, and IGST?',
      a: 'CGST (Central GST) and SGST (State GST) apply to intra-state transactions within the same state/union territory and are split equally (e.g., 18% GST = 9% CGST + 9% SGST). IGST (Integrated GST) applies to inter-state supply between two different states.',
    },
    {
      q: 'Standard GST Slab Rates',
      a: 'Standard GST tax rates include 0% (essential items), 3% (gold/gems), 5% (processed food/household items), 12% (processed goods/electronics), 18% (capital goods, services, IT), and 28% (luxury items, automobiles).',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:p-0">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'GST Calculator',
            url: window.location.href,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Calculate GST inclusive and exclusive amounts, CGST, SGST, IGST tax breakdowns, and download printable PDF receipts.',
          }),
        }}
      />

      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <Receipt className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">GST Calculator</h2>
            <p className="text-xs text-emerald-100 mt-1">
              Calculate GST Inclusive, Exclusive, CGST, SGST, and IGST tax breakdowns with 1-click PDF download.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          Fast & Accurate
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 print:border-none">
          {/* GST Calculation Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              GST Calculation Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
              <button
                type="button"
                onClick={() => setGstType('exclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  gstType === 'exclusive'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                GST Exclusive (+ Add Tax)
              </button>
              <button
                type="button"
                onClick={() => setGstType('inclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  gstType === 'inclusive'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                GST Inclusive (Extract Tax)
              </button>
            </div>
          </div>

          {/* Amount Field & Currency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {gstType === 'exclusive' ? 'Base Amount (Net Price)' : 'Total Price (GST Included)'}
              </label>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <span>Symbol:</span>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-0.5 text-xs font-bold"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 font-black text-gray-400 text-lg">
                {currencySymbol}
              </span>
              <input
                type="number"
                min={0}
                step="any"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Enter amount..."
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-700 font-mono text-lg font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tax Rates Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Select GST Rate %
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetRates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gstRate === rate
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {rate}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setGstRate(-1)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gstRate === -1
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                }`}
              >
                Custom
              </button>
            </div>

            {gstRate === -1 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Custom Tax Rate (%):</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={customRate}
                  onChange={(e) => setCustomRate(Math.max(0, Number(e.target.value) || 0))}
                  className="w-24 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-xs"
                />
              </div>
            )}
          </div>

          {/* Taxation Mode (Intra-State vs Inter-State) */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Taxation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                onClick={() => setTaxMode('intra')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all ${
                  taxMode === 'intra'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="taxMode"
                  checked={taxMode === 'intra'}
                  onChange={() => setTaxMode('intra')}
                  className="accent-emerald-600"
                />
                Intra-State (CGST + SGST)
              </label>

              <label
                onClick={() => setTaxMode('inter')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all ${
                  taxMode === 'inter'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="taxMode"
                  checked={taxMode === 'inter'}
                  onChange={() => setTaxMode('inter')}
                  className="accent-emerald-600"
                />
                Inter-State (IGST)
              </label>
            </div>
          </div>
        </div>

        {/* Output & Breakdown Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Results Card */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                GST Tax Summary
              </h3>
              <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {activeRate}% GST
              </span>
            </div>

            {/* Price Cards Grid */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                    Net Price (Base Price)
                  </span>
                  <span className="text-xs text-gray-400">Price before GST tax</span>
                </div>
                <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                  {formatCurrency(netAmount)}
                </span>
              </div>

              {taxMode === 'intra' ? (
                <>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      Central GST (CGST @ {activeRate / 2}%)
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(cgstAmount)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      State GST (SGST @ {activeRate / 2}%)
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(sgstAmount)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                    Integrated GST (IGST @ {activeRate}%)
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(igstAmount)}
                  </span>
                </div>
              )}

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 block">
                    Total GST Tax Amount
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Total tax payable</span>
                </div>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono">
                  {formatCurrency(gstAmount)}
                </span>
              </div>

              <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-100 block uppercase tracking-wider">
                    Total Gross Amount
                  </span>
                  <span className="text-[11px] text-emerald-200">Final Invoice Payable Price</span>
                </div>
                <span className="text-2xl font-black font-mono">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Proportion Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-gray-500">
                <span>Base Price ({basePercentage}%)</span>
                <span>GST Tax ({gstPercentage}%)</span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${basePercentage}%` }} />
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${gstPercentage}%` }} />
              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 print:hidden">
              <button
                onClick={handleCopyBreakdown}
                className="py-2.5 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Copy breakdown text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleDownloadPdf}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                title="Download PDF statement"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>

              <button
                onClick={handlePrint}
                className="py-2.5 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Print receipt"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Share calculation link"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {copiedShare ? 'Shared' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 print:hidden">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                )}
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
