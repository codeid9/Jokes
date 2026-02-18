import Joke from "../models/joke.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Joke.distinct("category"); 
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched!"));
});

export {getAllCategories};