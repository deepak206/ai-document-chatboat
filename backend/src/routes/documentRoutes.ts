import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

import { chunkText } from "../utils/chunkText";
import { generateEmbedding } from "../services/embeddingService";

import {
  saveDocumentChunks,
} from "../services/documentRepository";

import {
    createDocument,
    updateDocumentReady,
    updateDocumentFailed,
    getAllDocuments,
    findDocumentByFilename,
  } from "../services/documentManagementRepository";
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/*
========================================
UPLOAD DOCUMENT
========================================
*/

router.post(
  "/upload",
  upload.single("document"),
  async (req, res) => {
    let documentId: string | null = null;

    try {
      /*
      ================================
      VALIDATE FILE
      ================================
      */

      if (!req.file) {
        return res.status(400).json({
          error: "No document uploaded",
        });
      }

      console.log(
        "Processing:",
        req.file.originalname
      );

      const existingDocument =
        await findDocumentByFilename(
            req.file.originalname
        );

        if (existingDocument) {
        return res.status(409).json({
            error:
            "This document has already been uploaded.",
            document: existingDocument,
        });
        }

      /*
      ================================
      EXTRACT PDF TEXT
      ================================
      */

      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      console.log("PDF text extracted");

      /*
      ================================
      CREATE DOCUMENT RECORD
      ================================
      */

      const document = await createDocument({
        filename: req.file.originalname,
        pages: result.total,
      });

      documentId = document._id.toString();

      console.log(
        "Document created:",
        documentId
      );

      /*
      ================================
      CREATE TEXT CHUNKS
      ================================
      */

      const chunks = chunkText(
        result.text
      );

      console.log(
        "Total chunks:",
        chunks.length
      );

      /*
      ================================
      GENERATE EMBEDDINGS
      ================================
      */

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

      /*
      ================================
      SAVE CHUNKS TO MONGODB
      ================================
      */

      const savedChunks =
        await saveDocumentChunks(
          documentChunks
        );

      console.log(
        "Saved chunks:",
        savedChunks.length
      );

      /*
      ================================
      MARK DOCUMENT AS READY
      ================================
      */

      const updatedDocument =
        await updateDocumentReady(
          documentId,
          savedChunks.length
        );

      console.log(
        "Document ready:",
        documentId
      );

      /*
      ================================
      SEND RESPONSE
      ================================
      */

      res.json({
        message:
          "Document uploaded successfully",

        documentId,

        filename:
          req.file.originalname,

        pages:
          result.total,

        chunks:
          savedChunks.length,

        status:
          updatedDocument?.status ||
          "ready",
      });
    } catch (error: any) {
      /*
      ================================
      ERROR HANDLING
      ================================
      */

      console.error(
        "UPLOAD ERROR:",
        error
      );

      /*
      ================================
      MARK DOCUMENT AS FAILED
      ================================
      */

      if (documentId) {
        try {
          await updateDocumentFailed(
            documentId
          );
        } catch (updateError) {
          console.error(
            "FAILED TO UPDATE DOCUMENT STATUS:",
            updateError
          );
        }
      }

      res.status(500).json({
        error:
          error?.message ||
          "Failed to process document",
      });
    }
  }
);

/*
========================================
GET ALL DOCUMENTS
========================================
*/

router.get(
  "/documents",
  async (req, res) => {
    try {
      const documents =
        await getAllDocuments();

      res.json(documents);
    } catch (error: any) {
      console.error(
        "GET DOCUMENTS ERROR:",
        error
      );

      res.status(500).json({
        error:
          error?.message ||
          "Failed to get documents",
      });
    }
  }
);

export default router;