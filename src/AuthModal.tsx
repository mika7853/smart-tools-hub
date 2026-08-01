import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name: mode === 'signup' ? name || email.split('@')[0] : currentUser?.name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isLoggedIn: true,
    };

    onLoginSuccess(user);
    setSuccessMsg(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleQuickDemoUser = () => {
    const demoUser: UserProfile = {
      id: 'usr_demo_88',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
      joinedAt: 'Jul 2026',
      isLoggedIn: true,
    };
    onLoginSuccess(demoUser);
    setSuccessMsg('Signed in as Alex Johnson!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser?.isLoggedIn ? (
          /* User Logged In Card */
          <div className="text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-100 dark:bg-indigo-950/80 p-1 border-2 border-indigo-500 overflow-hidden shadow-lg">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentUser.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                Pro Member • Joined {currentUser.joinedAt}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={onLogout}
                className="w-full py-3 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-2xl border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Auth Form */
          <>
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Save favorites, track tool history, and customize your experience.
              </p>
            </div>

            {/* Toggle Mode Pills */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'login' ? 'Sign In to SmartToolsHub' : 'Create Free Account'}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 bg-white dark:bg-gray-900 px-2">
                    Or Instant Demo
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoUser}
                  className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  ⚡ One-Click Demo Sign In
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
