import { Router } from "express";

import {
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from "../services/documentManagementRepository";

import {
  deleteDocumentChunks,
} from "../services/documentRepository";

const router = Router();

// Get all documents
router.get("/documents", async (_req, res) => {
  try {
    const documents = await getAllDocuments();

    res.json(documents);
  } catch (error: any) {
    console.error("GET DOCUMENTS ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Failed to get documents",
    });
  }
});

// Get single document
router.get("/documents/:id", async (req, res) => {
  try {
    const document =
      await getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    res.json(document);
  } catch (error: any) {
    console.error("GET DOCUMENT ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Failed to get document",
    });
  }
});

// Delete document
router.delete("/documents/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    const document =
      await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    // Delete document chunks / embeddings first
    await deleteDocumentChunks(documentId);

    // Delete document metadata
    await deleteDocument(documentId);

    res.json({
      message: "Document deleted successfully",
      documentId,
    });
  } catch (error: any) {
    console.error("DELETE DOCUMENT ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Failed to delete document",
    });
  }
});

export default router;