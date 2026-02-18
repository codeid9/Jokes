import { Router } from "express";

const categoryRouter = Router();

import { getAllCategories } from "../controllers/category.controllers.js";
categoryRouter.get("/", getAllCategories);

export default categoryRouter;
