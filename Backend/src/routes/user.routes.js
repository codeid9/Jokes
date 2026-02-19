import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();
// import controllers
import {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    logoutUser,
    refreshAccessToken,
    getUserStats,
    getAllUsers,
    updatePassword,
} from "../controllers/user.controllers.js";

// routes define
userRouter.get("/", getAllUsers);
userRouter.post("/register", registerUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/login", loginUser);
userRouter.get("/stats", verifyJWT, getUserStats);
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.patch("/update", verifyJWT, updateUser);
userRouter.patch("/update-pass", verifyJWT, updatePassword);
userRouter.delete("/delete", verifyJWT, deleteUser);

export default userRouter;
