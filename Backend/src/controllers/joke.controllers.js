import Joke from "../models/joke.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

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
// fetch all jokes
const getAllJokes = asyncHandler(async (req, res) => {
    const jokes = await Joke.find({ isPublic: true });
    return res
        .status(200)
        .json(new ApiResponse(200, jokes, "Jokes Fetched successfully."));
});
// get logged in user's jokes
const myJokes = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const jokes = await Joke.find({ author: userId });

    return res
        .status(200)
        .json(new ApiResponse(200, jokes, "Jokes fetched successfully."));
});
// update joke by id
const updateJokeById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {content,category,isPublic} = req.body;
    if(!content && !category && typeof isPublic === undefined){
        throw new ApiError(400,"give atleast one field to update!!");
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid ID");
    }
    const joke = await Joke.findById(id);
    if(!joke){
        throw new ApiError(404,"Joke not found");
    }
    if(joke.author.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Invalid Author");
    }
    if(content) joke.content = content;
    if(category) joke.category = category;
    if(typeof isPublic !== undefined) joke.isPublic = isPublic;

    const updatedJoke = await joke.save();
    return res.status(200).json(new ApiResponse(200,updatedJoke,"Joke updated successfully."))
});

// delete by id
const deleteJokeById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid jokeId!!");
    }
    const joke = await Joke.findById(id);
    if(!joke){
        throw new ApiError(404,"Joke Not Found");
    }
    if(joke.author.toString() !== req.user._id.toString()){
        throw new ApiError(400,"Invalid author!");
    }
    const result = await Joke.deleteOne({_id:id});
    if(result.deletedCount === 0){
        throw new ApiError(500,"Something went wrong! While deleting Joke.");
    }
    return res.status(200).json(new ApiResponse(200,{},"Joke deleted successfully."));
});

export { createJoke, getAllJokes, myJokes, updateJokeById, deleteJokeById };
