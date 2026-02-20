import Layout from "../components/Layout.jsx";

const Dashboard = () => {
    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
                    <p className="text-gray-500 text-sm uppercase">
                        Total Jokes
                    </p>
                    <h3 className="text-3xl font-bold">12</h3>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
