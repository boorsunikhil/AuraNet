import { useEffect, } from "react";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import SignUpPage  from "./components/SignUpPage";
import { LoginPage } from "./components/LoginPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import {Loader} from 'lucide-react'
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";



function App() {
  const {authUser,checkAuth,isCheckingAuth,OnlineUsers}=useAuthStore()
  const {theme}=useThemeStore()

// const [themeLoaded,setThemeLoaded]=useState(localStorage.getItem('theme') || 'dark')

console.log("Online Users:", OnlineUsers);

useEffect(()=>{
    console.log("Applying theme:", theme);
  const currentTheme=localStorage.getItem('theme') 
  document.documentElement.setAttribute('data-theme',currentTheme)
  // setThemeLoaded(localStorage.getItem('theme') || 'dark')
},[theme])

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  if(isCheckingAuth && !authUser){
    return (<div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" size={48} />
    </div>
  )
  }

  return (
    <div className="min-h-screen bg-base-100 " data-theme={theme}>


      <Navbar />
        <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <HomePage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <HomePage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <LoginPage />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <LoginPage />} />
        <Route path="*" element={authUser ? <HomePage /> : <LoginPage />} />
      </Routes>
      
    </div>
  );
}

export default App;
