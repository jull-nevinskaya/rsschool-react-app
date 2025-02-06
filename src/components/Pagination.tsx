import React from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div className="pagination">
      <button className="btn-pagination" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        &#8592;
      </button>
      <span>Page {currentPage} / {totalPages}</span>
      <button className="btn-pagination" onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}>
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;
