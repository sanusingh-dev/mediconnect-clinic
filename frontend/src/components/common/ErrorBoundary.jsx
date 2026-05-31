import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log full error details for debugging
    try {
      console.error('ErrorBoundary caught an error:', error);
      if (error && error.stack) console.error('Stack:', error.stack);
      console.error('Component stack:', info?.componentStack);
    } catch (e) {
      // swallow logging errors
      console.error('Error while logging error in ErrorBoundary:', e);
    }
    // Preserve error info in state for developer inspection
    this.setState({ errorInfo: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-700 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
            <h1 className="text-4xl font-semibold">Something went wrong</h1>
            <p className="mt-4 text-slate-300">The page failed to load correctly. Please refresh, or contact support if the issue persists.</p>
            {/* Developer-only error details (shown in non-production) */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="mt-4 max-h-48 overflow-auto rounded-md bg-slate-800 p-3 text-xs text-rose-200">
                {String(this.state.error && (this.state.error.message || this.state.error))}
                {this.state.error?.stack ? '\n\n' + this.state.error.stack : ''}
                {this.state.errorInfo?.componentStack ? '\n\n' + this.state.errorInfo.componentStack : ''}
              </pre>
            )}
            <button onClick={this.handleReset} className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
