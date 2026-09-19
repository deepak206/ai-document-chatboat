import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/database";

import chatRoutes from "./routes/chatRoutes";
import documentRoutes from "./routes/documentRoutes";
import agentRoutes from "./routes/agentRoutes";

const app = express();

const PORT = 5000;

// ---------------------------------------
// Middleware
// ---------------------------------------

app.use(cors());

app.use(express.json());

// ---------------------------------------
// Routes
// ---------------------------------------

app.use("/api", chatRoutes);

app.use("/api", documentRoutes);

app.use("/api", agentRoutes);

// ---------------------------------------
// Health check
// ---------------------------------------

app.get("/", (_req, res) => {
  res.json({
    message: "GenChat API is running",
  });
});

// ---------------------------------------
// Start server
// ---------------------------------------

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );
  }
}

startServer();