'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global error boundary component that catches unhandled errors
 * and displays a user-friendly fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    logger.error('ErrorBoundary caught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We&apos;ve been notified and are working to fix it. Please try reloading the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
