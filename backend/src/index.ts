import express from "express";
import http from "http";
import { Server } from "socket.io"; 
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"], 
  },
});

app.use(cors());

let onlineUsers = 0;

app.get("/", async (req, res) => {
  res.send("Chat server is running");
});

io.on("connection", (socket) => {
    onlineUsers++;
    console.log(`A user connected: ${socket.id}, Online users: ${onlineUsers}`);

    io.emit("update onlineUsers", onlineUsers);

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        onlineUsers--; 
        console.log(`User disconnected: ${socket.id}, Online users: ${onlineUsers}`);

        io.emit("update onlineUsers", onlineUsers);
    });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
