import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from 'path';


import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import messageRoutes from "./routes/messageRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app); // <-- Remplace app.listen par ça
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // en dev uniquement
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes API REST
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messages", messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/api/user",userRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/chat",chatRoutes);



// Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ Nouveau client connecté :", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // broadcast à tous
  });

  socket.on("disconnect", () => {
    console.log("❌ Client déconnecté :", socket.id);
  });
});

// Connexion MongoDB et lancement serveur HTTP + Socket.IO
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB connecté !");
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Échec connexion MongoDB :", err);
  });
