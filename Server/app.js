const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const connectDB = require("./config/db");
const { chats } = require("./Data/data");
const { Server } = require("socket.io");
require("dotenv").config();
const userRoutes = require("./Routes/userRoutes");
const {notFound, errorHandler} = require('./Middlewares/errorMiddleware')

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
connectDB();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api/user", userRoutes);

// app.use(notFound)
// app.use(errorHandler)

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
