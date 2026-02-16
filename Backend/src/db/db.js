import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("MongoDB Connected Successfully:)");
    } catch (error) {
        console.error("MongoDB Connection FAILED!!",error);
    }
}

export default connectDB;