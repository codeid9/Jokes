import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios.js";
import useCategories from "../hooks/useCategories.js";

const JokeModal = ({ isOpen, onClose, fetchJokes, editData = null }) => {
    const { categories } = useCategories();
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("funny");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    // Agar editData aaya hai (matlab Edit mode hai), toh values set kar do
    useEffect(() => {
        if (editData) {
            setContent(editData.content);
            setCategory(editData.category);
            setIsPublic(editData.isPublic);
        } else {
            setContent("");
            setCategory("funny");
            setIsPublic(true);
        }
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading(
            editData ? "Updating joke..." : "Creating joke...",
        );

        try {
            if (editData) {
                // Update Logic
                await axiosInstance.patch(`/jokes/${editData._id}`, {
                    content,
                    category,
                    isPublic,
                });
                toast.success("Joke updated! ✨", { id: toastId });
                console.log("edit");
            } else {
                // Create Logic
                const res = await axiosInstance.post("/jokes", {
                    content,
                    category,
                    isPublic,
                });
                console.log(res);
                toast.success("Joke added! 🚀", { id: toastId });
            }
            fetchJokes(); //fetch jokes
            onClose(); //close modal
        } catch (error) {
            toast.error(
                error.response.data.message || "Something went wrong! ❌",
                { id: toastId },
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {editData ? "Edit Your Joke ✏️" : "Share a New Joke 🤡"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Joke Content
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-30"
                                placeholder="Write something funny..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none capitalize"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >
                                    {categories.length &&
                                        categories.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Visibility
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={isPublic}
                                    onChange={(e) =>
                                        setIsPublic(e.target.value === "true")
                                    }
                                >
                                    <option value="true">Public 🌍</option>
                                    <option value="false">Private 🔒</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-indigo-300"
                            >
                                {loading
                                    ? "Saving..."
                                    : editData
                                      ? "Update"
                                      : "Post Joke"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JokeModal;
