import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";


const jokeRouter = Router();
// controllers import 
import { createJoke,deleteJokeById,getAllJokes,getRandomJoke,myJokes, updateJokeById} from "../controllers/joke.controllers.js";
// routes  define
jokeRouter.get("/public",getAllJokes);
jokeRouter.get("/random",getRandomJoke);
jokeRouter.get("/my-jokes",verifyJWT,myJokes);
jokeRouter.post("/",verifyJWT,createJoke);
jokeRouter.put("/:id",verifyJWT,updateJokeById);
jokeRouter.delete("/:id",verifyJWT,deleteJokeById);

export default jokeRouter;