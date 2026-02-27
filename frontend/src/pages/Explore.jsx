import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import Pagination from "../components/Pagination.jsx";
import JokeCard from "../components/JokeCard.jsx";
import CategoryChips from "../components/CategoryChips.jsx";

const Explore = () => {
    const [data, setData] = useState({
        jokes: [],
        currentPage: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    const handleCategory = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    const fetchJokes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(
                `/jokes/public?page=${page}&category=${category}`,
            );
            setData(response.data.data);
        } catch (error) {
            console.error("Fetch Error:", error.message);
            setError("Unable to sync with the humor cloud. Please try again.");
            toast.error("Network glitch! Laughter postponed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJokes();
    }, [page, category]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Section Header */}
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Global <span className="text-indigo-600">Feed</span> 🃏
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        The ultimate destination for the world's finest humor. 
                        Discover, laugh, and connect through wit.
                    </p>
                </header>

                {/* Filters */}
                <div className="mb-12">
                    <CategoryChips
                        category={category}
                        onCategoryChange={handleCategory}
                    />
                </div>

                {/* Results Area */}
                <div className="min-h-100">
                    {error ? (
                        <div className="text-center py-20 bg-white rounded-4xl border border-rose-100 shadow-xl shadow-rose-50/50 max-w-lg mx-auto">
                            <div className="text-5xl mb-4">🛰️</div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
                            <button
                                onClick={fetchJokes}
                                className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                            >
                                Re-sync Feed
                            </button>
                        </div>
                    ) : loading ? (
                        /* Enhanced Skeleton Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-64 bg-white rounded-4xl border border-slate-100 p-8 space-y-4 shadow-sm"
                                >
                                    <div className="h-4 w-20 bg-slate-100 rounded-full animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-slate-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-3/4 bg-slate-50 rounded-full animate-pulse" />
                                    </div>
                                    <div className="pt-10 flex justify-between">
                                        <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
                                        <div className="h-8 w-8 bg-slate-100 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {data.jokes?.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-4xl border-2 border-dashed border-slate-200">
                                    <div className="text-6xl mb-6">🏝️</div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Humor Desert!</h3>
                                    <p className="text-slate-400 font-medium">No jokes found in this category yet. Be the first to crack one!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {data.jokes.map((joke) => (
                                            <JokeCard
                                                key={joke._id}
                                                jokeId={joke._id}
                                                content={joke.content}
                                                category={joke.category}
                                                likesCount={joke.likesCount}
                                                isLiked={joke.isLiked}
                                                author={joke.authorDetails?.username}
                                            />
                                        ))}
                                    </div>

                                    {data.totalPages > 1 && (
                                        <div className="mt-16 flex justify-center">
                                            <Pagination
                                                currentPage={data.currentPage}
                                                totalPages={data.totalPages}
                                                onPageChange={(newPage) => {
                                                    setPage(newPage);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll back to top
                                                }}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Explore;