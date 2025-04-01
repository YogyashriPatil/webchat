import mongoose from "mongoose";
export const connectDB=async() =>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            serverSelectionTimeoutMS:5000,
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch(error)
    {
        console.log("MongoDB connection error : ",error);
    }
};
export default connectDB;