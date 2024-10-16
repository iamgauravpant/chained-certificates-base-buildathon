import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async()=>{
    try{
        // kabhi bhi env file mein change karoge toh server restart karna !
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`)
    } catch(error) {
        console.log("MongoDB connection error :",error);
        process.exit(1); // aur padho iske baare mein !
    }
}

export default connectDB;