import React, { useState, useRef, useEffect } from 'react';
import {
  Scaling,
  Upload,
  Trash2,
  Download,
  Image as ImageIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Unlock,
  Maximize2,
  Percent,
  Zap,
  Sliders,
  Check,
  FileType,
} from 'lucide-react';

type ResizeMode = 'dimensions' | 'percentage';
type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface ImageMetadata {
  file: File;
  name: string;
  src: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  type: string;
}

export const ImageResizer: React.FC = () => {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('dimensions');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [percentage, setPercentage] = useState<number>(50);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.9);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Format Bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Handle File Upload
  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    setResizedUrl(null);
    setResizedSize(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setErrorMessage('Please upload a valid image file (.jpg, .jpeg, .png, or .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgElementRef.current = img;
        setImageMeta({
          file,
          name: file.name,
          src,
          originalWidth: img.width,
          originalHeight: img.height,
          originalSize: file.size,
          type: file.type,
        });

        // Set initial width and height to original
        setWidth(img.width);
        setHeight(img.height);
        setPercentage(50);

        // Pre-select format based on input
        if (file.type === 'image/png') setOutputFormat('image/png');
        else if (file.type === 'image/webp') setOutputFormat('image/webp');
        else setOutputFormat('image/jpeg');
      };
      img.onerror = () => {
        setErrorMessage('Failed to load image file. It may be corrupted.');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Drag and Drop handlers
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

  // Width / Height input change logic with aspect ratio
  const handleWidthChange = (val: number) => {
    const newW = Math.max(1, val);
    setWidth(newW);
    if (keepAspectRatio && imageMeta) {
      const ratio = imageMeta.originalWidth / imageMeta.originalHeight;
      setHeight(Math.round(newW / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const newH = Math.max(1, val);
    setHeight(newH);
    if (keepAspectRatio && imageMeta) {
      const ratio = imageMeta.originalWidth / imageMeta.originalHeight;
      setWidth(Math.round(newH * ratio));
    }
  };

  // Computed target dimensions
  const getTargetDimensions = () => {
    if (!imageMeta) return { targetW: 0, targetH: 0 };
    if (resizeMode === 'percentage') {
      const scale = percentage / 100;
      return {
        targetW: Math.max(1, Math.round(imageMeta.originalWidth * scale)),
        targetH: Math.max(1, Math.round(imageMeta.originalHeight * scale)),
      };
    } else {
      return { targetW: width, targetH: height };
    }
  };

  // Perform Resizing on Canvas
  const handleResizeImage = () => {
    if (!imageMeta || !imgElementRef.current) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { targetW, targetH } = getTargetDimensions();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill white background for JPEG exports if original has transparency
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(imgElementRef.current, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            setResizedSize(blob.size);
          } else {
            setErrorMessage('Failed to generate resized image blob.');
          }
          setIsProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : quality
      );
    } catch (err: any) {
      console.error('Resizing Error:', err);
      setErrorMessage(err?.message || 'An error occurred while resizing the image.');
      setIsProcessing(false);
    }
  };

  // Trigger download
  const handleDownload = () => {
    if (!resizedUrl || !imageMeta) return;

    const baseName = imageMeta.name.substring(0, imageMeta.name.lastIndexOf('.')) || imageMeta.name;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const { targetW, targetH } = getTargetDimensions();

    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `${baseName}_resized_${targetW}x${targetH}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setImageMeta(null);
    setResizedUrl(null);
    setResizedSize(null);
    setErrorMessage(null);
    imgElementRef.current = null;
  };

  const { targetW, targetH } = getTargetDimensions();

  const faqs = [
    {
      q: 'Will resizing reduce my image quality?',
      a: 'Downsizing images maintains high crispness and reduces file size. Upscaling images significantly beyond original dimensions may introduce mild softness or pixelation.',
    },
    {
      q: 'How does aspect ratio lock work?',
      a: 'When aspect ratio lock is enabled, changing the width automatically recalculates the height (and vice versa) to prevent your image from becoming stretched or squished.',
    },
    {
      q: 'Which format should I select when downloading?',
      a: 'JPEG is best for standard photos and social media. PNG is best for graphics with transparent backgrounds or crisp text. WebP offers maximum compression and high image quality for modern web usage.',
    },
    {
      q: 'Are my images uploaded to any remote server?',
      a: 'No! All image resizing and canvas processing occurs 100% locally in your browser memory. Your images remain completely private.',
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
            name: 'Image Resizer Tool',
            url: window.location.href,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Resize JPG, PNG, and WebP images by exact pixel dimensions or percentage with aspect ratio lock and client-side processing.',
          }),
        }}
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 border border-white/30 shadow-md">
            <Scaling className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Image Resizer</h2>
            <p className="text-xs text-emerald-100 mt-1">
              Resize JPG, PNG, and WebP images by pixel dimensions or percentage with live aspect ratio control.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 self-start sm:self-auto">
          Fast & Private
        </span>
      </div>

      {/* Upload Box */}
      {!imageMeta ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 shadow-sm ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
              : 'border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Choose an Image file or Drag & Drop here
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports JPG, JPEG, PNG, and WebP formats up to high resolutions.
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors pointer-events-none"
          >
            Select Image File
          </button>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* File Overview Bar */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shrink-0">
                <img
                  src={imageMeta.src}
                  alt={imageMeta.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-gray-900 dark:text-white truncate">
                  {imageMeta.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Original Dimensions: <strong className="text-gray-800 dark:text-gray-200">{imageMeta.originalWidth} × {imageMeta.originalHeight} px</strong> • Size:{' '}
                  <strong>{formatBytes(imageMeta.originalSize)}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={clearImage}
              className="px-3.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Change Image
            </button>
          </div>

          {/* Controls Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Resize Method
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setResizeMode('dimensions')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    resizeMode === 'dimensions'
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  By Dimensions (Pixels)
                </button>

                <button
                  type="button"
                  onClick={() => setResizeMode('percentage')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    resizeMode === 'percentage'
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  By Percentage (%)
                </button>
              </div>
            </div>

            {/* Inputs based on Mode */}
            {resizeMode === 'dimensions' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                      keepAspectRatio
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {keepAspectRatio ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Aspect Ratio Locked ({imageMeta.originalWidth}:{imageMeta.originalHeight})
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        Aspect Ratio Unlocked
                      </>
                    )}
                  </button>

                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Target: <strong className="text-emerald-600 dark:text-emerald-400">{width} × {height} px</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Scale Percentage: <strong className="text-emerald-600 dark:text-emerald-400">{percentage}%</strong>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                      Target: {targetW} × {targetH} px
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {[25, 50, 75, 100, 150, 200].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPercentage(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          percentage === p
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Export Format & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Export Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as ImageFormat)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="image/jpeg">JPG / JPEG (Standard)</option>
                  <option value="image/png">PNG (Lossless / Transparent)</option>
                  <option value="image/webp">WebP (Modern Web Format)</option>
                </select>
              </div>

              {outputFormat !== 'image/png' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={1.0}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer mt-2"
                  />
                </div>
              )}
            </div>

            {/* Action Resize Button */}
            <button
              onClick={handleResizeImage}
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Resizing Image...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Resize Image Now
                </>
              )}
            </button>
          </div>

          {/* Resized Result Preview */}
          {resizedUrl && (
            <div className="p-6 sm:p-8 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200/60 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    Image Successfully Resized!
                  </h3>
                </div>

                <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full">
                  {targetW} × {targetH} px
                </span>
              </div>

              {/* Preview Image Box */}
              <div className="flex flex-col items-center gap-4">
                <div className="max-h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-inner">
                  <img
                    src={resizedUrl}
                    alt="Resized Preview"
                    className="max-h-64 object-contain rounded-xl"
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">
                    Resized Size:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {resizedSize ? formatBytes(resizedSize) : 'Ready'}
                    </strong>
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Resized Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
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
