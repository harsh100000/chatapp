const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes")
const messageRoutes = require("./Routes/messageRoutes")

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes)

const server = app.listen(PORT);

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
})

io.on("connection", (socket)=>{

  socket.on("setup", (userData)=>{
    socket.join(userData._id)    
    socket.emit("connected")
  })

  socket.on("joinChat", (roomId)=>{
    socket.join(roomId)    
  })

  socket.on("typing", (room)=>socket.in(room).emit("typing"))
  socket.on("stopTyping", (room)=>socket.in(room).emit("stopTyping"))

  socket.on("newMessage", (newMessageRecieved)=>{
    let chat = newMessageRecieved.chat
    if(!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(user => {
      if(user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("messageRecieved", newMessageRecieved)
    });
  })

  socket.off("setup", ()=>{
    socket.leave(userData._id)
  })

})