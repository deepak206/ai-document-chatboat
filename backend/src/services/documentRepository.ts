import { DocumentChunk } from "../models/DocumentChunk";

interface SaveChunkInput {
  documentId: string;
  filename: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
  pageNumber?: number;
}

// ---------------------------------------
// Save document chunks
// ---------------------------------------

export async function saveDocumentChunks(
  chunks: SaveChunkInput[]
) {
  return DocumentChunk.insertMany(chunks);
}

// ---------------------------------------
// Get all document chunks
// ---------------------------------------

export async function getAllDocumentChunks() {
  return DocumentChunk.find().lean();
}

// ---------------------------------------
// Delete document chunks
// ---------------------------------------

export async function deleteDocumentChunks(
  documentId: string
) {
  return DocumentChunk.deleteMany({
    documentId,
  });
}