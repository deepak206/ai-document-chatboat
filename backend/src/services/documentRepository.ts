import { DocumentChunk } from "../models/DocumentChunk";

interface SaveChunkInput {
  documentId: string;
  filename: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
  pageNumber?: number;
}

export async function saveDocumentChunks(
  chunks: SaveChunkInput[]
) {
  return DocumentChunk.insertMany(chunks);
}

export async function getAllDocumentChunks() {
  return DocumentChunk.find().lean();
}