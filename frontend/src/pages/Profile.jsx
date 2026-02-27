import { useState, useRef } from "react";
import useAuth from "../hooks/useAuth.js";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import Avatar from "../assets/avatar.svg";
import EditModal from "../components/EditModal.jsx";

const Profile = () => {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef(null);
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        field: "",
        title: "",
        value: "",
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("File size must be under 2MB!");
        }

        const formData = new FormData();
        formData.append("avatar", file);

        const toastId = toast.loading("Syncing new avatar...");

        try {
            const { data } = await axiosInstance.patch(
                "/users/avatar",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setUser({ ...user, avatar: data.data.avatar });
            toast.success("Identity refreshed! ✨", { id: toastId });
        } catch (error) {
            toast.error("Upload failed", { id: toastId });
        }
    };

    const openEditModal = (field, title, value) => {
        setModalConfig({ isOpen: true, field, title, value });
    };

    const handleUpdateProfile = async (newValue) => {
        const toastId = toast.loading(`Updating ${modalConfig.title}...`);
        try {
            const { data } = await axiosInstance.patch("/users/update", {
                [modalConfig.field]: newValue,
            });
            setUser(data.data.user);
            toast.success(`${modalConfig.title} updated!`, { id: toastId });
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed", { id: toastId });
        }
    };

    const handlePasswordData = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleChangePassowrd = async (e) => {
        e.preventDefault();
        setIsUpdatingPass(true);
        try {
            const { newPassword, oldPassword, confirmPassword } = passwordData;
            if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
            if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

            const { data } = await axiosInstance.patch("/users/update-pass", passwordData);
            if (data.success) toast.success("Security credentials updated!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Password update failed");
        } finally {
            setIsUpdatingPass(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = confirm("CRITICAL: Are you sure you want to permanently delete your account?");
        if (!confirmation) return;

        const toastId = toast.loading("Purging account data...");
        try {
            const { data } = await axiosInstance.delete("/users/delete");
            if (data.success) setUser(null);
            toast.success("Account deleted successfully.", { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profile Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and security.</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center sm:flex-row sm:gap-8 mb-12 border-b border-slate-50 pb-12">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <img
                                src={user?.avatar || Avatar}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-1 ring-slate-100 group-hover:brightness-75 transition duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Change</span>
                            </div>
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" />
                        </div>
                        <div className="text-center sm:text-left mt-6 sm:mt-0">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">@{user?.username}</h2>
                            <p className="text-indigo-500 font-bold text-sm tracking-wide">{user?.email}</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium italic">Click photo to update avatar (Max 2MB)</p>
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="grid gap-4 mb-12">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Personal Info</h3>
                        {[
                            { label: "Full Name", value: user.fullname, field: "fullname" },
                            { label: "Email Address", value: user.email, field: "email" }
                        ].map((item, i) => (
                            <div key={i} className="group flex justify-between items-center bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all duration-300">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{item.label}</p>
                                    <p className="text-slate-800 font-bold">{item.value}</p>
                                </div>
                                <button
                                    onClick={() => openEditModal(item.field, item.label, item.value)}
                                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                                >
                                    ✏️
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Security Credentials</h3>
                        <form onSubmit={handleChangePassowrd} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input
                                type="password"
                                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                                required
                                value={passwordData.oldPassword}
                                name="oldPassword"
                                onChange={handlePasswordData}
                                placeholder="Current Password"
                            />
                            <input
                                type="password"
                                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                                required
                                value={passwordData.newPassword}
                                name="newPassword"
                                onChange={handlePasswordData}
                                placeholder="New Password"
                            />
                            <input
                                type="password"
                                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                                required
                                value={passwordData.confirmPassword}
                                name="confirmPassword"
                                onChange={handlePasswordData}
                                placeholder="Confirm New"
                            />
                            <button
                                type="submit"
                                disabled={isUpdatingPass}
                                className="sm:col-span-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition disabled:bg-slate-200"
                            >
                                {isUpdatingPass ? "Updating Security..." : "Apply New Password 🔒"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-4xl p-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <div>
                        <h4 className="text-rose-600 font-black uppercase tracking-widest text-xs mb-1">Danger Zone</h4>
                        <p className="text-slate-500 text-sm font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="py-3 px-6 text-rose-600 font-bold border-2 border-rose-200 hover:bg-rose-600 hover:text-white rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                        Delete My Account
                    </button>
                </div>

                <EditModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    title={modalConfig.title}
                    value={modalConfig.value}
                    name={modalConfig.field}
                    onSave={handleUpdateProfile}
                />
            </div>
        </Layout>
    );
};

export default Profile;