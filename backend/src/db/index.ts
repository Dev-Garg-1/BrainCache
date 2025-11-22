import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../config/config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected successfully !!")
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.log("Error while connecting to MongoDB: ", error.message)
        }else {
            console.log("Unknown error while connecting to MongoDB: ", error);
        }

        process.exit(1);
    }
}

export default connectDB;