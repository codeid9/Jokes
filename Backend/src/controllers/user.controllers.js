import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.modes.js";
import Joke from "../models/joke.models.js";
import Like from "../models/like.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { isValidEmail, isValidPassword } from "../utils/validators.js";
import { getPaginationData } from "../utils/pagination.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };
    } catch (error) {
        console.error("Error while generating tokens!!", error);
    }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "You don't have refresh token!");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token: User not found");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token has expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Token refreshed!",
                ),
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    if (
        [username, fullname, email, password].some(
            (field) => !field || field.trim() === "",
        )
    ) {
        throw new ApiError(400, "All fields are required!");
    }
    if (!isValidEmail(email)) throw new ApiError(400, "Invalid Email Format!");
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!isValidPassword(password))
        throw new ApiError(
            400,
            "Password must be greater than or equal to 8 characters long.",
        );

    if (existedUser) {
        throw new ApiError(409, "User already exist.");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    );
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering user!!",
        );
    }
    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully."),
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing.");
    }

    const user = await User.findById(req.user?._id);
    const oldAvatarUrl = user?.avatar;

    if (oldAvatarUrl) {
        try {
            const publicId = oldAvatarUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.log(error);
        }
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on Cloudinary");
    }

    const updateduser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true },
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, updateduser, "Avatar updated"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { emailorusername, password } = req.body;
    if (!emailorusername || !password) {
        throw new ApiError(400, "Credentials are required!!");
    }
    const user = await User.findOne({
        $or: [{ username: emailorusername }, { email: emailorusername }],
    });
    if (!user) {
        throw new ApiError(404, "User not registered");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials!!");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
        user._id,
    );
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User loggedin successfully.",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const loggedOutUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true },
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                loggedOutUser,
                "User logged out successfully.",
            ),
        );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const { pageNumber, limitNumber, skip } = getPaginationData(
        req.query.page,
        req.query.limit,
    );
    const totalUsers = await User.countDocuments();
    const users = await User.find()
        .select("username fullname avatar")
        .limit(limitNumber)
        .skip(skip);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                totalUsers,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalUsers / limitNumber),
            },
            "Creators fetched!",
        ),
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { email, fullname } = req.body;
    if (!fullname && !email) {
        throw new ApiError(400, "Change atleast one field!!");
    }
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) {
        if (!isValidEmail(email))
            throw new ApiError(400, "Invalid Email Format!");
        updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData,
        },
        { new: true },
    ).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found! update failed.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Profile update."));
});

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword)
        throw new ApiError(404, "All fields are required!");
    if (oldPassword === newPassword)
        throw new ApiError(
            400,
            "new password should be diffrent from old password!",
        );
    console.log(oldPassword, newPassword);
    if (newPassword !== confirmPassword)
        throw new ApiError(
            400,
            "confirm password doesn't match with new password",
        );

    if (!isValidPassword(newPassword))
        throw new ApiError(
            400,
            "Password must be greater than or equal to 8 characters long.",
        );

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect)
        throw new ApiError(400, "Old password is incorrect!");
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Updated successfully."));
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not fount!");
    await Joke.deleteMany({ author: userId });
    await Like.deleteMany({ likedBy: userId });
    await User.findByIdAndDelete(userId);

    const oldAvatarUrl = user.avatar;
    if (oldAvatarUrl) {
        try {
            const publicId = oldAvatarUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.log(error);
        }
    }

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Account & all data deleted successfully.",
            ),
        );
});

const getUserStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const stats = await Joke.aggregate([
        {
            $match: {
                author: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "joke",
                as: "allLikes",
            },
        },
        {
            $group: {
                _id: null,
                totalJokes: { $sum: 1 },
                totalLikes: { $sum: { $size: "$allLikes" } },
                publicJokes: {
                    $sum: { $cond: ["$isPublic", 1, 0] },
                },
                privateJokes: {
                    $sum: { $cond: ["$isPublic", 0, 1] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalJokes: 1,
                totalLikes: 1,
                publicJokes: 1,
                privateJokes: 1,
            },
        },
    ]);

    const finalStats =
        stats.length > 0
            ? stats[0]
            : {
                  totalJokes: 0,
                  totalLikes: 0,
                  publicJokes: 0,
                  privateJokes: 0,
              };

    const userSummary = {
        username: req.user.username,
        fullname: req.user.fullname,
        avatar: req.user.avatar,
    };
    res.status(200).json(
        new ApiResponse(
            200,
            { stats: finalStats, userSummary },
            "User Stats fetched.",
        ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully!",
            ),
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    updatePassword,
    deleteUser,
    refreshAccessToken,
    getUserStats,
    getAllUsers,
    getCurrentUser,
    updateUserAvatar,
};
