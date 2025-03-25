import { Routes ,Route, Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import {Loader} from 'lucide-react';
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { userAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import {Toaster} from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App =()=>{
  const {authUser,checkAuth,isCheckingAuth}=userAuthStore();
  const {theme}=useThemeStore();
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);
  console.log({authUser});
  
  if(isCheckingAuth && !authUser) 
    return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  );
  return( 
  <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path="/" element={authUser?<HomePage />:<Navigate to="/login"/>}/>
      <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>}/>
      <Route path="/login" element={!authUser ? <LoginPage />:<Navigate to="/"/>}/>
      <Route path="/settings" element={<SettingsPage />}/>
      <Route path="/profile" element={authUser ? <ProfilePage />:<Navigate to="/login"/>}/>
    </Routes>

    <Toaster/>
  </div>
  );
};
export default App;