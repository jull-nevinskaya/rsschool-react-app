import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from '../../hooks/useTheme.ts';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage }) => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setSearchParams({ page: totalPages.toString() });
    }
  }, [currentPage, totalPages, setSearchParams]);

  if (currentPage > totalPages) return null;

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div className={`pagination ${theme}`}>
      <button className={`btn-pagination ${theme}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        &#8592;
      </button>
      <span>Page {currentPage} / {totalPages}</span>
      <button className={`btn-pagination ${theme}`} onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}>
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;
