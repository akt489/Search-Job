function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination-bar" aria-label="Job listing pages">
      <button
        type="button"
        className="page-button page-prev"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <div className="page-list">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? 'page' : undefined}
            className={page === currentPage ? 'page-button page-number active' : 'page-button page-number'}
            onClick={() => onChange(page)}
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
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
