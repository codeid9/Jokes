import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="py-12 md:py-24 px-6 text-center bg-linear-to-b from-slate-50 to-white">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Laughter is <span className="text-indigo-600">Universal.</span>{" "}
                    <br className="hidden sm:block" /> Share the Joy.
                </h1>
                <p className="text-base md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto px-2 leading-relaxed">
                    Join the world's most hilarious community. Discover trending humor, 
                    share your wit, and connect with people through the power of a great joke.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                    <Link
                        to="/explore"
                        className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1 text-center"
                    >
                        Start Exploring 🃏
                    </Link>
                    <Link
                        to="/register"
                        className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-200 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition text-center"
                    >
                        Become a Creator
                    </Link>
                </div>
            </section>

            {/* Feature Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Feature 1 */}
                <div className="group bg-white p-10 rounded-4xl shadow-sm border border-slate-100 text-center hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300 transform inline-block">✍️</div>
                    <h3 className="font-bold text-2xl mb-3 text-slate-900">Craft Humor</h3>
                    <p className="text-slate-500 leading-relaxed text-lg">
                        Unleash your creativity and publish jokes that resonate with the world.
                    </p>
                </div>
                
                {/* Feature 2 */}
                <div className="group bg-white p-10 rounded-4xl shadow-sm border border-slate-100 text-center hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300 transform inline-block">⚡</div>
                    <h3 className="font-bold text-2xl mb-3 text-slate-900">Engage & Vibe</h3>
                    <p className="text-slate-500 leading-relaxed text-lg">
                        React to the funniest content and spread the laughter across social circles.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="group bg-white p-10 rounded-4xl shadow-sm border border-slate-100 text-center hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300 transform inline-block">📈</div>
                    <h3 className="font-bold text-2xl mb-3 text-slate-900">Go Viral</h3>
                    <p className="text-slate-500 leading-relaxed text-lg">
                        Rise through the ranks and become a top-tier humorist in our global community.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;