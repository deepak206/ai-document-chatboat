import { DocumentChunk } from "../models/DocumentChunk";

interface ChunkInput {
  documentName: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
}

export async function saveChunks(chunks: ChunkInput[]) {
  await DocumentChunk.insertMany(chunks);
}

export async function getAllChunks() {
  return DocumentChunk.find().lean();
}

export async function deleteDocument(documentName: string) {
  await DocumentChunk.deleteMany({
    documentName,
  });
}