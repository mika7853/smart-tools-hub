import React, { useState, useRef } from 'react';
import {
  Scissors,
  Upload,
  Trash2,
  Download,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileType,
  Sparkles,
  RefreshCw,
  Check,
  Layers,
  Copy,
  Grid,
  ListFilter,
  CheckSquare,
  Square,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type SplitMode = 'select' | 'range' | 'all';

interface PdfMetadata {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export const PdfSplitter: React.FC = () => {
  const [pdfData, setPdfData] = useState<PdfMetadata | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('select');
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // 1-based page numbers
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format File Size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Parse Range String into 1-based page numbers array
  const parseRanges = (str: string, maxPages: number): number[] => {
    const pagesSet = new Set<number>();
    const parts = str.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(maxPages, Math.max(start, end));
          for (let p = min; p <= max; p++) {
            pagesSet.add(p);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pagesSet.add(num);
        }
      }
    }

    return Array.from(pagesSet).sort((a, b) => a - b);
  };

  // Process File Upload
  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF document (.pdf).');
      return;
    }

    try {
      setIsProcessing(true);
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      if (count === 0) {
        throw new Error('This PDF file has no pages.');
      }

      setPdfData({
        file,
        name: file.name,
        size: file.size,
        pageCount: count,
        arrayBuffer: buffer,
      });

      // Default selection: page 1 or range 1-Math.min(3, count)
      setSelectedPages([1]);
      setRangeInput(count >= 2 ? `1-${Math.min(3, count)}` : '1');
    } catch (err: any) {
      console.error('PDF Parse Error:', err);
      setErrorMessage(
        err?.message || 'Failed to read PDF document. The file may be password-protected or encrypted.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Page Selection Toggles
  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    if (!pdfData) return;
    const all = Array.from({ length: pdfData.pageCount }, (_, i) => i + 1);
    setSelectedPages(all);
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
  };

  const selectOddPages = () => {
    if (!pdfData) return;
    const odds = Array.from({ length: pdfData.pageCount }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    setSelectedPages(odds);
  };

  const selectEvenPages = () => {
    if (!pdfData) return;
    const evens = Array.from({ length: pdfData.pageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    setSelectedPages(evens);
  };

  // Helper to extract specific pages and download as single PDF
  const downloadExtractedPdf = async (pagesToExtract: number[], outputFilename: string) => {
    if (!pdfData || pagesToExtract.length === 0) return;

    const srcDoc = await PDFDocument.load(pdfData.arrayBuffer, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();

    // 0-indexed indices
    const pageIndices = pagesToExtract.map((p) => p - 1);
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));

    const pdfBytes = await newDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Execute PDF Split Action
  const handleSplitPdf = async () => {
    if (!pdfData) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(true);

    try {
      const baseName = pdfData.name.replace(/\.pdf$/i, '');

      if (splitMode === 'select') {
        if (selectedPages.length === 0) {
          setErrorMessage('Please select at least one page to extract.');
          setIsProcessing(false);
          return;
        }

        const outName = `${baseName}_selected_pages_${selectedPages.join('_')}.pdf`;
        await downloadExtractedPdf(selectedPages, outName);
        setSuccessMessage(`Successfully extracted ${selectedPages.length} pages into a single PDF.`);
      } else if (splitMode === 'range') {
        const pagesFromRange = parseRanges(rangeInput, pdfData.pageCount);
        if (pagesFromRange.length === 0) {
          setErrorMessage('Invalid range specified. Example ranges: 1-3, 5, 8-10');
          setIsProcessing(false);
          return;
        }

        const outName = `${baseName}_range_${rangeInput.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
        await downloadExtractedPdf(pagesFromRange, outName);
        setSuccessMessage(`Successfully extracted range (${rangeInput}) containing ${pagesFromRange.length} pages.`);
      } else if (splitMode === 'all') {
        // Download each page individually
        for (let p = 1; p <= pdfData.pageCount; p++) {
          const outName = `${baseName}_page_${p}.pdf`;
          await downloadExtractedPdf([p], outName);
        }
        setSuccessMessage(`Successfully split all ${pdfData.pageCount} pages into individual PDF files.`);
      }
    } catch (err: any) {
      console.error('Split error:', err);
      setErrorMessage(err?.message || 'Failed to split PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPdf = () => {
    setPdfData(null);
    setSelectedPages([]);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const faqs = [
    {
      q: 'How does client-side PDF splitting work?',
      a: 'SmartToolsHub uses lightweight JavaScript binary manipulation (pdf-lib) directly inside your web browser. When you upload a PDF, the pages are parsed and separated locally without transmitting your document to an external server.',
    },
    {
      q: 'What is the difference between Range Split and Individual Page Split?',
      a: 'Range Split extracts specified page groups (e.g. pages 2 through 5) into one output PDF. Individual Page Split turns every single page in your document into its own standalone 1-page PDF file.',
    },
    {
      q: 'Is there a page count limit for splitting PDFs?',
      a: 'No! Because processing occurs directly inside your computer or smartphone memory, you can split large documents with hundreds of pages effortlessly.',
    },
    {
      q: 'Does splitting reduce the PDF visual resolution or quality?',
      a: 'No! Page vectors, embedded fonts, graphics, and high-resolution images are preserved with 100% loss-less accuracy without any quality degradation.',
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
            name: 'PDF Splitter & Page Extractor',
            url: window.location.href,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Split PDF files by page ranges, extract selected pages into new PDFs, or separate all pages individually with 100% browser privacy.',
          }),
        }}
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">PDF Splitter & Page Extractor</h2>
            <p className="text-xs text-violet-100 mt-1">
              Extract specific pages, split by page ranges, or separate every page into individual PDF files.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          Private Client-Side
        </span>
      </div>

      {/* Main Container */}
      {!pdfData ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 shadow-sm ${
            isDragging
              ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30 scale-[1.01]'
              : 'border-gray-300 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="p-4 bg-violet-50 dark:bg-violet-950/60 rounded-2xl text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Choose a PDF file or Drag & Drop here
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select any PDF document to preview and split pages instantaneously.
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors pointer-events-none"
          >
            Select PDF File
          </button>
        </div>
      ) : (
        /* Workspace when PDF is loaded */
        <div className="space-y-6">
          {/* File Overview Info Bar */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-2xl border border-violet-200/50 dark:border-violet-800 shrink-0">
                <FileType className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-gray-900 dark:text-white truncate">
                  {pdfData.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Size: <strong>{formatBytes(pdfData.size)}</strong> • Total Pages:{' '}
                  <strong className="text-violet-600 dark:text-violet-400">{pdfData.pageCount} pages</strong>
                </p>
              </div>
            </div>

            <button
              onClick={clearPdf}
              className="px-3.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove PDF
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Select Splitting Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSplitMode('select')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    splitMode === 'select'
                      ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Select Pages Visually
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('range')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    splitMode === 'range'
                      ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  Split by Page Range
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('all')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    splitMode === 'all'
                      ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  Split Every Page
                </button>
              </div>
            </div>

            {/* MODE 1: VISUAL PAGE SELECTOR */}
            {splitMode === 'select' && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                    Selected Pages ({selectedPages.length} of {pdfData.pageCount})
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={selectAllPages}
                      className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllPages}
                      className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={selectOddPages}
                      className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Odd Pages
                    </button>
                    <button
                      onClick={selectEvenPages}
                      className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Even Pages
                    </button>
                  </div>
                </div>

                {/* Page Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
                  {Array.from({ length: pdfData.pageCount }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isSelected = selectedPages.includes(pageNum);

                    return (
                      <div
                        key={pageNum}
                        onClick={() => togglePageSelection(pageNum)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between gap-3 text-center relative select-none ${
                          isSelected
                            ? 'border-violet-600 bg-violet-50/80 dark:bg-violet-950/60 shadow-md ring-2 ring-violet-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="absolute top-2 right-2">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-1">
                          <FileText
                            className={`w-6 h-6 ${
                              isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'
                            }`}
                          />
                        </div>

                        <span className="text-xs font-black text-gray-900 dark:text-white">
                          Page {pageNum}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODE 2: RANGE INPUT */}
            {splitMode === 'range' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                    Enter Page Ranges (e.g., 1-3, 5, 8-10)
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="1-3, 5, 8-10"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl font-mono text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Parsed pages to extract:{' '}
                    <strong className="text-violet-600 dark:text-violet-400">
                      {parseRanges(rangeInput, pdfData.pageCount).join(', ') || 'None'}
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {/* MODE 3: SPLIT EVERY PAGE */}
            {splitMode === 'all' && (
              <div className="p-4 bg-violet-50 dark:bg-violet-950/40 rounded-2xl border border-violet-200 dark:border-violet-800 text-xs font-bold text-violet-800 dark:text-violet-300">
                This mode will split all {pdfData.pageCount} pages into {pdfData.pageCount} separate individual 1-page PDF files.
              </div>
            )}

            {/* Action Download Button */}
            <button
              onClick={handleSplitPdf}
              disabled={isProcessing}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Splitting PDF Document...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Split & Download Extracted PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-violet-600 dark:text-violet-400" />
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
                  <ChevronUp className="w-4 h-4 shrink-0 text-violet-600" />
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
