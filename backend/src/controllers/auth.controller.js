import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import jwt from 'jsonwebtoken';
export const signup=async(req,res) => {
    const{fullName,email,password}=req.body;
    try{
        // hash password
        //
        if(!fullName || !email ||!password){
            return res.status(400).json({message:"ALL fiels are required"});
        }
        if(password.length<6){
            return res.status(400).json({message: "Password must be atleast 6 character "});
        }
        const user=await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        })
        if(newUser){
            //generate jwt token here
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }
    }
    catch(error)
    {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};
export const login=async(req,res) => 
{
    const{email,password}=req.body;
    try{
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials "});
        }
        const token=generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            token,
        });
    }
    catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal server error"});       
    }
};
export const logout=(req,res) => {
    try{
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"internal Server error"});
    }
};
export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        console.log("📩 Received update request:", profilePic);
        if(!profilePic){
            console.error("⚠️ No profilePic received!");
            return res.status(400).json({message:"No profile picture provied"});
        }
        let uploadResponse;
        try {
            uploadResponse=await cloudinary.uploader.upload(profilePic,{
                folder:"profile_pictures",
                allowed_formats:["jpg","png","jpeg","webp"],
                transformation:[{width:500,height:500,crop:"limit"}],
            });
        } catch (error) {
            console.error("❌ Cloudinary Upload Error:", uploadError);
            return res.status(500).json({ message: "Image upload failed" });
        }
        console.log("🟢 Cloudinary Upload Response:", uploadResponse);
        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Updated User:", updatedUser);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("error in update profile");
        res.status(500).json({message:"Internal server error"});
    }
};
export const checkAuth= async (req,res) => {
    try {
        console.log("Authenticated User:", req.user?._id); // Log user to check if it is defined
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}