import { AlertTriangle } from 'lucide-react';
import './FormErrorMessage.scss';

const DEFAULT_EMAIL = 'info@trockenbau-primavista.ch';

function FormErrorMessage({ contactEmail = DEFAULT_EMAIL, className = '' }) {
  return (
    <div className={`form-error${className ? ` ${className}` : ''}`} role="alert">
      <AlertTriangle size={20} strokeWidth={2.2} aria-hidden="true" />
      <div className="form-error__body">
        <strong>Senden fehlgeschlagen.</strong>
        <span>
          Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </span>
      </div>
    </div>
  );
}

export default FormErrorMessage;
