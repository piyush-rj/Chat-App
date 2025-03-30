"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
let onlineUsers = 0;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Chat server is running");
}));
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
