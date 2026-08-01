import React from 'react';
import { UserProfile, Tool, RecentToolItem } from '../types';
import { TOOLS } from '../data/toolsData';
import {
  User,
  Heart,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  Wrench,
  ArrowRight,
  Bookmark
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile | null;
  favoriteIds: string[];
  recentTools: RecentToolItem[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string) => void;
  onClearHistory: () => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  favoriteIds,
  recentTools,
  onSelectTool,
  onToggleFavorite,
  onClearHistory,
  onOpenAuth,
}) => {
  const favoriteTools = TOOLS.filter((t) => favoriteIds.includes(t.id));

  const recentToolDetails = recentTools
    .map((rt) => {
      const tool = TOOLS.find((t) => t.id === rt.toolId);
      return tool ? { ...tool, visitedAt: rt.visitedAt } : null;
    })
    .filter(Boolean) as (Tool & { visitedAt: number })[];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md p-1 border-2 border-white/40 shrink-0 shadow-lg">
            <img
              src={
                currentUser?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.email || 'Guest'}`
              }
              alt="User Avatar"
              className="w-full h-full object-cover rounded-xl bg-white"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">
                {currentUser?.isLoggedIn ? currentUser.name : 'Guest User'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-extrabold text-[10px] uppercase backdrop-blur-xs">
                {currentUser?.isLoggedIn ? 'Registered' : 'Free Session'}
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {currentUser?.isLoggedIn
                ? currentUser.email
                : 'Sign in to sync your saved tools and history across devices!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-stretch md:self-auto">
          {!currentUser?.isLoggedIn ? (
            <button
              onClick={onOpenAuth}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white text-indigo-600 font-extrabold text-xs shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              Sign In / Register
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-colors cursor-pointer"
            >
              Manage Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {favoriteIds.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Favorite Saved Tools</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {recentTools.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Recent Activity</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {TOOLS.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tools Available</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Saved Favorites Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Favorite Saved Tools
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {favoriteTools.length} Saved
            </span>
          </div>

          {favoriteTools.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-3">
              <Bookmark className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">
                No favorites saved yet!
              </h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Click the heart icon on any tool card across the site to save it to your quick dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoriteTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate max-w-[140px]">
                          {tool.name}
                        </h4>
                        <span className="text-[10px] text-gray-400">{tool.categoryName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(tool.id)}
                      className="p-1.5 text-rose-500 hover:text-gray-400 transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectTool(tool)}
                    className="w-full py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-700/60 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Tool
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tools History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            {recentTools.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {recentToolDetails.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-2">
              <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="text-xs text-gray-400">No tools used recently.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-2">
              {recentToolDetails.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </h5>
                      <span className="text-[10px] text-gray-400">
                        {new Date(tool.visitedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
