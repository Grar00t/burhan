import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });

    // Specific handling for Firestore errors as requested in instructions
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.operationType) {
        console.error('Firestore Security/Permission Error Detected:', parsedError);
      }
    } catch (e) {
      // Not a JSON error, ignore
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans">
          <div className="glass p-8 rounded-2xl max-w-2xl w-full border-red-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">System Malfunction Detected</h1>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-400">
                The NIYAH Command Center has encountered a critical exception. Our sovereign protocols are attempting to isolate the fault.
              </p>
              
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm overflow-auto max-h-64 border border-white/5">
                <p className="text-red-400 mb-2">Error: {this.state.error?.message}</p>
                {this.state.errorInfo && (
                  <pre className="text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20"
              >
                Reboot Command Center
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
