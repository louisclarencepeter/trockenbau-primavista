import { Component } from 'react';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <h1 className="error-boundary__title">Ein Fehler ist aufgetreten</h1>
            <p className="error-boundary__text">
              Entschuldigung, beim Laden der Seite ist etwas schiefgelaufen.
              Bitte versuchen Sie, die Seite neu zu laden.
            </p>
            <button
              type="button"
              className="error-boundary__button"
              onClick={this.handleReload}
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
