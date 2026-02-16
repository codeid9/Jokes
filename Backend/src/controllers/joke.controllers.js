import Joke from "../models/joke.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// add a joke into database
const createJoke = asyncHandler(async (req, res) => {
    const { joke } = req.body;
    if (!joke || joke.trim() === "") {
        throw new ApiError(400, "All Fields are required!!");
    }
    const newjoke = await Joke.create({
        content: joke.trim(),
        author: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newjoke, "Joke created successfully."));
});

const getAllJokes = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const jokes = await Joke.find({ author: userId });
    if (jokes.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, jokes, "Jokes not created yet."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, jokes, "Jokes fetched successfully."));
});

// update joke by id
const updateJokeById = asyncHandler(async (req, res) => {});

// delete by id
const deleteJokeById = asyncHandler(async (req, res) => {});

export { createJoke, getAllJokes, updateJokeById, deleteJokeById };
