function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        // Mobile par kam numbers dikhayenge (3), Desktop par zyada (5)
        const showMax = window.innerWidth < 640 ? 3 : 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - Math.floor(showMax / 2));
            let end = Math.min(totalPages, start + showMax - 1);

            if (end === totalPages) {
                start = Math.max(1, totalPages - showMax + 1);
            }
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col justify-center items-center gap-6 mt-12 pb-12">
            <div className="flex items-center gap-1.5 sm:gap-3">
                
                {/* Previous Button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="flex items-center justify-center p-2.5 sm:px-5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    aria-label="Previous Page"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden md:inline ml-2 font-bold text-sm uppercase tracking-wider">Prev</span>
                </button>

                {/* Desktop: Show First Page if hidden */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {pageNumbers[0] > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="w-11 h-11 rounded-2xl bg-white text-slate-500 border border-slate-200 hover:border-indigo-400 font-bold transition-all"
                            >
                                1
                            </button>
                            <span className="text-slate-400 px-1 font-black">···</span>
                        </>
                    )}
                </div>

                {/* Main Page Numbers */}
                <div className="flex gap-1.5 sm:gap-2">
                    {pageNumbers.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl font-black transition-all duration-300 text-sm sm:text-base ${
                                currentPage === pageNum
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110 z-10"
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Desktop: Show Last Page if hidden */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            <span className="text-slate-400 px-1 font-black">···</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-11 h-11 rounded-2xl bg-white text-slate-500 border border-slate-200 hover:border-indigo-400 font-bold transition-all"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Next Button */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex items-center justify-center p-2.5 sm:px-5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    aria-label="Next Page"
                >
                    <span className="hidden md:inline mr-2 font-bold text-sm uppercase tracking-wider">Next</span>
                    <span className="text-lg">→</span>
                </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">
                    {currentPage} <span className="mx-1 text-slate-300">/</span> {totalPages}
                </span>
            </div>
        </div>
    );
}

export default Pagination;