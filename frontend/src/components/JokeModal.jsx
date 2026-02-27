import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios.js";
import useCategories from "../hooks/useCategories.js";

const JokeModal = ({ isOpen, onClose, fetchJokes, editData = null }) => {
    const { categories } = useCategories();
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setContent(editData.content);
            setCategory(editData.category);
            setIsPublic(editData.isPublic);
        } else {
            setContent("");
            setCategory("general");
            setIsPublic(true);
        }
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim().length < 10) return toast.error("Brevity is wit, but a joke needs at least 10 characters!");
        
        setLoading(true);
        const toastId = toast.loading(editData ? "Updating your masterpiece..." : "Spreading the laughter...");

        try {
            const payload = { content, category, isPublic };
            if (editData) {
                await axiosInstance.patch(`/jokes/${editData._id}`, payload);
                toast.success("Punchline updated! ✨", { id: toastId });
            } else {
                await axiosInstance.post("/jokes", payload);
                toast.success("The world is now 1% funnier! 🚀", { id: toastId });
            }
            fetchJokes();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-100 p-4 sm:p-6 transition-all">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {editData ? "Refine Wit" : "Craft Humor"}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">
                                {editData ? "Make your joke even better." : "Share your funniest thoughts."}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                The Punchline
                            </label>
                            <textarea
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none min-h-40 text-slate-700 font-medium leading-relaxed resize-none"
                                placeholder="What's the funny part? Write it here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    Genre
                                </label>
                                <select
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none capitalize font-bold text-slate-600 cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    Privacy
                                </label>
                                <select
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold text-slate-600 cursor-pointer"
                                    value={isPublic}
                                    onChange={(e) => setIsPublic(e.target.value === "true")}
                                >
                                    <option value="true">Go Public 🌍</option>
                                    <option value="false">Stay Private 🔒</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition order-2 sm:order-1"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition disabled:bg-slate-200 order-1 sm:order-2 active:scale-95"
                            >
                                {loading ? "Syncing..." : editData ? "Confirm Update" : "Publish Joke 🚀"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JokeModal;