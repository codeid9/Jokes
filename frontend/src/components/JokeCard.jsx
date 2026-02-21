function JokeCard({ content, category, author, likesCount }) {
    return (
        <div>
            <div className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                        {category}
                    </span>
                    <p className="text-gray-800 text-lg mt-4 leading-relaxed font-medium">
                        {content}
                    </p>
                </div>
                <div className="mt-6 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>By @{author}</span>
                    <button className="hover:text-red-500 transition">
                        <span className="cursor-pointer text-2xl text-shadow-xs text-shadow-slate-700">
                            ❤️
                        </span>{" "}
                        {likesCount || 0}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JokeCard;
