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
            toast.error("You have to login first!!");
            return;
        }
        setIsLiked(!isLiked);
        setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);

        try {
            await axiosInstance.post(`/likes/toggle/j/${jokeId}`);
        } catch (error) {
            setIsLiked(isLiked);
            setLikes(initialLikes);
            toast.error("Action failed! ❌");
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                isLiked
                    ? "bg-red-50 text-red-500 border-red-100"
                    : "bg-gray-50 text-gray-500 border-gray-100"
            } border hover:scale-105 active:scale-95`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 transition-transform ${isAnimating ? "animate-ping" : ""}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
            <span className="font-bold text-sm">{likes}</span>
        </button>
    );
};

export default LikeButton;
