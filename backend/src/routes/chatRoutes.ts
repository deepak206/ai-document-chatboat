import { Router } from "express";

import { searchSimilarChunks } from "../services/searchService";
import { generateAnswer } from "../services/ollamaService";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("User question:", message);

    // Find relevant chunks
    const relevantChunks = await searchSimilarChunks(
      message,
      3
    );

    console.log(
      "Relevant chunks:",
      relevantChunks.length
    );

    // Build context
    const context = relevantChunks
      .map((chunk) => chunk.text)
      .join("\n\n---\n\n");

    // Generate answer using Ollama
    const answer = await generateAnswer(
      context,
      message
    );

    res.json({
      answer,
    });
  } catch (error: any) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      error: error?.message || "Something went wrong",
    });
  }
});

router.get("/test-ollama", async (req, res) => {
    try {
      const answer = await generateAnswer(
        "NovaTech Solutions is a technology company.",
        "What is NovaTech Solutions?"
      );
  
      res.json({
        answer,
      });
    } catch (error: any) {
      console.error("OLLAMA ERROR:", error);
  
      res.status(500).json({
        error: error?.message || "Ollama request failed",
      });
    }
  });
  
export default router;