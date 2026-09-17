import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

import multer from "multer";
import { PDFParse } from "pdf-parse";
import { chunkText } from "./utils/chunkText";
import { generateEmbedding } from "./services/embeddingService";
import { storeChunks } from "./services/documentStore";

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
      const { message, documentText } = req.body;
  
      if (!message) {
        return res.status(400).json({
          error: "Message is required",
        });
      }
  
      let input = message;
  
      if (documentText) {
        input = `
  You are an AI assistant that answers questions about a company document.
  
  Use the document below to answer the user's question.
  
  IMPORTANT RULES:
  - Answer using only information contained in the document.
  - If the answer cannot be found in the document, say:
    "I couldn't find that information in the uploaded document."
  - Do not make up information.
  - Keep the answer clear and concise.
  
  COMPANY DOCUMENT:
  ${documentText}
  
  USER QUESTION:
  ${message}
  `;
      }
  
      const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input,
      });
  
      res.json({
        answer: response.output_text,
      });
    } catch (error: any) {
      console.error("OPENAI ERROR:", error);
  
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

