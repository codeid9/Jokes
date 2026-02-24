import { useState, useRef } from "react";
import useAuth from "../hooks/useAuth.js";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import Avatar from "../assets/avatar.svg";
import EditModal from "../components/EditModal.jsx";

const Profile = () => {
    const { user, setUser } = useAuth(); // Getting user data
    const fileInputRef = useRef(null);
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

    // avatar change logic
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
        }
    };

    // user details change logic
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
            toast.error(error.response?.data?.message || "Update failed", {
                id: toastId,
            });
        }
    };

    //  password change logic
    const handlePasswordData = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    const handleChangePassowrd = async (e) => {
        e.preventDefault();
        try {
            const { newPassword, oldPassword, confirmPassword } = passwordData;
            if (!oldPassword) return toast.error("old password is required!");
            if (oldPassword === newPassword)
                return toast.error(
                    "oldpassword shoud be different from old password!",
                );
            if (newPassword.length >= 8 && newPassword !== confirmPassword)
                return toast.error(
                    "new password not matched /password must 8 chars long!",
                );
            const { data } = await axiosInstance.patch(
                "/users/update-pass",
                passwordData,
            );
            if (data.success) toast.success(data.message);
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // delete user account
    const handleDeleteAccount = async () => {
        try {
            const confirmation = confirm(
                "Do You Really Want To Delete Your Account??",
            );
            if (!confirmation) return;
            const toastId = toast.loading("Deleting Your Account...");
            const { data } = await axiosInstance.delete("/users/delete");
            if (data.success) setUser(null);
            toast.success(data.message, { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl">
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

                {/* Fullname Row */}
                <div className="group flex justify-between items-center w-full bg-gray-50 mb-4 p-4 rounded-xl border border-gray-200">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">
                            Full Name
                        </p>
                        <p className="text-gray-800 font-medium">
                            {user.fullname}
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            openEditModal(
                                "fullname",
                                "Full Name",
                                user.fullname,
                            )
                        }
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition"
                    >
                        ✏️{" "}
                        {/* Yahan aap Lucide-react ya FontAwesome icon bhi laga sakte ho */}
                    </button>
                </div>

                {/* Email Row */}
                <div className="group flex justify-between items-center w-full bg-gray-50 mb-4 p-4 rounded-xl border border-gray-200">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">
                            Email Address
                        </p>
                        <p className="text-gray-800 font-medium">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            openEditModal("email", "Email Address", user.email)
                        }
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition"
                    >
                        ✏️
                    </button>
                </div>

                {/* Modal Render */}
                <EditModal
                    isOpen={modalConfig.isOpen}
                    onClose={() =>
                        setModalConfig({ ...modalConfig, isOpen: false })
                    }
                    title={modalConfig.title}
                    value={modalConfig.value}
                    name={modalConfig.field}
                    onSave={handleUpdateProfile}
                />

                {/* password change */}
                <form
                    className="bg-gray-100 p-4 rounded-md space-y-4 flex flex-col items-center"
                    onSubmit={handleChangePassowrd}
                >
                    <input
                        type="password"
                        className="w-full p-2 bg-white rounded border border-gray-300"
                        required
                        value={passwordData.oldPassword}
                        name="oldPassword"
                        onChange={(e) => handlePasswordData(e)}
                        placeholder="Enter old password"
                    />
                    <input
                        type="password"
                        className="w-full p-2 bg-white rounded border border-gray-300"
                        required
                        value={passwordData.newPassword}
                        name="newPassword"
                        onChange={(e) => handlePasswordData(e)}
                        placeholder="Enter new password"
                    />
                    <input
                        type="password"
                        className="w-full p-2 bg-white rounded border border-gray-300"
                        required
                        value={passwordData.confirmPassword}
                        name="confirmPassword"
                        onChange={(e) => handlePasswordData(e)}
                        placeholder="Confirm new password"
                    />
                    <input
                        type="submit"
                        value="Change Password"
                        className="bg-blue-700 px-4 py-2 cursor-pointer self-start text-white rounded "
                    />
                </form>

                {/* dangerzone delete account */}
            </div>
            <div className="bg-red-100 border border-red-200 text-center rounded-2xl my-8 p-4 shadow-xl">
                <h1 className="text-red-500 font-bold text-xl">Danger Zone</h1>
                <button
                    onClick={handleDeleteAccount}
                    className="mt-4 py-2 px-4 text-red-600 hover:text-white cursor-pointer transition active:scale-95  border border-red-600 hover:bg-red-600 rounded"
                >
                    Delete Your Account!
                </button>
            </div>
        </Layout>
    );
};

export default Profile;
