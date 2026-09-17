import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

import { chunkText } from "../utils/chunkText";
import { generateEmbedding } from "../services/embeddingService";
import {
  saveChunks,
  deleteDocument,
} from "../services/documentRepository";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No document uploaded",
        });
      }

      // Extract PDF text
      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      // Split text into chunks
      const chunks = chunkText(result.text);

      console.log("Total chunks:", chunks.length);

      const documentChunks = [];

      // Generate embedding for every chunk
      for (let i = 0; i < chunks.length; i++) {
        console.log(
          `Generating embedding ${i + 1}/${chunks.length}`
        );

        const embedding = await generateEmbedding(chunks[i]);

        documentChunks.push({
          documentName: req.file.originalname,
          chunkIndex: i,
          text: chunks[i],
          embedding,
        });
      }

      // Remove old copy of the document
      await deleteDocument(req.file.originalname);

      // Save chunks and embeddings
      await saveChunks(documentChunks);

      console.log(
        "Document saved to MongoDB:",
        documentChunks.length
      );

      res.json({
        message: "Document uploaded successfully",
        filename: req.file.originalname,
        pages: result.total,
        chunks: chunks.length,
      });
    } catch (error: any) {
      console.error("PDF ERROR:", error);

      res.status(500).json({
        error: error?.message || "Failed to process PDF",
      });
    }
  }
);

export default router;