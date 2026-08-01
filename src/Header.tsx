import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Search, Share2, Menu, X, ShieldCheck, Wrench, Heart, User, LayoutDashboard, LogIn } from 'lucide-react';
import { ThemeMode, ActiveView, UserProfile } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenSearch: () => void;
  selectedToolName?: string;
  currentUser: UserProfile | null;
  favoriteCount: number;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  activeView,
  setActiveView,
  onOpenSearch,
  selectedToolName,
  currentUser,
  favoriteCount,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SmartToolsHub - Free AI & Online Tools for Everyone',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">
                SmartTools<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                Free
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Free AI & Online Utilities Suite
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors cursor-pointer ${
              activeView === 'home' && !selectedToolName
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              setTimeout(() => {
                document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Categories
          </button>

          <button
            onClick={() => setActiveView('about')}
            className={`transition-colors cursor-pointer ${
              activeView === 'about'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            About
          </button>

          <button
            onClick={() => setActiveView('blog')}
            className={`transition-colors cursor-pointer ${
              activeView === 'blog' || activeView === 'blog-post'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            Blog
          </button>

          <button
            onClick={() => setActiveView('request-tool')}
            className={`transition-colors cursor-pointer flex items-center gap-1 ${
              activeView === 'request-tool'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Request Tool
          </button>

          <button
            onClick={() => setActiveView('contact')}
            className={`transition-colors cursor-pointer ${
              activeView === 'contact'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium hover:border-indigo-400 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-[10px] rounded font-mono text-gray-600 dark:text-gray-300">
              ⌘K
            </kbd>
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="View Favorite Saved Tools"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Share or Copy Tool Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Dark/Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User Profile / Login Avatar Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer"
          >
            {currentUser?.isLoggedIn ? (
              <>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover bg-indigo-200"
                />
                <span className="hidden sm:inline truncate max-w-[80px]">{currentUser.name}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Sign In</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-3">
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs"
          >
            <Search className="w-4 h-4" />
            Search 20+ tools...
          </button>
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold"
            >
              User Dashboard ({favoriteCount} Saved)
            </button>
            <button
              onClick={() => {
                setActiveView('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActiveView('blog');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Blog & Guides
            </button>
            <button
              onClick={() => {
                setActiveView('request-tool');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Request a New Tool / Feedback
            </button>
            <button
              onClick={() => {
                setActiveView('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                setActiveView('privacy');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setActiveView('terms');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => {
                setActiveView('disclaimer');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              Disclaimer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
