import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "../assets/avatar.svg";
import useAuth from "../hooks/useAuth.js";
import axiosInstance from "../api/axios.js";

const Layout = ({ children }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const sidebarLinks = [
        { route: "/", label: "Public Feed", icon: "🌐" },
        { route: "/dashboard", label: "Analytics", icon: "📊" },
        { route: "/dashboard/jokes", label: "My Library", icon: "🃏" },
        { route: "/dashboard/profile", label: "Settings", icon: "⚙️" },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-indigo-700 text-white transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                flex flex-col shadow-2xl md:shadow-none
            `}>
                <div className="p-8 text-2xl font-black border-b border-indigo-600/50 flex justify-between items-center">
                    <span className="tracking-tighter">Creator Studio</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-indigo-200">✕</button>
                </div>
                
                <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                    {sidebarLinks.map(({ route, label, icon }, index) => {
                        const isActive = location.pathname === route;
                        return (
                            <Link
                                to={route}
                                key={index}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 font-bold ${
                                    isActive 
                                    ? "bg-white text-indigo-700 shadow-lg shadow-indigo-900/20" 
                                    : "hover:bg-indigo-600/50 text-indigo-100"
                                }`}
                            >
                                <span className="text-xl">{icon}</span>
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-3 p-4 bg-indigo-800/50 hover:bg-rose-600 rounded-2xl transition-all duration-300 font-bold border border-indigo-500/30"
                    >
                        <span>Sign Out</span>
                        <span>🚪</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex justify-between items-center px-6 md:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-slate-100 rounded-xl md:hidden text-slate-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <h2 className="hidden sm:block text-xl font-bold text-slate-800">
                            Hello, <span className="text-indigo-600">{user?.username}</span> 👋
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden xs:block">
                            <p className="text-sm font-bold text-slate-900">{user?.fullname}</p>
                            <p className="text-xs text-slate-500 font-medium capitalize">{user?.role || "Creator"}</p>
                        </div>
                        <img
                            src={user?.avatar || Avatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200"
                        />
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-10 overflow-y-auto bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;