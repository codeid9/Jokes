import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Avatar from "../assets/avatar.svg";

const Navbar = () => {
    const { user } = useAuth();
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-indigo-600 flex items-center"
                    >
                        <span className="mr-2">🤡</span> JokerApp
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
                        <Link to="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                        <Link to="/explore" className="hover:text-indigo-600">
                            Explore Jokes
                        </Link>

                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100"
                            >
                                <img
                                    src={user.avatar || Avatar}
                                    className="w-8 h-8 rounded-full"
                                    alt="avatar"
                                />
                                <span className="text-indigo-700">
                                    My Dashboard
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="hover:text-indigo-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
