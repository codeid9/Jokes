import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading("Creating your humor profile... 🚀");

        const data = new FormData(e.target);
        try {
            await axiosInstance.post("/users/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Welcome to the elite club of humorists! 🎉", { id: loadingToast });
            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration encountered a glitch! ❌",
                { id: loadingToast },
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-16 px-4">
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/60 w-full max-w-lg border border-slate-100">
                
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black mb-3 text-slate-900 tracking-tight">
                        Start <span className="text-indigo-600">Laughing.</span>
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Join thousands of creators sharing wit worldwide.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Avatar Upload with Preview */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-slate-100">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-all border-2 border-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <input name="avatar" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-3">Upload Avatar</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-700 ml-1">Full Name</label>
                            <input
                                name="fullname"
                                type="text"
                                placeholder="John Doe"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-700 ml-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="johndoe_123"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-700 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="hello@example.com"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-700 ml-1">Secret Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 mt-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
                            loading 
                            ? "bg-slate-200 text-slate-400" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.98]"
                        }`}
                    >
                        {loading ? "Creating Profile..." : "Get Started 🚀"}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                    Already a member?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-black hover:underline underline-offset-4 transition-all"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;