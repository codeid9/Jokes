import { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, title, value, onSave, name }) => {
    // State to handle input locally
    const [inputValue, setInputValue] = useState(value);

    // Sync state when modal opens with a new value
    useEffect(() => {
        setInputValue(value);
    }, [value, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-100">
                
                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">📝</div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Update {title}</h2>
                    <p className="text-slate-500 text-sm font-medium">Refine your profile information.</p>
                </div>
                
                <div className="space-y-1 mb-8">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                        New {title}
                    </label>
                    <input
                        autoFocus
                        type={name === "email" ? "email" : "text"}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter your ${title.toLowerCase()}...`}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-6 py-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all order-2 sm:order-1"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => onSave(inputValue)}
                        className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 order-1 sm:order-2"
                    >
                        Save Sync 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;