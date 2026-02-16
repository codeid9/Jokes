import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";


const jokeRouter = Router();
// controllers import 
import { createJoke,getAllJokes} from "../controllers/joke.controllers.js";
// routes  define
jokeRouter.post("/",verifyJWT,createJoke);
jokeRouter.get("/",verifyJWT,getAllJokes);

export default jokeRouter;