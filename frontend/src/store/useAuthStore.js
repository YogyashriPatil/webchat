import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { LucideOctagonAlert } from "lucide-react";
export const userAuthStore=create((set)=>({
    authUser:null,
    isSignUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const token = localStorage.getItem("authToken"); // ✅ Get token from storage
            if (!token) throw new Error("No token found");
            const res=await axiosInstance.get("/auth/check",{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in checkAuth : ",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSignUp:true});
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully");

            localStorage.setItem("authToken", res.data.token);
            set({authUser:res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSignUp:false});
        }
    },
    login:async(data)=>{
        set({isLoggingIng:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            console.log("Token Received : ",res.data.token);
            if(res.data.token){
                localStorage.setItem("authToken",res.data.token);
            }else{
                console.error("No token received from backend !");
            }
            set({authUser:res.data});
            toast.success("Loggend In successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIng:false});
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
           const res=await axiosInstance.put("/auth/update-profile",data);
            console.log("🟢 Profile updated successfully:", res.data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile : ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },
}));