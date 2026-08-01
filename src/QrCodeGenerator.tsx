import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Wifi,
  Link as LinkIcon,
  Mail,
  Phone,
  Type,
  Share2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Eye,
  Lock,
  Palette
} from 'lucide-react';

export const QrCodeGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<'url' | 'wifi' | 'text' | 'email' | 'phone'>('url');

  // Input states
  const [urlInput, setUrlInput] = useState('https://smarttoolshub.app');
  const [textInput, setTextInput] = useState('Welcome to SmartToolsHub - Free Online AI & Utility Tools!');
  const [wifiSsid, setWifiSsid] = useState('HomeWiFi_5G');
  const [wifiPass, setWifiPass] = useState('SecurePass123!');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState('support@smarttoolshub.app');
  const [emailSubject, setEmailSubject] = useState('Inquiry from Website');
  const [phoneNum, setPhoneNum] = useState('+1234567890');

  // QR Customizations
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [eccLevel, setEccLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Output states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute final payload string based on active content type
  const getPayload = (): string => {
    switch (contentType) {
      case 'url': {
        const trimmed = urlInput.trim();
        if (!trimmed) return 'https://smarttoolshub.app';
        return trimmed.startsWith('http://') || trimmed.startsWith('https://')
          ? trimmed
          : `https://${trimmed}`;
      }
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPass};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      case 'text':
      default:
        return textInput || 'Sample QR Code Content';
    }
  };

  useEffect(() => {
    generateQr();
  }, [
    contentType,
    urlInput,
    textInput,
    wifiSsid,
    wifiPass,
    wifiEncryption,
    wifiHidden,
    emailTo,
    emailSubject,
    phoneNum,
    fgColor,
    bgColor,
    size,
    eccLevel,
  ]);

  const generateQr = async () => {
    setGenerating(true);
    try {
      const payload = getPayload();
      const options = {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: eccLevel,
      };

      const url = await QRCode.toDataURL(payload, options);
      setQrDataUrl(url);

      const svg = await QRCode.toString(payload, { ...options, type: 'svg' });
      setQrSvgString(svg);
    } catch (err) {
      console.error('QR Code Generation Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${contentType}_smarttoolshub.png`;
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${contentType}_smarttoolshub.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyImageOrPayload = async () => {
    try {
      if (qrDataUrl) {
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch {
      // Fallback: Copy payload string
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Free QR Code Generator - SmartToolsHub',
      text: 'Generate custom QR codes for URLs, Wi-Fi networks, text, emails, and phone numbers instantly!',
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

  const colorPresets = [
    { name: 'Classic Dark', fg: '#0f172a', bg: '#ffffff' },
    { name: 'Indigo Accent', fg: '#4f46e5', bg: '#ffffff' },
    { name: 'Cyan Tech', fg: '#0891b2', bg: '#ffffff' },
    { name: 'Emerald Clean', fg: '#059669', bg: '#ffffff' },
    { name: 'Dark Mode Friendly', fg: '#f8fafc', bg: '#0f172a' },
  ];

  const faqs = [
    {
      q: 'How do QR codes work?',
      a: 'QR (Quick Response) codes store binary data encoded in a 2D matrix of dark and light squares. Scanning the code with a smartphone camera instantly decodes the embedded URL, text, Wi-Fi credentials, or contact details without requiring typing.',
    },
    {
      q: 'Do QR codes generated here ever expire?',
      a: 'No! All QR codes generated on SmartToolsHub are static QR codes. The encoded data is written directly into the QR code pattern, so it will work forever without external server reliance or subscriptions.',
    },
    {
      q: 'What error correction level should I choose?',
      a: 'Medium (15%) or Quartile (25%) is ideal for standard digital and print usage. Choose High (30%) if you plan to add a logo or if the printed code might suffer minor scratches or dirt.',
    },
    {
      q: 'How does a Wi-Fi QR Code work?',
      a: 'A Wi-Fi QR code encodes your network name (SSID), password, and security type using the standard WIFI protocol. When scanned with iOS or Android cameras, users can connect to your Wi-Fi network automatically with a single tap!',
    },
    {
      q: 'Is my data or Wi-Fi password kept private?',
      a: 'Yes, 100%! All QR codes are generated directly inside your web browser using client-side JavaScript. Your Wi-Fi password, URLs, and text are never sent to or stored on any server.',
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/50 dark:via-sky-950/40 dark:to-blue-950/50 border border-cyan-100 dark:border-cyan-900/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-cyan-600 text-white rounded-2xl shadow-md shrink-0">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Free Custom QR Code Generator
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              Create instant static QR codes for URLs, Wi-Fi networks, text, emails, and phone numbers in PNG or vector SVG.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleCopyImageOrPayload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-600" />}
            {copied ? 'Copied QR!' : 'Copy QR'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {shared ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Generator Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Data Type Selector */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                1. Select QR Data Type
              </span>
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setContentType('url')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  contentType === 'url'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                }`}
              >
                <LinkIcon className="w-4 h-4 mb-1.5" />
                URL Link
              </button>
              <button
                type="button"
                onClick={() => setContentType('wifi')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  contentType === 'wifi'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                }`}
              >
                <Wifi className="w-4 h-4 mb-1.5" />
                Wi-Fi
              </button>
              <button
                type="button"
                onClick={() => setContentType('text')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  contentType === 'text'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                }`}
              >
                <Type className="w-4 h-4 mb-1.5" />
                Plain Text
              </button>
              <button
                type="button"
                onClick={() => setContentType('email')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  contentType === 'email'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                }`}
              >
                <Mail className="w-4 h-4 mb-1.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setContentType('phone')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  contentType === 'phone'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                }`}
              >
                <Phone className="w-4 h-4 mb-1.5" />
                Phone
              </button>
            </div>

            {/* Content Input Fields */}
            <div className="pt-2">
              {contentType === 'url' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <p className="text-[11px] text-gray-400">
                    Scanners will automatically open this link when scanned.
                  </p>
                </div>
              )}

              {contentType === 'wifi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="MyHomeWiFi"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Wi-Fi Password
                      </label>
                      <input
                        type="text"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Encryption Standard
                      </label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None (Open Network)</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    Is this a hidden Wi-Fi network?
                  </label>
                </div>
              )}

              {contentType === 'text' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Plain Text Content
                  </label>
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter any text, code, message, or notes..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                  />
                </div>
              )}

              {contentType === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Recipient Email Address
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Inquiry"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {contentType === 'phone' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    placeholder="+1 (234) 567-8900"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Styling & Colors */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                2. Design & Styling Options
              </span>
              <Palette className="w-4 h-4 text-cyan-500" />
            </div>

            {/* Presets */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Color Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-cyan-500 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: preset.fg }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                    {fgColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                    {bgColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Resolution ({size}px)
                </label>
                <input
                  type="range"
                  min={180}
                  max={500}
                  step={10}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-cyan-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Error Correction
                </label>
                <select
                  value={eccLevel}
                  onChange={(e) => setEccLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-900 dark:text-white outline-none"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Display Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="w-full flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-500" />
              Live QR Preview
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              Ready
            </span>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900/90 rounded-3xl border border-gray-100 dark:border-gray-700/80 shadow-inner flex flex-col items-center justify-center w-full min-h-[280px]">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="max-w-full rounded-2xl shadow-md transition-all duration-150"
                style={{ width: `${Math.min(size, 260)}px` }}
              />
            ) : (
              <div className="w-64 h-64 flex flex-col items-center justify-center text-gray-400 space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
                <span className="text-xs font-bold">Rendering QR Code...</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-900 dark:bg-gray-700 hover:bg-black text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyImageOrPayload}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-500" />}
              {copied ? 'Copied to Clipboard!' : 'Copy QR Code Image / Data'}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section for SEO */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
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
                    <ChevronUp className="w-4 h-4 text-cyan-600 shrink-0" />
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
