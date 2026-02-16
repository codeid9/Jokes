import { Router } from "express";

const userRouter = Router();

// import controllers
import { registerUser,loginUser,updateUser,deleteUser, logoutUser } from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// routes define
userRouter.post("/",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/logout",verifyJWT,logoutUser);

export default userRouter;