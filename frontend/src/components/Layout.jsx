import { Link, useNavigate } from "react-router-dom";
import Avatar from "../assets/avatar.svg";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axios.js";

const Layout = ({ children }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-700 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-indigo-500">
                    Joker App 🤡
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className="block p-3 hover:bg-indigo-600 rounded"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/my-jokes"
                        className="block p-3 hover:bg-indigo-600 rounded"
                    >
                        My Jokes
                    </Link>
                    <Link
                        to="/profile"
                        className="block p-3 hover:bg-indigo-600 rounded"
                    >
                        Profile Settings
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="p-4 bg-indigo-800 hover:bg-red-600 transition-colors text-left font-semibold"
                >
                    Logout 🚪
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Welcome, {user?.username}
                    </h2>
                    <img
                        src={user?.avatar || Avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-sm"
                    />
                </header>

                {/* Page Content */}
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
