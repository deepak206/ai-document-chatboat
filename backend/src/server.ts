import "./config/env";

import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/database";

import chatRoutes from "./routes/chatRoutes";
import documentRoutes from "./routes/documentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "AI Document Chat API is running",
  });
});

// Routes
app.use("/api", chatRoutes);
app.use("/api", documentRoutes);

// Start server after MongoDB connection
connectDatabase().then(() => {
  app.listen(5000, () => {
    console.log(
      "Server running on http://localhost:5000"
    );
  });
});