import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
// ✅ Load environment variables first
dotenv.config();
const app=express();

const PORT=process.env.PORT || 5001;// Default to 5001 if not set
// ✅ Ensure `.env` is loaded correctly
console.log("PORT from .env:", process.env.PORT);
console.log("MONGODB_URI from .env:", process.env.MONGODB_URI);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/messge",messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT:"+PORT);
    connectDB();
});