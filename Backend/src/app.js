import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:"Rate Limit Expired!",
    standardHeaders:true,
    legacyHeaders:false
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.static("public"));
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
import categoryRouter from "./routes/category.routes.js";

// routes
app.use("/api/",limiter)
app.use("/api/v1/jokes", jokeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/categories", categoryRouter);
app.use(errorMiddleware);
export default app;
