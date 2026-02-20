import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Explore = () => {
    const [jokes, setJokes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [page, setPage] = useState(1);

    const fetchCategories = async () => {
        try {
            const categories = await axiosInstance.get("/categories");
            return categories.data.data;
        } catch (error) {
            toast.error("Categories couldn't fetched!");
        }
    };

    const fetchJokes = async () => {
        setLoading(true);
        try {
            // Backend route: /jokes?page=1&category=Coding&user=tom
            const { data } = await axiosInstance.get(
                `/jokes/public?page=${page}&category=${category}`,
            );
            setJokes(data.data.jokes);
            const categories = await fetchCategories();
            setCategoryList(categories);
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
                <div className="flex flex-wrap gap-3  mb-8 justify-center">
                    {categoryList.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                setPage(1);
                            }}
                            className={`px-5 py-2 capitalize rounded-full font-medium transition ${
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jokes.map((joke) => (
                            <div
                                key={joke._id}
                                className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-md transition border border-gray-100 flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                        {joke.category}
                                    </span>
                                    <p className="text-gray-800 text-lg mt-4 leading-relaxed font-medium">
                                        "{joke.content}"
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                                    <span>By @{joke.author?.username}</span>
                                    <button className="hover:text-red-500 transition">
                                        ❤️ {joke.likesCount || 0}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Explore;
