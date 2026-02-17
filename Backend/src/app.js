import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);
// imports
import jokeRouter from "./routes/joke.routes.js";
import userRouter from "./routes/user.routes.js";
import likeRouter from "./routes/like.routes.js";
// routes
app.use("/api/v1/jokes", jokeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/likes", likeRouter);
app.use(errorMiddleware);
export default app;
