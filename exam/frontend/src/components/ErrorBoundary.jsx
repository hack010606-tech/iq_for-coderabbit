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
    console.error('Exam ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleResume = () => {
    window.location.reload();
  };

  handleClose = () => {
    window.close();
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
          background: '#f8fafc',
          color: '#1e293b',
          padding: '24px',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              marginBottom: '16px',
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Assessment Interface Interrupted
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
              An interface rendering error occurred. Your answered questions and remaining exam time are safely stored on the server. Click below to resume your assessment.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleResume}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Resume Assessment
              </button>
              <button
                type="button"
                onClick={this.handleClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                Close Tab
              </button>
            </div>
            {this.state.error?.message && (
              <details style={{ marginTop: '20px', textAlign: 'left', fontSize: '11px', color: '#94a3b8' }}>
                <summary style={{ cursor: 'pointer' }}>Error Details</summary>
                <pre style={{
                  marginTop: '6px',
                  padding: '8px',
                  background: '#f8fafc',
                  borderRadius: '6px',
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
