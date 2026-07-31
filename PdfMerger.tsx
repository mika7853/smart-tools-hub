import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  MoveUp,
  MoveDown,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileType,
  Sparkles,
  FileCheck,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
  arrayBuffer: ArrayBuffer;
  error?: string;
}

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [mergeSuccess, setMergeSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // Process incoming PDF Files
  const handleAddFiles = async (selectedFiles: FileList | File[]) => {
    setErrorMessage(null);
    setMergeSuccess(false);

    const pdfFiles = Array.from(selectedFiles).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      setErrorMessage('Please select valid PDF files (.pdf).');
      return;
    }

    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      try {
        const buffer = await file.arrayBuffer();
        let pageCount = null;

        try {
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } catch {
          // If encrypted or unparseable metadata
          pageCount = null;
        }

        newItems.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer: buffer,
        });
      } catch (err) {
        console.error('Error reading file buffer:', err);
      }
    }

    setFiles((prev) => [...prev, ...newItems]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleAddFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Drag and Drop Zone handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Reordering controls
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...files];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setMergeSuccess(false);
    setErrorMessage(null);
  };

  // Drag and drop list item reordering
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...files];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setFiles(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Perform Client-Side PDF Merge
  const handleMergePdf = async () => {
    if (files.length < 2) {
      setErrorMessage('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setMergeSuccess(false);

    try {
      // Create a brand new PDFDocument
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        try {
          const srcPdf = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
          const pageIndices = srcPdf.getPageIndices();
          const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);

          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (itemErr) {
          console.error(`Failed to process PDF ${item.name}:`, itemErr);
          throw new Error(`Could not parse or copy pages from "${item.name}". It may be password-protected or corrupted.`);
        }
      }

      // Save merged document to bytes
      const pdfBytes = await mergedPdf.save();

      // Trigger Browser Download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Merged_Document_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMergeSuccess(true);
    } catch (err: any) {
      console.error('PDF Merge Error:', err);
      setErrorMessage(err?.message || 'An error occurred while merging your PDF files. Please verify your PDF documents are unencrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPagesSum = files.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalSizeBytes = files.reduce((acc, f) => acc + f.size, 0);

  const faqs = [
    {
      q: 'Is my confidential data or PDF content uploaded to any server?',
      a: 'No, absolutely not. SmartToolsHub merges PDF files 100% locally inside your web browser using WebAssembly and client-side JavaScript. Your files never leave your device.',
    },
    {
      q: 'Is there a limit on file size or number of PDFs?',
      a: 'There are no artificial file limits imposed by SmartToolsHub. The merger runs natively using your web browser memory, so you can combine dozens of documents seamlessly.',
    },
    {
      q: 'Can I reorder PDF documents before merging?',
      a: 'Yes! You can drag and drop PDF cards or use the up and down arrow controls to rearrange document order prior to downloading your final combined PDF file.',
    },
    {
      q: 'Does it support password-protected or encrypted PDFs?',
      a: 'If a PDF file is encrypted with an owner/open password, you must remove the password restriction first before merging it with other files.',
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
            name: 'PDF Merger Tool',
            url: window.location.href,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Combine multiple PDF files into one document instantly in your browser with drag-and-drop reordering and 100% privacy.',
          }),
        }}
      />

      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">PDF Merger & Combiner</h2>
            <p className="text-xs text-rose-100 mt-1">
              Combine multiple PDF documents into a single unified file with drag-and-drop ordering.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          100% Browser Processing
        </span>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 shadow-sm ${
          isDragging
            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 scale-[1.01]'
            : 'border-gray-300 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800">
          <Upload className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            Choose PDF files or Drag & Drop here
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select 2 or more PDF documents to merge into one single file.
          </p>
        </div>

        <button
          type="button"
          className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors pointer-events-none"
        >
          Select PDF Files
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {mergeSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>PDF successfully merged and downloaded to your device!</span>
        </div>
      )}

      {/* Uploaded File List & Ordering Controls */}
      {files.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Files to Merge ({files.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Total Pages: <strong className="text-gray-800 dark:text-gray-200">{totalPagesSum}</strong> • Total Size: <strong className="text-gray-800 dark:text-gray-200">{formatBytes(totalSizeBytes)}</strong>
              </p>
            </div>

            <button
              onClick={clearAll}
              className="px-3.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Files
            </button>
          </div>

          <div className="space-y-2.5">
            {files.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleItemDrop(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 cursor-grab active:cursor-grabbing ${
                  dragOverIndex === index
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
                    <FileType className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatBytes(item.size)} {item.pageCount !== null && `• ${item.pageCount} pages`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleMergePdf}
            disabled={isProcessing || files.length < 2}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Merging PDF Files...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Merge & Download Unified PDF
              </>
            )}
          </button>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
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
                  <ChevronUp className="w-4 h-4 shrink-0 text-rose-600" />
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
