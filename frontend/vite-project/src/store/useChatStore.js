import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChartStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
    // tometimedMessages:[],
    // tosomeoneelseTimedMessages:[],
    getUsers:async()=>{
        set({isUserLoading:true})
        try {
            const res=await axiosInstance.get('/messages/users')
            set({users:res.data})
            toast.success("Users loaded")
        } catch (error) {
            console.error("Error loading users:", error.response?.data?.message || error.message);
            toast.error("Failed to load users")
        }finally{
            set({isUserLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/messages/${userId}`)
            // console.log("Message in ui ",res.data);
            set({messages:res.data})
            toast.success("Messages loaded")
        } catch (error) {
            console.error("Error loading messages:", error.response?.data?.message || error.message);
            toast.error("Failed to load messages")
        }finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async(messageData)=>{
        const {messages,selectedUser}=get();
        // console.log("Sending message to user:", selectedUser?._id, "with data:", messageData);
        try {
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
            toast.success("Message sent")
        } catch (error) {
            console.error("Error sending message:", error.response?.data?.message || error.message);
            toast.error("Failed to send message")
        }
    },

    subscribeToMessages:()=>{
    const {selectedUser}=get()
    if(!selectedUser) return;
    const socket=useAuthStore.getState().socket;
    if(!socket) return;
    socket.on('newMessage',(newMessage)=>{

        if(newMessage.senderId!==selectedUser._id){
            return;
        }

        set({messages:[...get().messages,newMessage]})
    })},

    unsubscribeFromMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off('newMessage');
    },
    setSelectedUser:(user)=>{
        set({selectedUser:user})    
    },
    // senderTimedMessages:()=>{
    //     const {messages}=get();
    //     const authUser=useAuthStore.getState().authUser;
    //     const filteredMessages = messages.filter(message => message.isTimed && message.scheduledTime > new Date().toISOString() && message.senderId === authUser._id );
    //     set({tosomeoneelseTimedMessages:filteredMessages});
       
    // },
    // recievertimedMessages:()=>{
    //     const {messages}=get();
    //     const authUser=useAuthStore.getState().authUser;
    //     const filteredMessages = messages.filter(message => message.isTimed && message.scheduledTime > new Date().toISOString() && message.receiverId === authUser._id );
    //     set({tometimedMessages:filteredMessages});
    // }


}))