import React from "react";

interface PaginationProps {
  table: any;
}

const Pagination: React.FC<PaginationProps> = ({ table }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 text-center w-full">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of&nbsp;
          {table.getPageCount()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          className="px-3 py-1.5 border rounded bg-primary text-white disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <button
          className="px-3 py-1.5 border rounded bg-primary text-white disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
