import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import JokeModal from "../components/JokeModal.jsx";
import Pagination from "../components/Pagination.jsx";
import useCategories from "../hooks/useCategories.js";

const MyJokes = () => {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJoke, setSelectedJoke] = useState(null);
    const [category, setCategory] = useState("");
    const { categories } = useCategories();

    const fetchMyJokes = async () => {
        try {
            const response = await axiosInstance.get(
                `/jokes/my-jokes?page=${page}&category=${category}&limit=5`,
            );
            setData(response.data.data);
        } catch (error) {
            toast.error("Jokes Loading failed! ☹️");
        } finally {
            setLoading(false);
        }
    };
    const handleAddNew = () => {
        setSelectedJoke(null);
        setIsModalOpen(true);
    };

    const handleEdit = (joke) => {
        setSelectedJoke(joke);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Do you really want to delete this joke?")) return;

        try {
            await axiosInstance.delete(`/jokes/${id}`);
            const updatedJokes = data.jokes.filter((j) => j._id !== id);
            if (updatedJokes.length === 0) {
                if (page > 1) {
                    setPage((prev) => prev - 1);
                } else {
                    fetchMyJokes();
                }
            } else {
                setData((prev) => ({
                    ...prev,
                    jokes: updatedJokes,
                    totalJokes: prev.totalJokes - 1,
                }));
            }

            toast.success("Joke Deleted! 🗑️");
        } catch (error) {
            toast.error("Delete fail ho gaya!");
        }
    };
    useEffect(() => {
        fetchMyJokes();
    }, [page, category]);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => handleAddNew()}
                    className="cursor-pointer border-2 border-blue-500 rounded-xl py-2 px-4 bg-blue-700 text-white"
                >
                    Add Joke
                </button>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="outline-hidden cursor-pointer border-2 border-blue-500 rounded-xl py-2 px-4 bg-blue-700 text-white"
                >
                    <option value="" disabled hidden>
                        --Select--
                    </option>
                    <option value="">All</option>
                    {categories.length &&
                        categories.map((cat, i) => (
                            <option value={cat} key={i}>
                                {cat}
                            </option>
                        ))}
                </select>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-20 bg-gray-200 animate-pulse rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : data?.jokes?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg font-medium">
                        Jokes not created yet! 🧐
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {data?.jokes?.map((joke) => (
                        <div
                            key={joke._id}
                            className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex justify-between items-center group hover:border-indigo-200 transition"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${joke.isPublic ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
                                    >
                                        {joke.isPublic ? "Public" : "Private"}
                                    </span>
                                    <span className="text-xs text-indigo-500 font-semibold">
                                        {joke.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium line-clamp-2 italic">
                                    "{joke.content}"
                                </p>
                            </div>

                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(joke)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(joke._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* pagination component */}
            {!loading ? (
                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            ) : null}
            {/* popup modal comp */}
            <JokeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchJokes={fetchMyJokes}
                editData={selectedJoke}
            />
        </Layout>
    );
};

export default MyJokes;
