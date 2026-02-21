import Joke from "../models/joke.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllCategories = asyncHandler(async (req, res) => {
    const enumValues = Joke.schema.path("category").enumValues;
    return res.status(200).json(new ApiResponse(200, enumValues, "Categories fetched!"));
});

export {getAllCategories};