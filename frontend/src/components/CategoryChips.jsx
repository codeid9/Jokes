import useCategories from "../hooks/useCategories.js";
function CategoryChips({ onCategoryChange, category }) {
    const { categories, loading, error } = useCategories();

    if (error) {
        return (
            <h2 className="text-red-500 text-xl font-bold text-center">
                {error || "Somthing Went wrong"}
            </h2>
        );
    }

    return (
        <>
            {loading ? (
                <div className="flex gap-3 px-4 h-10  mb-8  scrollbar-hide overflow-x-auto">
                    {[...Array(15)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 w-auto px-16 py-2 rounded-full"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-3 px-4 h-10  mb-8  scrollbar-hide overflow-x-auto border-x-2">
                    <button
                        onClick={() => {
                            onCategoryChange("");
                        }}
                        className={`cursor-pointer px-5 py-2 capitalize rounded-full font-medium transition ${
                            category === "all"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
                        }`}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                onCategoryChange(cat);
                            }}
                            className={`cursor-pointer px-5 py-2  text-nowrap capitalize rounded-full font-medium transition ${
                                category === cat
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
                            }`}
                        >
                            {cat === "" ? "All" : cat}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}

export default CategoryChips;
