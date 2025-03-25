import React, { useState } from 'react';
import { userAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader } from 'lucide-react'; // ✅ Correct Import
import {Link} from "react-router-dom";
// import AuthImagePattern from "../components/AuthImagePattern"; // ✅ Fix
import { AuthImagePattern } from "../components/AuthImagePattern";
import toast from 'react-hot-toast';

export const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { signup, isSingingUp } = userAuthStore();
  const validateForm=()=>{
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password) return toast.error("Password is required");
    if(formData.password.length<6) return toast.error("Password must be atleast 6 character");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const sucess=validateForm();
    if(sucess===true) signup(formData);
  };
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side */}
      <div className='flex flex-col justify-center items-center group-hover:bg-primary/20 transition-colors'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get started with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name Field */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                {/* ✅ Fix: Properly Center the Icon */}
                <div className='absolute top-1/2 left-3 -translate-y-1/2 flex items-center pointer-events-none'>
                  <User size={24} strokeWidth={2} className="text-gray-500" />
                  {/* <User className='w-5 h-5 text-base-content/40' /> */}
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full pl-10' // ✅ Fix: Proper padding
                  placeholder='John Die'
                  value={formData.fullName} // ✅ Fix: Correct "value"
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                {/* ✅ Fix: Properly Center the Icon */}
                <div className='absolute top-1/2 left-3 -translate-y-1/2 flex items-center pointer-events-none'>
                  <Mail size={20} className="size-5 text-base-content/40"/>
                </div>
                <input
                  type='email'
                  className='input input-bordered w-full pl-10' // ✅ Fix: Proper padding
                  placeholder='you@gmail.com'
                  value={formData.email} // ✅ Fix: Correct "value"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                {/* ✅ Fix: Properly Center the Icon */}
                <div className='absolute top-1/2 left-3 -translate-y-1/2 flex items-center pointer-events-none'>
                  <Lock size={20} className="size-5 text-base-content/40"/>
                </div>
                <input
                  type={showPassword ? "text":"password"}
                  className={'input input-bordered w-full pl-10'} // ✅ Fix: Proper padding
                  placeholder='********'
                  value={formData.password} // ✅ Fix: Correct "value"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={()=>setShowPassword(!showPassword)}>
                  {showPassword ?(
                    <EyeOff className='size-5 text-base-content/40'/>
                  ):(
                    <Eye className='size-5 text-base-content/40'/>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className='btn btn-primary w-full' disabled={isSingingUp}>
              {isSingingUp ? (
                <>
                  <Loader className='size-5 animate-spin'/>
                  Loading...
                </>
              ):(
                "Create Account"
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account ? {" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
              
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our Community"
        Subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
