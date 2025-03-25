import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
// ✅ Load environment variables first
dotenv.config();
const app=express();

const PORT=process.env.PORT || 5001;// Default to 5001 if not set
// ✅ Ensure `.env` is loaded correctly
console.log("PORT from .env:", process.env.PORT);
console.log("MONGODB_URI from .env:", process.env.MONGODB_URI);
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    }
));
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded data size
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
app.listen(PORT, () => {
    console.log("Server is running on PORT:"+PORT);
    connectDB();
});
