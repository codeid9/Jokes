import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-4 text-center bg-linear-to-b from-indigo-50 to-white">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Duniya ko <span className="text-indigo-600">Hasao</span>,{" "}
                    <br /> Ek Joke se!
                </h1>
                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                    Sabse badhiya jokes padho, share karo aur apne doston ke
                    saath maze lo. Hamara platform dedicated hai sirf asli humor
                    ke liye.
                </p>

                <div className="flex justify-center space-x-4">
                    <Link
                        to="/explore"
                        className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
                    >
                        Explore Jokes 🃏
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white text-gray-800 border border-gray-300 px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition"
                    >
                        Join the Community
                    </Link>
                </div>
            </section>

            {/* Feature Section */}
            <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center">
                    <div className="text-4xl mb-4">✍️</div>
                    <h3 className="font-bold text-xl mb-2">Write Jokes</h3>
                    <p className="text-gray-500">
                        Apni creativity dikhao aur mast jokes likho.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center">
                    <div className="text-4xl mb-4">❤️</div>
                    <h3 className="font-bold text-xl mb-2">Like & Share</h3>
                    <p className="text-gray-500">
                        Jo pasand aaye use like karo aur doston ko bhejo.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="font-bold text-xl mb-2">Get Famous</h3>
                    <p className="text-gray-500">
                        Top creators ki list mein apna naam lao.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
