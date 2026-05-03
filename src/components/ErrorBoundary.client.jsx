'use client';
import { Component } from 'react';
import { logger, serializeError } from '@/lib/logger';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.warn('client-error-boundary-triggered', {
      component: this.props.name || 'ErrorBoundary',
      error: serializeError(error),
      componentStack: errorInfo?.componentStack,
      handled: true,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
          <p className="text-base font-semibold">حدث خطأ في هذا الجزء من الصفحة.</p>
          <p className="mt-2 text-sm text-red-800">
            يمكنك إعادة المحاولة بدون كسر الصفحة كلها.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
          >
            إعادة المحاولة
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error?.message ? (
            <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-white/70 p-3 text-xs text-left" style={{ direction: 'ltr' }}>
              {this.state.error.message}
              {'\n'}
              {this.state.error?.stack}
            </pre>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}
