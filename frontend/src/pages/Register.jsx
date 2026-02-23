import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading("Registering you... 🕒");

        const data = new FormData(e.target);
        try {
            await axiosInstance.post("/users/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Registration Successful! 🎉", { id: loadingToast });
            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration fail! ❌",
                { id: loadingToast },
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold mb-2 text-center text-indigo-600">
                    Join the Fun! 🤡
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Create your account to start joking.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                        onChange={handleChange}
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition duration-200 shadow-lg disabled:bg-indigo-300"
                    >
                        {loading ? "Registering..." : "Create Account 🚀"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
