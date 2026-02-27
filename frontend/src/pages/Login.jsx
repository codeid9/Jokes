import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import toast from "react-hot-toast";

const Login = () => {
    const [emailorusername, setEmailorusername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // New: Loading state
    const navigate = useNavigate();
    const { user, setUser, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post("/users/login", {
                emailorusername,
                password,
            });
            setUser(response.data.data.user);
            toast.success(`Welcome back, ${response.data.data.user.username}! ✨`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid credentials!";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/60 w-full max-w-md border border-slate-100">
                
                {/* Branding Header */}
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">🤡</div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Welcome <span className="text-indigo-600">Back</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">
                        The world missed your humor.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 text-xs font-black uppercase tracking-widest mb-2 ml-1">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your handle..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            value={emailorusername}
                            onChange={(e) => setEmailorusername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="text-slate-700 text-xs font-black uppercase tracking-widest">
                                Password
                            </label>
                            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg ${
                            isSubmitting 
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]"
                        }`}
                    >
                        {isSubmitting ? "Authenticating..." : "Sign In 🚀"}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-500 font-medium text-sm">
                        New to the club?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-600 font-black hover:underline underline-offset-4"
                        >
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;