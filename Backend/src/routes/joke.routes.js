import { Router } from "express";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const jokeRouter = Router();
// controllers import
import {
    createJoke,
    deleteJokeById,
    getPublicJokes,
    getRandomJoke,
    myJokes,
    updateJokeById,
} from "../controllers/joke.controllers.js";
// routes  define
jokeRouter.get("/public",optionalVerifyJWT , getPublicJokes);
jokeRouter.get("/random", getRandomJoke);
jokeRouter.get("/my-jokes", verifyJWT, myJokes);
jokeRouter.post("/", verifyJWT, createJoke);
jokeRouter.patch("/:id", verifyJWT, updateJokeById);
jokeRouter.delete("/:id", verifyJWT, deleteJokeById);

export default jokeRouter;
