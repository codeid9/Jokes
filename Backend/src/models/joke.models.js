import mongoose, { Schema } from "mongoose";

const jokeSchema = new mongoose.Schema({
    content:{
        type:String,
        required:[true,"Joke is mandatory"],
        trim:true,
        unique:true,
        minlength:[10,"joke is too short!"]
    },
    category:{
        type:String,
        enum:["programming","general","knock-knock","humor"],
        default:"general"
    },
    tag:{
        type:[String],
        default:[]
    },
    likes:{
        type:Number,
        default:0
    },
    isPublic:{
        type:Boolean,
        default:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const Joke = mongoose.model("Joke",jokeSchema);

export default Joke;
