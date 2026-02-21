import Joke from "../models/joke.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { getPaginationData } from "../utils/pagination.js";
import User from "../models/user.modes.js";

// add a joke into database
const createJoke = asyncHandler(async (req, res) => {
    const { content, category, isPublic } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "joke is required!!");
    }
    if (content.length <= 10)
        throw new ApiError(400, "Joke Must be greater than 10 chars long");

    let joke = {
        content: content.trim(),
        isPublic: isPublic,
        author: req.user._id,
    };
    if (category) {
        joke.category = category;
    }
    const newjoke = await Joke.create(joke);

    return res
        .status(201)
        .json(new ApiResponse(201, newjoke, "Joke created successfully."));
});
// fetch all jokes
const getPublicJokes = asyncHandler(async (req, res) => {
    const { user, category, page, limit } = req.query;
    const { limitNumber, pageNumber, skip } = getPaginationData(page, limit);
    let filter = { isPublic: true };
    if (category) {
        filter.category = category;
    }
    if (user) {
        const userId = await User.findOne({ username: user });
        filter.author = userId;
    }
    const totalJokes = await Joke.countDocuments(filter);

    const jokes = await Joke.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate("author", "username fullname");
    if (!jokes.length) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    jokes,
                    totalJokes,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalJokes / limitNumber),
                },
                "Joke not created yet",
            ),
        );
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jokes,
                totalJokes,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalJokes / limitNumber),
            },
            "Public jokes fetched successfully.",
        ),
    );
});
// get a random joke
const getRandomJoke = asyncHandler(async (req, res) => {
    const joke = await Joke.aggregate([
        {
            $match: {
                isPublic: true,
            },
        },
        {
            $sample: { size: 1 },
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
            },
        },
        {
            $unwind: "$authorDetails",
        },
        {
            $project: {
                content: 1,
                category: 1,
                "authorDetails.username": 1,
                "authorDetails.fullname": 1,
            },
        },
    ]);

    if (!joke.length) {
        throw new ApiError(404, "Joke not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, joke[0], "Random a joke fetched successfully"),
        );
});

// get logged in user's jokes
const myJokes = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { category, isPublic, page, limit } = req.query;
    const { pageNumber, limitNumber, skip } = getPaginationData(page, limit);
    let filter = { author: userId };
    if (category) filter.category = category;
    if (isPublic === "true") filter.isPublic = true;
    else if (isPublic === "false") filter.isPublic = false;

    const totalJokes = await Joke.countDocuments(filter);
    const jokes = await Joke.find({ author: userId, ...filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
    if (!jokes.length) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    jokes,
                    totalJokes,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalJokes / limitNumber),
                },
                "Joke not created yet",
            ),
        );
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jokes,
                totalJokes,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalJokes / limitNumber),
            },
            "Jokes fetched successfully.",
        ),
    );
});
// update joke by id
const updateJokeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, category, isPublic } = req.body;
    if (
        content === undefined &&
        category === undefined &&
        isPublic === undefined
    ) {
        throw new ApiError(400, "give atleast one field to update!!");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID");
    }
    const joke = await Joke.findById(id);
    if (!joke) {
        throw new ApiError(404, "Joke not found");
    }
    if (joke.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Invalid Author");
    }
    if (content) joke.content = content;
    if (category) joke.category = category;
    if (isPublic !== undefined) joke.isPublic = isPublic;

    const updatedJoke = await joke.save();
    return res
        .status(200)
        .json(new ApiResponse(200, updatedJoke, "Joke updated successfully."));
});

// delete by id
const deleteJokeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid jokeId!!");
    }
    const joke = await Joke.findById(id);
    if (!joke) {
        throw new ApiError(404, "Joke Not Found");
    }
    if (joke.author.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "Invalid author!");
    }
    const result = await Joke.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new ApiError(500, "Something went wrong! While deleting Joke.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Joke deleted successfully."));
});

export {
    createJoke,
    getPublicJokes,
    getRandomJoke,
    myJokes,
    updateJokeById,
    deleteJokeById,
};
