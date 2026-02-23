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
            setError("Jokes Fetch Fail! Please try again.");
            toast.error("Failed to load jokes!");
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
                <CategoryChips
                    category={category}
                    onCategoryChange={handleCategory}
                />

                {/* Main Content Area */}
                {error ? (
                    <div className="text-center py-10">
                        <h1 className="text-red-500 text-xl font-bold">
                            {error}
                        </h1>
                        <button
                            onClick={fetchJokes}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-gray-300 rounded-2xl"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {data.jokes?.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-400 text-lg font-medium">
                                    Jokes Not Found! 🧐
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.jokes.map((joke) => (
                                        <JokeCard
                                            key={joke._id}
                                            jokeId={joke._id}
                                            content={joke.content}
                                            category={joke.category}
                                            likesCount={joke.likesCount}
                                            isLiked={joke.isLiked}
                                            author={
                                                joke.authorDetails?.username
                                            }
                                        />
                                    ))}
                                </div>

                                {/* 3. Pagination sirf tabhi dikhega jab data ho aur loading/error na ho */}
                                {data.totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={data.currentPage}
                                            totalPages={data.totalPages}
                                            onPageChange={(newPage) =>
                                                setPage(newPage)
                                            }
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Explore;
