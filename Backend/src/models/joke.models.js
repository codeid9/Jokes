import mongoose, { Schema } from "mongoose";

const jokeSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Joke is mandatory"],
            trim: true,
            unique: true,
            minlength: [10, "joke is too short!"],
        },
        category: {
            type: String,
            enum: {
                values: [
                    "programming",
                    "general",
                    "knock-knock",
                    "humor",
                    "funny",
                    "sarcasm",
                    "nerdy",
                    "desi",
                    "school",
                    "office",
                ],
                message: "Wrong category! ",
            },
            default: "general",
        },
        tag: {
            type: [String],
            default: [],
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
    },
    {
        timestamps: true,
    },
);

const Joke = mongoose.model("Joke", jokeSchema);

export default Joke;
