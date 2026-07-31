# 🚀 SmartToolsHub - Free Online AI Tools & Utilities Suite

**SmartToolsHub** is a high-performance, privacy-first, zero-paywall web application offering 20+ free online AI tools, PDF converters, image tools, financial calculators, text utilities, and developer tools.

Engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**, SmartToolsHub processes files and data locally in the client browser using WebAssembly and HTML5 Canvas APIs for maximum security, speed, and efficiency.

---

## ✨ Features & Architecture Highlights

- **20+ Online Utilities**: AI Resume Builder, AI Cover Letter Writer, PDF Compressor, PDF Merger, Image Resizer, EMI Calculator, JSON Formatter, QR Code Generator, Word Counter, and more.
- **Client-Side Security**: Files and document conversions remain local inside browser memory. Zero server uploads required for file processing.
- **20+ Detailed SEO Guides & Articles**: Rich blog engine with schema markup for maximum search engine indexability and AdSense readiness.
- **Instant Search & Category Filtering**: Keyboard-accessible global search modal (`Cmd/Ctrl + K`) and category-based landing views.
- **Dark & Light Mode**: Automated system theme detection with persisted localStorage preferences.
- **User Dashboard & Saved Favorites**: Save favorite tools and review recent tool usage history.
- **Dynamic SEO & Structured Data**: Automated JSON-LD schemas (`WebApplication`, `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `BlogPosting`) for Google Search Console and Rich Snippets.
- **Webmaster Ready**: Embedded `sitemap.xml`, `robots.txt`, and Google Analytics / Search Console verification placeholders.
- **Responsive & Mobile-First**: Touch-friendly 44px+ controls and adaptive drawer layouts optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool & Bundler** | Vite |
| **Styling Framework** | Tailwind CSS v4 with CSS variables |
| **Icons** | Lucide React |
| **State Persistence** | Browser `localStorage` & HTML5 APIs |
| **SEO & Meta** | Custom React JSON-LD Schema Engine |

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/smarttoolshub.git
   cd smarttoolshub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Lint and Type Check**:
   ```bash
   npm run lint
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Cloudflare Pages (Recommended)

Cloudflare Pages provides global edge distribution, free SSL certificates, and unlimited bandwidth.

### Method 1: Git Integration (Easiest)

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com) and navigate to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository `smarttoolshub`.
4. Configure Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

> **Note on SPA Routing**: SmartToolsHub includes `public/_redirects` (`/* /index.html 200`), which Cloudflare Pages reads automatically to support clean single-page app route reloads.

### Method 2: Deploying via Direct Upload / Wrangler CLI

1. Install Wrangler globally:
   ```bash
   npm install -g wrangler
   ```

2. Build the applet:
   ```bash
   npm run build
   ```

3. Deploy `dist/` directly:
   ```bash
   wrangler pages deploy dist --project-name=smarttoolshub
   ```

---

## 🐙 Deploying to GitHub Pages

GitHub Pages allows free hosting directly from your repository.

### Step-by-step Setup

1. Open `package.json` and set your site URL (optional):
   ```json
   "homepage": "https://<your-username>.github.io/smarttoolshub"
   ```

2. Install `gh-pages` as a dev dependency:
   ```bash
   npm install -D gh-pages
   ```

3. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Run the deploy command:
   ```bash
   npm run deploy
   ```

5. In GitHub Repo Settings > **Pages**, select branch `gh-pages` and root folder `/`. Click **Save**.

> **Note on SPA Fallback**: The included `public/404.html` automatically catches direct deep links and redirects users seamlessly to the SPA root.

---

## 🔍 Google Search Console & AdSense Configuration

1. **Verify Ownership**:
   Replace the meta tag token in `index.html`:
   ```html
   <meta name="google-site-verification" content="YOUR_ACTUAL_VERIFICATION_TOKEN" />
   ```

2. **Submit Sitemap**:
   In Google Search Console, navigate to **Sitemaps** and submit:
   `https://your-domain.com/sitemap.xml`

3. **Google Analytics (GA4)**:
   Replace `G-MEASUREMENT_ID_PLACEHOLDER` in `index.html` with your Google Analytics 4 tracking ID.

---

## 📄 License

Distributed under the MIT License. Free for personal and commercial use.
