import LikeButton from "./LikeButton.jsx";
import Avatar from "../assets/avatar.svg"; // Fallback image
import useAuth from "../hooks/useAuth.js";

function JokeCard({ jokeId, content, category, author, likesCount, isLiked }) {
    const {user} = useAuth();
    return (
        <div className="group h-full">
            <div className="bg-white p-5 sm:p-8 rounded-4xl shadow-sm hover:shadow-xl hover:shadow-indigo-50/80 transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-indigo-100">
                
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-full border border-indigo-100/50">
                            {category || "Classic"}
                        </span>
                        <span className="text-2xl opacity-10 group-hover:opacity-30 transition-opacity">"</span>
                    </div>

                    <p className="text-slate-800 text-lg sm:text-xl mt-5 leading-[1.6] font-semibold tracking-tight">
                        {content}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/* ⬇️ Yahan Image aur Fallback ka logic hai */}
                        <div className="relative">
                            {user?.avatar ? (
                                <img 
                                    src={user?.avatar || Avatar} 
                                    alt={author}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-indigo-100">
                                    {author?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">Curated By</span>
                            <span className="text-sm font-bold text-slate-700 leading-none hover:text-indigo-600 cursor-pointer transition-colors">
                                @{author}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-2xl group-hover:bg-indigo-50/50 transition-colors">
                        <LikeButton
                            jokeId={jokeId}
                            initialLikes={likesCount}
                            initialIsLiked={isLiked}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JokeCard;