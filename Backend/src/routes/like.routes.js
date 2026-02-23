import { Router } from "express";
import toggleJokeLike from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.post("/toggle/j/:jokeId", toggleJokeLike);

export default likeRouter;
