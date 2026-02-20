import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
        } catch (error) {
            alert(error.response?.data?.message || "Login fail ho gaya! ❌");
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
            </div>
        </div>
    );
};

export default Login;
