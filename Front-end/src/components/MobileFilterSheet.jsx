import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterPanel from './FilterPanel';

function MobileFilterSheet({ open, filters, onChange, onApplyFilters, onReset, onClose }) {
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="filter-sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="filter-sheet-header">
          <div>
            <span className="field-kicker">Search controls</span>
            <h2 id="mobile-filter-title">Refine results</h2>
          </div>
          <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        </header>
        <div className="filter-sheet-body">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onApplyFilters={() => {
              onApplyFilters?.(filters);
              onClose();
            }}
            onReset={onReset}
            mobile
          />
        </div>
        <div className="filter-sheet-footer">
          <button type="button" className="button button-secondary" onClick={onReset}>
            Clear filters
          </button>
          <button type="button" className="button button-primary" onClick={() => { onApplyFilters?.(filters); onClose(); }}>
            <SlidersHorizontal size={16} />
            Apply filters
          </button>
        </div>
      </section>
    </div>
  );
}

MobileFilterSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileFilterSheet;
