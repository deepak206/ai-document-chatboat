import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

import { chunkText } from "../utils/chunkText";
import { generateEmbedding } from "../services/embeddingService";
import { saveDocumentChunks } from "../services/documentRepository";

import {
  createDocument,
} from "../services/documentManagementRepository";

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

      console.log(
        "Processing:",
        req.file.originalname
      );


      // ==========================================
      // 1. Extract PDF text
      // ==========================================

      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      console.log("PDF text extracted");


      // ==========================================
      // 2. Create chunks
      // ==========================================

      const chunks = chunkText(result.text);

      console.log(
        "Total chunks:",
        chunks.length
      );


      // ==========================================
      // 3. Generate document ID
      // ==========================================

      const documentId =
        `${Date.now()}-${req.file.originalname}`;


      // ==========================================
      // 4. Generate embeddings
      // ==========================================

      const documentChunks = [];

      for (
        let i = 0;
        i < chunks.length;
        i++
      ) {

        console.log(
          `Generating embedding ${i + 1}/${chunks.length}`
        );

        const embedding =
          await generateEmbedding(
            chunks[i]
          );

        documentChunks.push({
          documentId,

          filename:
            req.file.originalname,

          chunkIndex: i,

          text: chunks[i],

          embedding,
        });
      }


      // ==========================================
      // 5. Save chunks to MongoDB
      // ==========================================

      const savedChunks =
        await saveDocumentChunks(
          documentChunks
        );

      console.log(
        "Saved chunks to MongoDB:",
        savedChunks.length
      );


      // ==========================================
      // 6. Save document information
      // ==========================================

      const savedDocument =
        await createDocument({
          filename:
            req.file.originalname,

          pages:
            result.total,

          chunkCount:
            savedChunks.length,
        });


      console.log(
        "Document saved:",
        savedDocument._id
      );


      // ==========================================
      // 7. Send response
      // ==========================================

      res.json({
        message:
          "Document uploaded successfully",

        documentId,

        databaseId:
          savedDocument._id,

        filename:
          req.file.originalname,

        pages:
          result.total,

        chunks:
          savedChunks.length,

        status:
          savedDocument.status,
      });

    } catch (error: any) {

      console.error(
        "UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        error:
          error?.message ||
          "Failed to process document",
      });
    }
  }
);


export default router;