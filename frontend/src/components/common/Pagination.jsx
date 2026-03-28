import { useState } from 'react';
import '../styles/Pagination.scss';

const Pagination = ({ currentPage, total, limit, onPageChange }) => {
  const pages = Math.ceil(total / limit);

  if (pages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < pages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages_array = [];

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pages_array.push(i);
      }
    } else {
      pages_array.push(1);
      if (currentPage > 3) pages_array.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(pages - 1, currentPage + 1);
        i++
      ) {
        pages_array.push(i);
      }
      if (currentPage < pages - 2) pages_array.push('...');
      pages_array.push(pages);
    }

    return pages_array;
  };

  return (
    <div className="pagination">
      <button onClick={handlePrevious} disabled={currentPage === 1} className="btn-prev">
        ← Previous
      </button>

      <div className="page-numbers">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => page !== '...' && handlePageClick(page)}
            disabled={page === '...'}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button onClick={handleNext} disabled={currentPage === pages} className="btn-next">
        Next →
      </button>
    </div>
  );
};

export default Pagination;
