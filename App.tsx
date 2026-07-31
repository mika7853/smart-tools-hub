import React, { useState, useEffect } from 'react';
import { ThemeMode, ActiveView, Tool, UserProfile, RecentToolItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { PopularToolsSection } from './components/PopularToolsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { RecentlyUsedSection } from './components/RecentlyUsedSection';
import { InfoModals } from './components/InfoModals';
import { ToolContainer } from './components/ToolContainer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { DashboardView } from './components/DashboardView';
import { SitemapView } from './components/SitemapView';
import { RobotsView } from './components/RobotsView';
import { NotFoundView } from './components/NotFoundView';
import { Breadcrumbs } from './components/Breadcrumbs';
import { SeoHead } from './components/SeoHead';
import { BlogView } from './components/BlogView';
import { BlogPostView } from './components/BlogPostView';
import { CategoryView } from './components/CategoryView';
import { TrendingAndLatestSection } from './components/TrendingAndLatestSection';
import { NewsletterSection } from './components/NewsletterSection';
import { RequestToolView } from './components/RequestToolView';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, ToastMessage } from './components/Toast';
import { BlogPost } from './types';
import { TOOLS } from './data/toolsData';
import { BLOG_POSTS } from './data/blogData';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('smarttoolshub_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState<boolean>(false);

  // Toasts Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smarttoolshub_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Favorites State
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('smarttoolshub_favorites');
    return saved ? JSON.parse(saved) : ['ai-resume-builder', 'qr-code-generator', 'image-compressor'];
  });

  // Recent Tools History State
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() => {
    const saved = localStorage.getItem('smarttoolshub_recent');
    return saved
      ? JSON.parse(saved)
      : [
          { toolId: 'ai-resume-builder', visitedAt: Date.now() - 3600000 },
          { toolId: 'qr-code-generator', visitedAt: Date.now() - 7200000 },
        ];
  });

  // Hash Navigation Handler
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#tool-')) {
        const toolId = hash.replace('#tool-', '');
        const tool = TOOLS.find((t) => t.id === toolId);
        if (tool) {
          setSelectedTool(tool);
          setActiveView('tool');
        }
      } else if (hash.startsWith('#category-')) {
        const catId = hash.replace('#category-', '');
        setSelectedCategory(catId);
        setActiveView('category');
        setSelectedTool(null);
      } else if (hash.startsWith('#blog-')) {
        const slug = hash.replace('#blog-', '');
        const post = BLOG_POSTS.find((p) => p.slug === slug);
        if (post) {
          setSelectedBlogPost(post);
          setActiveView('blog-post');
          setSelectedTool(null);
        }
      } else if (hash === '#blog') {
        setActiveView('blog');
        setSelectedTool(null);
      } else if (['about', 'contact', 'privacy', 'terms', 'disclaimer', 'dashboard', 'sitemap', 'robots'].includes(hash.replace('#', ''))) {
        setActiveView(hash.replace('#', '') as ActiveView);
        setSelectedTool(null);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Sync dark class on html root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('smarttoolshub_theme', theme);
  }, [theme]);

  // Sync User to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smarttoolshub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smarttoolshub_user');
    }
  }, [currentUser]);

  // Sync Favorites
  useEffect(() => {
    localStorage.setItem('smarttoolshub_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Sync Recent Tools
  useEffect(() => {
    localStorage.setItem('smarttoolshub_recent', JSON.stringify(recentTools));
  }, [recentTools]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addToast('info', `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  };

  const handleToggleFavorite = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    const toolName = tool ? tool.name : 'Tool';
    setFavoriteIds((prev) => {
      const exists = prev.includes(toolId);
      if (exists) {
        addToast('info', `Removed ${toolName} from favorites`);
        return prev.filter((id) => id !== toolId);
      } else {
        addToast('success', `Added ${toolName} to favorites!`);
        return [...prev, toolId];
      }
    });
  };

  const recordToolVisit = (toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((item) => item.toolId !== toolId);
      return [{ toolId, visitedAt: Date.now() }, ...filtered].slice(0, 15);
    });
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    recordToolVisit(tool.id);
    window.location.hash = `#tool-${tool.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedTool(null);
    setActiveView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setRecentTools([]);
    addToast('info', 'Recent tools history cleared.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged out successfully.');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
        {/* Dynamic SEO Meta, Canonical & Schema Handler */}
        <SeoHead selectedTool={selectedTool} activeView={activeView} />

      {/* Header Bar */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedTool(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        selectedToolName={selectedTool?.name}
        currentUser={currentUser}
        favoriteCount={favoriteIds.length}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Breadcrumb Navigation Bar */}
      <Breadcrumbs
        activeView={activeView}
        selectedTool={selectedTool}
        onNavigateHome={handleBackToHome}
        onNavigateView={(view) => {
          setActiveView(view);
          setSelectedTool(null);
        }}
        onNavigateCategory={(catId) => {
          setSelectedCategory(catId);
          setSelectedTool(null);
          setActiveView('home');
          setTimeout(() => {
            document.getElementById('popular-tools-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedTool ? (
          <ToolContainer
            tool={selectedTool}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={handleSelectTool}
            onBack={handleBackToHome}
          />
        ) : activeView === 'home' ? (
          <>
            {/* 1. Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectTool={handleSelectTool}
            />

            {/* 2. Featured Categories */}
            <CategorySection
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setTimeout(() => {
                  document.getElementById('popular-tools-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
            />

            {/* 3. Recently Used Tools (if history exists) */}
            <RecentlyUsedSection
              recentTools={recentTools}
              onSelectTool={handleSelectTool}
              onClearHistory={handleClearHistory}
            />

            {/* 4. Trending & Latest Curated Utilities */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <TrendingAndLatestSection
                onSelectTool={handleSelectTool}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>

            {/* 5. Popular Tools Grid */}
            <PopularToolsSection
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onSelectTool={handleSelectTool}
            />

            {/* 6. Newsletter Subscription Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NewsletterSection onToast={addToast} />
            </div>

            {/* 7. Features Section */}
            <FeaturesSection />
          </>
        ) : activeView === 'category' && selectedCategory ? (
          <CategoryView
            categoryId={selectedCategory}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={handleSelectTool}
            onSelectPost={(post) => {
              setSelectedBlogPost(post);
              setActiveView('blog-post');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackHome={handleBackToHome}
          />
        ) : activeView === 'dashboard' ? (
          <DashboardView
            currentUser={currentUser}
            favoriteIds={favoriteIds}
            recentTools={recentTools}
            onSelectTool={handleSelectTool}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : activeView === 'blog' ? (
          <BlogView
            onSelectPost={(post) => {
              setSelectedBlogPost(post);
              setActiveView('blog-post');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTool={(tool) => {
              setSelectedTool(tool);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackHome={handleBackToHome}
          />
        ) : activeView === 'blog-post' && selectedBlogPost ? (
          <BlogPostView
            post={selectedBlogPost}
            onBackToBlog={() => {
              setActiveView('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTool={(tool) => {
              setSelectedTool(tool);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectPost={(post) => {
              setSelectedBlogPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'sitemap' ? (
          <SitemapView onSelectTool={handleSelectTool} onNavigateHome={handleBackToHome} />
        ) : activeView === 'robots' ? (
          <RobotsView />
        ) : activeView === 'request-tool' ? (
          <RequestToolView onBackHome={handleBackToHome} onToast={addToast} />
        ) : activeView === '404' ? (
          <NotFoundView onSelectTool={handleSelectTool} onNavigateHome={handleBackToHome} />
        ) : (
          /* Info / Legal / About / Contact / Privacy / Terms / Disclaimer Views */
          <InfoModals activeView={activeView} setActiveView={setActiveView} />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedTool(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setSelectedTool(null);
          setActiveView('home');
          setTimeout(() => {
            document.getElementById('popular-tools-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenAnalytics={() => setAnalyticsModalOpen(true)}
      />

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTool={handleSelectTool}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={handleLogout}
      />

      <AnalyticsModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Cookie Consent Banner */}
      <CookieConsent onAccept={() => addToast('success', 'Cookie preferences saved.')} />
    </div>
    </ErrorBoundary>
  );
}
