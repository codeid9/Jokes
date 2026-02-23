import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.models.js";

const toggleJokeLike = asyncHandler(async (req, res) => {
    const { jokeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jokeId)) {
        throw new ApiError(400, "Invalid Joke ID");
    }
    const alreadyLiked = await Like.findOne({
        joke: jokeId,
        likedBy: req.user._id,
    });
    
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: false },
                    "Unliked",
                ),
            );
    }

    const newLike = await Like.create({
        joke: jokeId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isLiked: true, newLike },
                "Liked",
            ),
        );
});

export default toggleJokeLike;
