import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import ollama from "ollama";

import {
  createDocument,
  updateDocumentReady,
  updateDocumentFailed,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from "../services/documentManagementRepository";

import {
  saveDocumentChunks,
  deleteDocumentChunks,
} from "../services/documentRepository";

const router = Router();

// =======================================
// Multer
// =======================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// =======================================
// Upload document
// =======================================

router.post(
    "/documents/upload",
    upload.single("document"),
    async (req, res) => {
      let documentId: string | undefined;
  
      try {
        console.log("=================================");
        console.log("DOCUMENT UPLOAD START");
        console.log("=================================");
  
        // -----------------------------------
        // 1. Receive PDF
        // -----------------------------------
  
        if (!req.file) {
          return res.status(400).json({
            error: "No document uploaded",
          });
        }
  
        console.log(
          "Filename:",
          req.file.originalname
        );
  
        console.log(
          "Mimetype:",
          req.file.mimetype
        );
  
        console.log(
          "Size:",
          req.file.size
        );
  
        if (
          req.file.mimetype !==
          "application/pdf"
        ) {
          return res.status(400).json({
            error:
              "Only PDF files are supported",
          });
        }
  
        // -----------------------------------
        // 2. Extract PDF text
        // -----------------------------------
  
        console.log(
          "Extracting PDF text..."
        );
  
        const parser = new PDFParse({
          data: req.file.buffer,
        });
  
        const pdfData =
          await parser.getText();
  
        const extractedText =
          pdfData.text?.trim();
  
        await parser.destroy();
  
        if (!extractedText) {
          return res.status(400).json({
            error:
              "Could not extract text from PDF",
          });
        }
  
        console.log(
          "Extracted characters:",
          extractedText.length
        );
  
        const pages =
          Number(pdfData.total) || 1;
  
        console.log(
          "Total pages:",
          pages
        );
  
        // -----------------------------------
        // 3. Save document metadata
        // -----------------------------------
  
        console.log(
          "Creating document..."
        );
  
        const document =
          await createDocument({
            filename:
              req.file.originalname,
            pages,
          });
  
        documentId =
          document._id.toString();
  
        console.log(
          "Document created:",
          documentId
        );
  
        // -----------------------------------
        // 4. Create chunks
        // -----------------------------------
  
        console.log(
          "Creating text chunks..."
        );
  
        const chunkSize = 1000;
        const overlap = 200;
  
        const chunks: string[] = [];
  
        let start = 0;
  
        while (
          start < extractedText.length
        ) {
          const end = Math.min(
            start + chunkSize,
            extractedText.length
          );
  
          const chunk =
            extractedText
              .slice(start, end)
              .trim();
  
          if (chunk) {
            chunks.push(chunk);
          }
  
          if (
            end >= extractedText.length
          ) {
            break;
          }
  
          start =
            end - overlap;
        }
  
        console.log(
          "Total chunks:",
          chunks.length
        );
  
        if (!chunks.length) {
          throw new Error(
            "No text chunks were created"
          );
        }
  
        // -----------------------------------
        // 5. Generate Ollama embeddings
        // -----------------------------------
  
        console.log(
          "Generating Ollama embeddings..."
        );
  
        const chunkDocuments = [];
  
        for (
          let i = 0;
          i < chunks.length;
          i++
        ) {
          const text = chunks[i];
  
          console.log(
            `Embedding ${i + 1}/${chunks.length}`
          );
  
          const response =
            await ollama.embed({
              model:
                "nomic-embed-text",
  
              input: text,
            });
  
          const embedding =
            response.embeddings[0];
  
          if (!embedding) {
            throw new Error(
              `No embedding returned for chunk ${i}`
            );
          }
  
          chunkDocuments.push({
            documentId,
            filename:
              req.file.originalname,
            chunkIndex: i,
            text,
            embedding,
          });
        }
  
        // -----------------------------------
        // 6. Save chunks + embeddings
        // -----------------------------------
  
        console.log(
          "Saving document chunks..."
        );
  
        await saveDocumentChunks(
          chunkDocuments
        );
  
        console.log(
          `Saved ${chunkDocuments.length} chunks`
        );
  
        // -----------------------------------
        // 7. Mark document ready
        // -----------------------------------
  
        const updatedDocument =
          await updateDocumentReady(
            documentId,
            chunkDocuments.length
          );
  
        console.log(
          "Document marked as ready"
        );
  
        // -----------------------------------
        // 8. Return document
        // -----------------------------------
  
        console.log("=================================");
        console.log(
          "DOCUMENT UPLOAD SUCCESS"
        );
        console.log("=================================");
  
        return res.status(201).json({
          message:
            "Document uploaded and processed successfully",
  
          document:
            updatedDocument,
  
          documentId,
  
          filename:
            req.file.originalname,
  
          pages,
  
          totalCharacters:
            extractedText.length,
  
          totalChunks:
            chunkDocuments.length,
        });
      } catch (error: any) {
        console.error(
          "================================="
        );
  
        console.error(
          "DOCUMENT UPLOAD ERROR"
        );
  
        console.error(error);
  
        console.error(
          error?.stack
        );
  
        console.error(
          "================================="
        );
  
        if (documentId) {
          try {
            await updateDocumentFailed(
              documentId
            );
          } catch (updateError) {
            console.error(
              "Failed to update document status:",
              updateError
            );
          }
        }
  
        return res.status(500).json({
          error:
            error?.message ||
            "Failed to upload document",
        });
      }
    }
  );

// =======================================
// Get all documents
// =======================================

router.get(
  "/documents",
  async (_req, res) => {
    try {
      const documents =
        await getAllDocuments();

      return res.json(documents);
    } catch (error: any) {
      console.error(
        "GET DOCUMENTS ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to get documents",
      });
    }
  }
);

// =======================================
// Get single document
// =======================================

router.get(
  "/documents/:id",
  async (req, res) => {
    try {
      const documentId =
        req.params.id;

      const document =
        await getDocumentById(
          documentId
        );

      if (!document) {
        return res.status(404).json({
          error: "Document not found",
          documentId,
        });
      }

      return res.json(document);
    } catch (error: any) {
      console.error(
        "GET DOCUMENT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to get document",
      });
    }
  }
);

// =======================================
// Delete document
// =======================================

router.delete(
  "/documents/:id",
  async (req, res) => {
    try {
      const documentId =
        req.params.id;

      console.log(
        "DELETE DOCUMENT REQUEST:",
        documentId
      );

      const document =
        await getDocumentById(
          documentId
        );

      if (!document) {
        return res.status(404).json({
          error: "Document not found",
          documentId,
        });
      }

      // Delete chunks
      const chunkResult =
        await deleteDocumentChunks(
          documentId
        );

      console.log(
        `Deleted ${chunkResult.deletedCount} chunks`
      );

      // Delete document metadata
      await deleteDocument(
        documentId
      );

      console.log(
        "Document deleted:",
        document.filename
      );

      return res.json({
        message:
          "Document deleted successfully",

        documentId,

        filename:
          document.filename,

        deletedChunks:
          chunkResult.deletedCount,
      });
    } catch (error: any) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to delete document",
      });
    }
  }
);

export default router;