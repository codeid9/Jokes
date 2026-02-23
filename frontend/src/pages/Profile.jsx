import { useState, useRef } from "react";
import useAuth from "../hooks/useAuth.js";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import Avatar from "../assets/avatar.svg";

const Profile = () => {
    const { user, setUser } = useAuth(); // Getting user data
    const fileInputRef = useRef(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("File should be less than 2MB!");
        }

        const formData = new FormData();
        formData.append("avatar", file);

        const toastId = toast.loading("Avatar is updating...");

        try {
            const { data } = await axiosInstance.patch(
                "/users/avatar",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setUser({ ...user, avatar: data.data.avatar });
            toast.success("Avatar Updated ✨", { id: toastId });
        } catch (error) {
            toast.error("Upload fail!", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    My Profile 👤
                </h1>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <img
                            src={user?.avatar || Avatar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 group-hover:opacity-80 transition"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                                Change
                            </span>
                        </div>
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/jpg, image/png, image/jpeg"
                        />
                    </div>
                    <p className="mt-4 font-bold text-xl">@{user?.username}</p>
                    <p className="text-gray-500">{user?.email}</p>
                </div>

                {/* Rest Details (Name change etc.) */}
                <form className="space-y-4">
                    {/* Inputs for Fullname, etc. */}
                </form>
            </div>
        </Layout>
    );
};

export default Profile;
