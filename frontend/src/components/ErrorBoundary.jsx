import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-color, #f8fafc)',
          color: 'var(--text-primary, #0f172a)',
          padding: '24px',
          fontFamily: 'var(--font-family, system-ui, sans-serif)',
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--card-bg-solid, #ffffff)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--border-color, #e2e8f0)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '20px',
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '28px' }}>
              An unexpected error occurred while displaying this page. Your data is safe. Try reloading or heading back to the home page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'var(--color-dashboard-blue, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.25)',
                }}
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleHome}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'var(--bg-color, #f1f5f9)',
                  color: 'var(--text-primary, #0f172a)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  cursor: 'pointer',
                }}
              >
                Return to Home
              </button>
            </div>
            {this.state.error?.message && (
              <details style={{ marginTop: '24px', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>
                <summary style={{ cursor: 'pointer', outline: 'none' }}>Technical Details</summary>
                <pre style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: '#e11d48',
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
