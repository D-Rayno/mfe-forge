import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import type { MFEErrorInfo } from './types.js';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: MFEErrorInfo) => ReactNode);
  remoteName?: string;
  onError?: (info: MFEErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class MFErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    const mfeError: MFEErrorInfo = {
      error,
      componentStack: errorInfo.componentStack || '',
      remoteName: this.props.remoteName
    };

    if (this.props.onError) {
      this.props.onError(mfeError);
    }

    // Log to monitoring service in production
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
      console.error('[MFE Error]', mfeError);
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback, remoteName } = this.props;
      const errorInfo: MFEErrorInfo = {
        error: this.state.error!,
        componentStack: this.state.errorInfo?.componentStack || '',
        remoteName
      };

      if (typeof fallback === 'function') {
        return fallback(errorInfo);
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className="mfe-error-boundary" style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>⚠️ Something went wrong</h2>
            {remoteName && <p style={styles.remote}>Remote: {remoteName}</p>}
            <p style={styles.message}>{this.state.error?.message}</p>
            <button 
              style={styles.button}
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '2rem'
  },
  card: {
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    maxWidth: '400px',
    textAlign: 'center',
    background: '#fef2f2'
  },
  title: {
    color: '#dc2626',
    marginBottom: '0.5rem',
    fontSize: '1.25rem'
  },
  remote: {
    color: '#7f1d1d',
    fontSize: '0.875rem',
    marginBottom: '0.5rem'
  },
  message: {
    color: '#991b1b',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  button: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer'
  }
};
