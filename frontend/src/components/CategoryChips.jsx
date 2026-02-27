import { useRef, useState } from "react";
import useCategories from "../hooks/useCategories.js";

function CategoryChips({ onCategoryChange, category }) {
    const { categories, loading, error } = useCategories();
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse Drag Logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (error) return <div className="text-red-500 p-4 text-center">⚠️ Error loading categories</div>;

    return (
        <div className="w-full mb-8 select-none"> {/* select-none taaki text highlight na ho drag krte waqt */}
            {loading ? (
                <div className="flex gap-3 px-4 h-11 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-slate-200 animate-pulse min-w-30 rounded-full" />
                    ))}
                </div>
            ) : (
                <div 
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex gap-3 px-4 h-12 overflow-x-auto scrollbar-hide snap-x cursor-grab active:cursor-grabbing pb-1`}
                >
                    <button
                        onClick={() => !isDragging && onCategoryChange("")}
                        className={`shrink-0 px-6 py-2 h-full rounded-full font-bold text-sm transition-all border-2 snap-start ${
                            category === "" || category === "all"
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
                        }`}
                    >
                        Explore All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => !isDragging && onCategoryChange(cat)}
                            className={`shrink-0 px-6 py-2 h-full rounded-full font-bold text-sm transition-all border-2 snap-start capitalize ${
                                category === cat
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                    : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryChips;