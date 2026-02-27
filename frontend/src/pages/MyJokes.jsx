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
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/jokes/my-jokes?page=${page}&category=${category}&limit=5`,
            );
            setData(response.data.data);
        } catch (error) {
            toast.error("Cloud sync failed! ☹️");
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
        if (!window.confirm("Are you sure you want to permanently delete this joke?")) return;

        try {
            await axiosInstance.delete(`/jokes/${id}`);
            toast.success("Joke moved to trash! 🗑️");
            fetchMyJokes(); // Refresh to handle pagination logic correctly
        } catch (error) {
            toast.error("Operation failed!");
        }
    };

    useEffect(() => {
        fetchMyJokes();
    }, [page, category]);

    return (
        <Layout>
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Library</h1>
                    <p className="text-slate-500 font-medium text-sm">Manage and curate your humor collection.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 sm:flex-none outline-none cursor-pointer border border-slate-200 rounded-2xl py-3 px-4 bg-white text-slate-600 font-bold text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, i) => (
                            <option value={cat} key={i}>{cat}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => handleAddNew()}
                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-3 px-6 font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        + Create
                    </button>
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white animate-pulse rounded-4xl border border-slate-100"></div>
                    ))}
                </div>
            ) : data?.jokes?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="text-5xl mb-4 text-slate-300">🧊</div>
                    <p className="text-slate-500 text-lg font-bold tracking-tight">
                        Your library is empty.
                    </p>
                    <button onClick={handleAddNew} className="text-indigo-600 font-black mt-2 hover:underline">Start writing now</button>
                </div>
            ) : (
                <div className="grid gap-5">
                    {data?.jokes?.map((joke) => (
                        <div
                            key={joke._id}
                            className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/30 transition-all duration-300"
                        >
                            <div className="flex-1 pr-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <span
                                        className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] ${joke.isPublic ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}
                                    >
                                        {joke.isPublic ? "Public" : "Private"}
                                    </span>
                                    <span className="text-xs text-indigo-500 font-black uppercase tracking-widest">
                                        {joke.category}
                                    </span>
                                </div>
                                <p className="text-slate-700 font-semibold leading-relaxed line-clamp-2">
                                    "{joke.content}"
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                                <button
                                    onClick={() => handleEdit(joke)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-bold text-sm"
                                >
                                    <span>Edit</span> ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(joke._id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-bold text-sm"
                                >
                                    <span>Delete</span> 🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Container */}
            {!loading && data?.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                    <Pagination
                        currentPage={data.currentPage}
                        totalPages={data.totalPages}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            )}

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