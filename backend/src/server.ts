import "./config/env";

import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/database";

import chatRoutes from "./routes/chatRoutes";
import documentRoutes from "./routes/documentRoutes";
import { searchSimilarChunks } from "./services/searchService";

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


app.get("/api/test-search", async (req, res) => {
  try {
    const query =
      "How many annual paid leave days do employees get?";

    const results = await searchSimilarChunks(
      query,
      3
    );

    res.json({
      query,
      results: results.map((item) => ({
        filename: item.filename,
        chunkIndex: item.chunkIndex,
        score: item.score,
        text: item.text,
      })),
    });
  } catch (error: any) {
    console.error("SEARCH ERROR:", error);

    res.status(500).json({
      error: error?.message || "Search failed",
    });
  }
});

// Start server after MongoDB connection
connectDatabase().then(() => {
  app.listen(5000, () => {
    console.log(
      "Server running on http://localhost:5000"
    );
  });
});