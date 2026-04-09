import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173']
    }
})


export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap={};//to store userId and socketId mapping



io.on('connection',(socket)=>{
    // console.log('a user connected',socket.id);

    const userId=socket.handshake.query.userId;

    if (userId){
        userSocketMap[userId]=socket.id;
        // console.log('User connected:', userId, 'Socket ID:', socket.id);
    }
    
//io.emit to send message to all connected clients
//socket.to(socketId).emit to send message to specific client
io.emit('getOnlineUsers',Object.keys(userSocketMap))


    socket.on('disconnect',()=>{
        // console.log('a user disconnected',socket.id);
        if(userId){
            delete userSocketMap[userId];
            io.emit('getOnlineUsers',Object.keys(userSocketMap))
        }
    })
})

export {io,server,app};