import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 mt-10 pb-10">
            {/* Previous Button */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
            >
                ← Prev
            </button>
            {/* Page Numbers */}
            <div className="flex gap-1 overflow-x-auto px-2">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-10 h-10 px-3 rounded-xl font-bold transition-all ${
                                currentPage === pageNum
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>
            {/* Next Button */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
            >
                Next →
            </button>
        </div>
    );
}

export default Pagination;
