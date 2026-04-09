import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const SOCKET_URL=import.meta.env.MODE === "development" ? 'http://localhost:8080':'/';
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isLoggingIn:false,
    isSigningUp:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    OnlineUsers:[],
    socket:null,
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get('/auth/check')
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.error("Error checking auth:", error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signUp:async(userData)=>{
        set({ isSigningUp: true });
        try {
            const res=await axiosInstance.post('/auth/signup',userData)
            set({authUser:res.data})
            get().connectSocket()
            toast.success('Signup Successful')
        } catch (error) {
            console.error("Error signing up:", error.response?.data?.message || error.message);
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },
    login:async(credentials)=>{
        set({ isLoggingIn: true });
        try {
            const res=await axiosInstance.post('/auth/login',credentials)
            set({authUser:res.data})
            toast.success('Login Successful')
            get().connectSocket()
        } catch (error) {
            console.error("Error logging in:", error.response?.data?.message || error.message);
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            console.error("Error logging out:", error.response?.data?.message || error.message);
        }
    },
    updateProfile:async(userData)=>{
        set({isUpdatingProfile:true})
        try {
            const res=await axiosInstance.put('/auth/update-profile',userData)
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;

        const socket=io(SOCKET_URL,{
            query:{userId:authUser._id}
        });

        socket.connect();
        set({socket})

        socket.on('getOnlineUsers',(usersIds)=>{
            set({OnlineUsers:usersIds})
        })

    },
    disconnectSocket:()=>{
        const {socket}=get();
        if(socket){
            socket.disconnect();
            set({socket:null})
        }
    }
}))