import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import Pagination from "../components/Pagination.jsx";
import useCategories from "../hooks/useCategories.js";
import JokeCard from "../components/JokeCard.jsx";

const Explore = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const { categories } = useCategories();

    const fetchJokes = async () => {
        setLoading(true);
        try {
            // Backend route: /jokes?page=1&category=Coding
            const { data } = await axiosInstance.get(
                `/jokes/public?page=${page}&category=${category}`,
            );
            setData(data.data);
        } catch (error) {
            toast.error("Jokes loading failed! ☹️");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchJokes();
    }, [page, category]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto p-6">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        Explore Jokes 🃏
                    </h1>
                    <p className="text-gray-500">
                        Duniya bhar ke kalesh aur maze yahan hain.
                    </p>
                </header>

                {/* Category Filters (Chips) */}
                <div className="flex gap-3 px-4 h-10  mb-8  scrollbar-hide overflow-x-auto border-x-2">
                    <button
                        onClick={() => {
                            setCategory("");
                            setPage(1);
                        }}
                        className={`px-5 py-2 capitalize rounded-full font-medium transition ${
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
                                setCategory(cat);
                                setPage(1);
                            }}
                            className={`px-5 py-2  text-nowrap capitalize rounded-full font-medium transition ${
                                category === cat
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
                            }`}
                        >
                            {cat === "" ? "All" : cat}
                        </button>
                    ))}
                </div>

                {/* Jokes Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-gray-200 rounded-2xl"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {data?.jokes.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-400 text-lg font-medium">
                                    Jokes Not Found! 🧐
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data?.jokes?.map((joke, i) => (
                                    <JokeCard
                                        key={i}
                                        content={joke.content}
                                        category={joke.category}
                                        likesCount={joke.likesCount}
                                        author={joke.author?.username}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* pagination */}
                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </main>
        </div>
    );
};

export default Explore;
