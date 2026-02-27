import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Avatar from "../assets/avatar.svg";

const Navbar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-black text-indigo-600 flex items-center tracking-tighter"
                    >
                        <span className="mr-2 text-3xl">🤡</span> JokerApp
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10 text-slate-600 font-semibold text-sm uppercase tracking-wide">
                        <Link to="/" className="hover:text-indigo-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/explore" className="hover:text-indigo-600 transition-colors">
                            Explore
                        </Link>

                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center space-x-3 bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-100 transition-all"
                            >
                                <img
                                    src={user.avatar || Avatar}
                                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-100"
                                    alt="profile"
                                />
                                <span className="text-slate-700">Studio</span>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link to="/login" className="hover:text-indigo-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2"
                        >
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} bg-white border-b border-slate-100`}>
                <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-indigo-50 rounded-xl">Home</Link>
                    <Link to="/explore" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-indigo-50 rounded-xl">Explore</Link>
                    
                    <hr className="border-slate-100 my-2" />
                    
                    {user ? (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 bg-indigo-50 rounded-xl text-indigo-700 font-bold">
                            <img src={user.avatar || Avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="profile" />
                            <span>My Studio</span>
                        </Link>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl">Sign In</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-3 font-bold bg-indigo-600 text-white rounded-xl shadow-md">Join Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;