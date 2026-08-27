import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination-bar" aria-label="Pagination Navigation">
      <button
        type="button"
        className="page-button page-prev"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        &laquo; Prev
      </button>

      <div className="page-list">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? 'page' : undefined}
            className={page === currentPage ? 'page-button page-number active' : 'page-button page-number'}
            onClick={() => onChange(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="page-button page-next"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next &raquo;
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
