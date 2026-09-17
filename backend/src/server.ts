import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

import multer from "multer";
import { PDFParse } from "pdf-parse";
import { chunkText } from "./utils/chunkText";
import { generateEmbedding } from "./services/embeddingService";
import { storeChunks } from "./services/documentStore";
import { searchSimilarChunks } from "./services/searchService";

const upload = multer({
  storage: multer.memoryStorage(),
});
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "AI Document Chat API is running",
  });
});


app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // 1. Search the uploaded document
    const relevantChunks = await searchSimilarChunks(message, 3);

    console.log("Relevant chunks:", relevantChunks);

    // 2. Combine the relevant chunks into context
    const context = relevantChunks
      .map((chunk) => chunk.text)
      .join("\n\n---\n\n");

    // 3. Create the prompt for the AI
    const input = `
You are an AI assistant that answers questions about a company document.

Use ONLY the information provided in the document context below.

Rules:
- Answer using only the provided context.
- Do not make up information.
- If the answer is not present in the context, say:
  "I couldn't find that information in the uploaded document."
- Keep the answer clear and concise.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${message}
`;

    // 4. Ask the AI
    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input,
    });

    // 5. Return the answer
    res.json({
      answer: response.output_text,
    });

  } catch (error: any) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      error: error?.message || "Something went wrong",
    });
  }
});
  

  app.post("/api/upload", upload.single("document"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No document uploaded",
        });
      }
  
      const parser = new PDFParse({
        data: req.file.buffer,
      });
  
      const result = await parser.getText();
  
      const chunks = chunkText(result.text);
  
      console.log("Total chunks:", chunks.length);
  
      const documentChunks = [];
  
      for (let i = 0; i < chunks.length; i++) {
        console.log(
          `Generating embedding ${i + 1}/${chunks.length}`
        );
  
        const embedding = await generateEmbedding(chunks[i]);
  
        documentChunks.push({
          id: i,
          text: chunks[i],
          embedding,
        });
      }
  
      storeChunks(documentChunks);
  
      console.log(
        "Document embeddings stored:",
        documentChunks.length
      );
  
      await parser.destroy();
  
      res.json({
        message: "Document uploaded successfully",
        filename: req.file.originalname,
        pages: result.total,
        text: result.text,
        chunks: chunks.length,
      });
    } catch (error) {
      console.error("PDF ERROR:", error);
  
      res.status(500).json({
        error: "Failed to process PDF",
      });
    }
  });

  app.get("/api/test-embedding", async (req, res) => {
    try {
      const text = "Employees receive 18 annual paid leave days.";
  
      const embedding = await generateEmbedding(text);
  
      res.json({
        text,
        dimensions: embedding.length,
        embedding: embedding.slice(0, 10),
      });
    } catch (error: any) {
      console.error("EMBEDDING ERROR:", error);
  
      res.status(500).json({
        error: error?.message || "Embedding generation failed",
      });
    }
  });

  app.get("/api/test-search", async (req, res) => {
    try {
      const query =
        "How many annual paid leave days do employees get?";
  
      const results = await searchSimilarChunks(query, 3);
  
      res.json({
        query,
        results: results.map((item) => ({
          id: item.id,
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

