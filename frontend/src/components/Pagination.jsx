function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                start = 1;
                end = 5;
            }
            if (currentPage >= totalPages - 2) {
                start = totalPages - 4;
                end = totalPages;
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mt-10 pb-10">
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-2 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                >
                    ← <span className="hidden sm:inline">Prev</span>
                </button>

                {/* First Page if hidden */}
                {pageNumbers[0] > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-10 h-10 rounded-xl bg-white text-gray-500 border border-gray-100 hover:bg-gray-100 font-bold"
                        >
                            1
                        </button>
                        <span className="text-gray-400">...</span>
                    </>
                )}

                {/* Main Page Numbers */}
                <div className="flex gap-1">
                    {pageNumbers.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                currentPage === pageNum
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Last Page if hidden */}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        <span className="text-gray-400">...</span>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-10 h-10 rounded-xl bg-white text-gray-500 border border-gray-100 hover:bg-gray-100 font-bold"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-2 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                >
                    <span className="hidden sm:inline">Next</span> →
                </button>
            </div>
            {/* Page Info */}
            <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                Page {currentPage} of {totalPages}
            </p>
        </div>
    );
}

export default Pagination;
