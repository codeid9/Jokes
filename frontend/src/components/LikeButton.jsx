import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

const LikeButton = ({ jokeId, initialLikes, initialIsLiked }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isAnimating, setIsAnimating] = useState(false);
    const { user } = useAuth();

    const handleLike = async () => {
        if (!user) {
            toast.error("Authenticating required to spread love! 🔐");
            return;
        }

        // Optimistic UI Update
        const previousLiked = isLiked;
        const previousLikesCount = likes;

        setIsLiked(!isLiked);
        setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
        
        // Trigger Animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);

        try {
            await axiosInstance.post(`/likes/toggle/j/${jokeId}`);
        } catch (error) {
            // Rollback on error
            setIsLiked(previousLiked);
            setLikes(previousLikesCount);
            toast.error("Sync failed! Action reverted. ❌");
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`group flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-500 select-none outline-none ${
                isLiked
                    ? "bg-rose-50 text-rose-600 border-rose-100 shadow-sm"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600"
            } border-2 active:scale-90`}
        >
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 transition-all duration-300 ${
                        isLiked ? "scale-110" : "scale-100"
                    } ${isAnimating ? "animate-bounce" : ""}`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                </svg>
                
                {/* Floating Hearts Effect (Pro Touch) */}
                {isAnimating && isLiked && (
                    <span className="absolute -top-4 left-0 animate-ping text-[10px] opacity-75">❤️</span>
                )}
            </div>

            <span className={`font-black text-sm tabular-nums ${isLiked ? "text-rose-600" : "text-slate-500"}`}>
                {likes.toLocaleString()}
            </span>
        </button>
    );
};

export default LikeButton;