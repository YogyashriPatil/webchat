import React, { useEffect, useState } from 'react';
import {User} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import {Camera, Mail} from "lucide-react";
import { format } from 'date-fns';
import toast from 'react-hot-toast';
const ProfilePage = () => {
  const {authUser,isUpdatingProfile,updateProfile,fetchUser}=useAuthStore();
  const [selectedImg,setSelectedImg]=useState(null);

  useEffect(() => {
    fetchUser();
  },[fetchUser]);
  const handleImageUpload=async(e)=>
  {
    const file=e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset","ml_default");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dchuvqwjl/image/upload", {
          method: "POST",
          body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) {
          console.error("Cloudinary upload failed:", data);
          toast.error("Image upload failed");
          return;
      }

      console.log("Uploaded Image URL:", data.secure_url);

      // Send URL to the backend
      await updateProfile({ profilePic: data.secure_url });

      // Update UI
      setSelectedImg(data.secure_url);
      toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    };
  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>
              Profile
            </h1>
            <p className='mt-2'>Your Profile Information</p>
          </div>
          {/* avatar upload section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt='Profile'
                className='w-24 h-24 rounded-full object-cover border-4'
              />
              <label
                htmlFor='avatar-upload'
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none":""}`}>
                  <Camera className="w-5 h-5 text-base-200"/>
                  <input type='file'
                  id='avatar-upload' className='hidden' accept='image/*' onChange={handleImageUpload} disabled={isUpdatingProfile}/>
                </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfile ? "Uploading...":"Click the camera item to update your photo"}
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <User className="w-4 h-4"/>
                Full Name 
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.fullName}</p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <Mail className='w-4 h-4'/>
                Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
            </div>      
          </div>

          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                <span>Member Since</span>
                <span>{authUser?.createAt? format(new Date(authUser.createAt),"MMMM dd,yyyy"):"N/A"}</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;