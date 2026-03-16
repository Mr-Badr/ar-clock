'use client';
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-500 rounded text-red-700" style={{direction: "ltr"}}>
          <strong>Client Error:</strong> {this.state.error?.message}
          <pre className="text-xs mt-2 overflow-auto max-h-40">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
