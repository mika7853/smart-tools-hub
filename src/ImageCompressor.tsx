import React, { useState, useRef } from 'react';
import {
  Minimize2,
  Upload,
  Download,
  RefreshCw,
  FileImage,
  Check,
  Copy,
  Share2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');
  const [quality, setQuality] = useState<number>(75);
  const [preset, setPreset] = useState<'low' | 'medium' | 'high' | 'custom'>('medium');
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [compressing, setCompressing] = useState<boolean>(false);

  const [origSize, setOrigSize] = useState<number>(0);
  const [compSize, setCompSize] = useState<number>(0);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setOrigSize(file.size);

    // Auto-select format based on input or default to JPEG/WebP
    if (file.type === 'image/png') {
      setOutputFormat('image/png');
    } else if (file.type === 'image/webp') {
      setOutputFormat('image/webp');
    } else {
      setOutputFormat('image/jpeg');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalPreview(src);

      const img = new Image();
      img.onload = () => {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        compressImage(img, quality, file.type === 'image/png' ? 'image/png' : outputFormat);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const compressImage = (img: HTMLImageElement, qual: number, format: string) => {
    setCompressing(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill white background for JPEG conversions
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL(format, qual / 100);
        setCompressedPreview(dataUrl);

        // Calculate approximate compressed byte size
        const head = `data:${format};base64,`;
        const sizeInBytes = Math.round(((dataUrl.length - head.length) * 3) / 4);
        setCompSize(sizeInBytes);
      } catch (err) {
        console.error('Compression failed:', err);
      } finally {
        setCompressing(false);
      }
    }, 80);
  };

  const handlePresetChange = (p: 'low' | 'medium' | 'high') => {
    setPreset(p);
    let targetQuality = 75;
    if (p === 'low') targetQuality = 90; // Low compression = High quality
    if (p === 'medium') targetQuality = 75; // Medium compression = Balanced
    if (p === 'high') targetQuality = 50; // High compression = Maximum savings

    setQuality(targetQuality);
    if (originalPreview) {
      const img = new Image();
      img.onload = () => compressImage(img, targetQuality, outputFormat);
      img.src = originalPreview;
    }
  };

  const handleQualitySliderChange = (newQuality: number) => {
    setQuality(newQuality);
    setPreset('custom');
    if (originalPreview) {
      const img = new Image();
      img.onload = () => compressImage(img, newQuality, outputFormat);
      img.src = originalPreview;
    }
  };

  const handleFormatChange = (newFormat: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setOutputFormat(newFormat);
    if (originalPreview) {
      const img = new Image();
      img.onload = () => compressImage(img, quality, newFormat);
      img.src = originalPreview;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = () => {
    if (origSize === 0 || compSize === 0) return 0;
    const diff = origSize - compSize;
    const percent = (diff / origSize) * 100;
    return Math.max(0, Math.round(percent));
  };

  const handleDownload = () => {
    if (!compressedPreview) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const filename = selectedFile
      ? `compressed_${selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'))}.${ext}`
      : `compressed_image.${ext}`;

    const a = document.createElement('a');
    a.href = compressedPreview;
    a.download = filename;
    a.click();
  };

  const handleCopyDetails = () => {
    if (!selectedFile) return;
    const text = `🖼️ Image Compression Summary 🖼️\nFile: ${selectedFile.name}\nOriginal Size: ${formatBytes(origSize)}\nCompressed Size: ${formatBytes(compSize)}\nSaved: ${calculateSavings()}%\nDimensions: ${imgDimensions.width} x ${imgDimensions.height} px\nCompressed via SmartToolsHub Image Compressor`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Free Image Compressor - SmartToolsHub',
      text: 'Compress JPG, PNG, and WebP images directly in your browser with no quality loss.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
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
      q: 'How does browser-side image compression work?',
      a: 'Using HTML5 Canvas and modern browser encoders, your image is decoded and re-encoded locally at optimized quality levels. This reduces file size without sending your image to any external server.',
    },
    {
      q: 'Will my image lose quality during compression?',
      a: 'At Medium (75%) or Low (90%) compression presets, the visual difference is virtually imperceptible to the human eye, while reducing file size by 50% to 80%!',
    },
    {
      q: 'Which format should I choose for the smallest file size?',
      a: 'WEBP generally offers 25% to 35% better compression than JPEG at equivalent quality. JPEG is best for photographs, while PNG is recommended when preserving transparent backgrounds.',
    },
    {
      q: 'Are my private photos uploaded to any cloud server?',
      a: 'No! Privacy is guaranteed. 100% of the image compression processing occurs directly inside your web browser. Your images never leave your computer or mobile device.',
    },
    {
      q: 'What file formats are supported?',
      a: 'SmartToolsHub supports uploading JPG, JPEG, PNG, and WebP images up to 20MB in size.',
    },
  ];

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
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-cyan-950/50 border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
            <Minimize2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Browser-Side Image Compressor
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              Shrink JPG, PNG, and WEBP image file sizes by up to 90% without visible loss in quality.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {selectedFile && (
            <button
              onClick={handleCopyDetails}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-emerald-600" />}
              {copied ? 'Copied Stats!' : 'Copy Stats'}
            </button>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {shared ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {!selectedFile ? (
        /* Drag and Drop Box */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="p-10 sm:p-16 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Drag & Drop your image here, or <span className="text-emerald-600 dark:text-emerald-400 underline">Browse File</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports PNG, JPG, JPEG, and WEBP up to 20MB • Fast & 100% Private
            </p>
          </div>
        </div>
      ) : (
        /* Compression Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-emerald-500" />
                  Image Metadata
                </span>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setOriginalPreview('');
                    setCompressedPreview('');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Change Image
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">File Name:</span>
                  <span className="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">
                    {selectedFile.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Original Size:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatBytes(origSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {imgDimensions.width} × {imgDimensions.height} px
                  </span>
                </div>
              </div>

              {/* Compression Preset Selector */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Compression Preset Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetChange('low')}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        preset === 'low'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      Low
                      <span className="block text-[10px] font-normal opacity-80">Best Quality</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('medium')}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        preset === 'medium'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      Medium
                      <span className="block text-[10px] font-normal opacity-80">Balanced</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('high')}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        preset === 'high'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      High
                      <span className="block text-[10px] font-normal opacity-80">Smallest Size</span>
                    </button>
                  </div>
                </div>

                {/* Quality Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    <span>Quality Slider ({quality}%)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {100 - quality}% Size Reduction
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    value={quality}
                    onChange={(e) => handleQualitySliderChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-gray-400 mt-1">
                    <span>Max Compression</span>
                    <span>Max Quality</span>
                  </div>
                </div>

                {/* Output Format Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Output File Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => handleFormatChange(fmt)}
                        className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          outputFormat === fmt
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                            : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/webp' ? 'WEBP' : 'PNG'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Savings Highlight Card */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  New File Size: {formatBytes(compSize)}
                </span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {calculateSavings()}% Smaller!
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80 font-medium">
                  Saved {formatBytes(Math.max(0, origSize - compSize))} of space.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={compressing || !compressedPreview}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download Compressed Image
              </button>
            </div>
          </div>

          {/* Side-by-Side Image Preview Comparison */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Card */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-between space-y-3">
              <div className="w-full flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Original Image
                </span>
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                  {formatBytes(origSize)}
                </span>
              </div>
              <div className="w-full h-72 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700/60">
                <img
                  src={originalPreview}
                  alt="Original Preview"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Compressed Card */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-between space-y-3">
              <div className="w-full flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Compressed Image
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatBytes(compSize)}
                </span>
              </div>
              <div className="w-full h-72 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700/60 relative">
                {compressing ? (
                  <div className="flex flex-col items-center justify-center space-y-2 text-emerald-500">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold">Compressing...</span>
                  </div>
                ) : (
                  <img
                    src={compressedPreview}
                    alt="Compressed Preview"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section for SEO */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-sm text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
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
