import jwt from "jsonwebtoken";
import User from "../models/user.modes.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized request!" });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken",
        );
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid access token" });
        }
        req.user = user;
        next();
    } catch (error) {
        const statusCode = error.name === "TokenExpiredError" ? 401 : 401;
        const message =
            error.name === "TokenExpiredError"
                ? "Access Token Expired"
                : "Invalid Token";

        next(new ApiError(statusCode, message));
    }
};

const optionalVerifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken",
        );

        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        next();
    }
};

export { verifyJWT, optionalVerifyJWT };
