import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // Explicitly type properties for React 19 / TypeScript 5.8
  public declare state: State;
  public declare props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SmartToolsHub App:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 text-gray-900 dark:text-white">
          <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                500 Application Exception
              </span>
              <h1 className="text-2xl font-black">Something Went Wrong</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                An unexpected runtime error occurred. Don't worry—your local browser files and saved favorites remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-left text-[11px] font-mono text-gray-600 dark:text-gray-300 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleHome}
                className="py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
