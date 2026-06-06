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
        <div className="mx-auto my-6 max-w-3xl rounded-[var(--radius-lg)] border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-[var(--text-primary)]">
          <p className="text-base font-semibold">حدث خطأ في هذا الجزء من الصفحة.</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            يمكنك إعادة المحاولة بدون كسر الصفحة كلها.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-[var(--radius-md)] border border-[var(--blue)] bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-[var(--text-on-accent)] transition-colors hover:border-[var(--blue-hover)] hover:bg-[var(--blue-hover)]"
          >
            إعادة المحاولة
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error?.message ? (
            <pre className="mt-4 max-h-40 overflow-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface-1)] p-3 text-left text-xs text-[var(--text-secondary)]" style={{ direction: 'ltr' }}>
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
