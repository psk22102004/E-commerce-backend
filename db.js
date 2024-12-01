import mongoose from "mongoose";

const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("Connected to MongoDB");
    } catch(error){
        console.error("Database connection error:", error);
    }
}

export default dbConnect;