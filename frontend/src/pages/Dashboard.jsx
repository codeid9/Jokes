import Layout from "../components/Layout.jsx";
import axiosInstance from "../api/axios.js";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("users/stats");
            setStats(response.data.data.stats);
        } catch (error) {
            console.error("Dashboard sync failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const statCards = [
        {
            label: "Total Content",
            value: stats?.totalJokes,
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600",
            icon: "🃏",
        },
        {
            label: "Total Engagement",
            value: stats?.totalLikes,
            bgColor: "bg-rose-50",
            textColor: "text-rose-600",
            icon: "❤️",
        },
        {
            label: "Private Vault",
            value: stats?.privateJokes,
            bgColor: "bg-amber-50",
            textColor: "text-amber-600",
            icon: "🔒",
        },
        {
            label: "Public Reach",
            value: stats?.publicJokes,
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            icon: "🌍",
        },
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Analytics Overview</h1>
                <p className="text-slate-500 font-medium">Track your performance and audience reach.</p>
            </div>

            {loading ? (
                /* Enhanced Skeleton Loader */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm animate-pulse h-32"
                        >
                            <div className="h-3 w-20 bg-slate-100 rounded-full mb-4"></div>
                            <div className="h-8 w-12 bg-slate-50 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Dynamic Stat Cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className="group bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Decorative Background Shape */}
                            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${card.bgColor} opacity-20 group-hover:scale-150 transition-transform duration-500`} />

                            <div className="relative flex justify-between items-start">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                        {card.label}
                                    </p>
                                    <h3 className={`text-4xl font-black ${card.textColor} tracking-tight`}>
                                        {card.value || 0}
                                    </h3>
                                </div>
                                <div className={`text-3xl p-3 ${card.bgColor} rounded-2xl shadow-inner`}>
                                    {card.icon}
                                </div>
                            </div>
                            
                            {/* Subtle Growth Indicator (UI only) */}
                            <div className="mt-4 flex items-center gap-1">
                                <span className="text-emerald-500 text-xs font-bold">↑ 12%</span>
                                <span className="text-slate-400 text-[10px] font-medium">vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Future: Graphs/Charts Section */}
            <div className="mt-10 p-10 bg-indigo-900 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Ready to go viral? 🚀</h2>
                    <p className="text-indigo-200 max-w-md">Publish more public jokes to increase your engagement and climb the leaderboard.</p>
                </div>
                <div className="absolute -right-5 -bottom-5 text-9xl opacity-10 rotate-12 select-none">🤡</div>
            </div>
        </Layout>
    );
};

export default Dashboard;