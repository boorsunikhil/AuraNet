import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";

import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { io, server ,app} from "./lib/socket.js";

import path from "path";
const PORT = process.env.PORT || 8080;
console.log(PORT)

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/vite-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/vite-project", "dist", "index.html"));
  });
}


app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
