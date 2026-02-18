import { Router } from "express";

const userRouter = Router();

// import controllers
import { registerUser,loginUser,updateUser,deleteUser, logoutUser, refreshAccessToken,getUserStats } from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// routes define
userRouter.post("/register",registerUser);
userRouter.post("/refresh-token",refreshAccessToken);
userRouter.post("/login",loginUser);
userRouter.get("/stats",verifyJWT,getUserStats);
userRouter.post("/logout",verifyJWT,logoutUser);
userRouter.patch("/update",verifyJWT,updateUser);
userRouter.delete("/delete",verifyJWT,deleteUser);

export default userRouter;