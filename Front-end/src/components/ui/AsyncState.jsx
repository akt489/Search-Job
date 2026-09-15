import PropTypes from 'prop-types';
import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="state-panel state-panel-loading" role="status" aria-live="polite">
      <div className="loading-skeleton loading-skeleton-heading" />
      <div className="loading-skeleton loading-skeleton-line" />
      <div className="loading-skeleton loading-skeleton-line loading-skeleton-short" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not complete that request.',
  onRetry,
  actionLabel = 'Retry',
}) {
  return (
    <section className="state-panel state-panel-error" role="alert">
      <div className="state-icon state-icon-error" aria-hidden="true">
        <AlertCircle size={20} />
      </div>
      <div className="state-copy">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          <RefreshCw size={16} />
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Try another search or come back later.',
  action,
  actionLabel,
  icon: Icon = SearchX,
}) {
  return (
    <section className="state-panel state-panel-empty" role="status">
      <div className="state-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div className="state-copy">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {action && actionLabel && (
        <button type="button" className="button button-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}

LoadingState.propTypes = { label: PropTypes.string };

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  actionLabel: PropTypes.string,
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  icon: PropTypes.elementType,
};
