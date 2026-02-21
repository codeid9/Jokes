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
            console.error("dashboard data failed to fetch!!!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const statCards = [
        {
            label: "Total Jokes",
            value: stats?.totalJokes,
            color: "border-indigo-500",
            icon: "🃏",
        },
        {
            label: "Total Likes",
            value: stats?.totalLikes,
            color: "border-red-500",
            icon: "❤️",
        },
        {
            label: "Private Jokes",
            value: stats?.privateJokes,
            color: "border-amber-500",
            icon: "🔒",
        },
        {
            label: "Public Jokes",
            value: stats?.publicJokes,
            color: "border-sky-500",
            icon: "🌍",
        },
    ];

    return (
        <Layout>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-xl shadow-xs h-24 `}
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-xl shadow-xs border-l-6 ${card.color} hover:shadow-md transition-shadow`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                        {card.label}
                                    </p>
                                    <h3 className="text-3xl font-extrabold text-gray-800">
                                        {card.value || 0}
                                    </h3>
                                </div>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
