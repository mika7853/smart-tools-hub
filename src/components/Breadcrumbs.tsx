import React from 'react';
import { ChevronRight, Home, Wrench } from 'lucide-react';
import { ActiveView, Tool } from '../types';

interface BreadcrumbsProps {
  activeView: ActiveView;
  selectedTool: Tool | null;
  onNavigateHome: () => void;
  onNavigateView: (view: ActiveView) => void;
  onNavigateCategory?: (category: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeView,
  selectedTool,
  onNavigateHome,
  onNavigateView,
  onNavigateCategory,
}) => {
  return (
    <nav className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-auto whitespace-nowrap scrollbar-none">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {selectedTool ? (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mx-1" />
          <button
            onClick={() => {
              if (onNavigateCategory) {
                onNavigateCategory(selectedTool.category);
              } else {
                onNavigateHome();
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            {selectedTool.categoryName}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mx-1" />
          <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
            {selectedTool.name}
          </span>
        </>
      ) : activeView !== 'home' ? (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mx-1" />
          <span className="font-bold text-gray-900 dark:text-white capitalize">
            {activeView === 'privacy'
              ? 'Privacy Policy'
              : activeView === 'terms'
              ? 'Terms & Conditions'
              : activeView === 'disclaimer'
              ? 'Disclaimer'
              : activeView === 'sitemap'
              ? 'Sitemap.xml'
              : activeView === 'robots'
              ? 'Robots.txt'
              : activeView === 'dashboard'
              ? 'User Dashboard'
              : activeView === 'blog'
              ? 'Blog & Guides'
              : activeView === 'blog-post'
              ? 'Blog Article'
              : activeView === '404'
              ? 'Page Not Found'
              : activeView}
          </span>
        </>
      ) : null}
    </nav>
  );
};
