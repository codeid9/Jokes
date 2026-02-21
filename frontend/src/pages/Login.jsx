import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth  from "../hooks/useAuth.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const [emailorusername, setEmailorusername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user, setUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, loading]);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/users/login", {
                emailorusername,
                password,
            });
            setUser(response.data.data.user);
            toast.success(
                `Welcome back, ${response.data.data.user.username}! ✨`,
            );
        } catch (error) {
            console.error(error);
            toast.error("Login failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
                    Joker App Login 🤡
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email/Username
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={emailorusername}
                            onChange={(e) => setEmailorusername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                    >
                        Login 🚀
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
