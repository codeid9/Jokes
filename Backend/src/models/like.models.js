import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        joke:{
            type:Schema.Types.ObjectId,
            ref:"Joke",
            required:true
        },
        likedBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps: true,
    },
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
