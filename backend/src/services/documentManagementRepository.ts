import { DocumentModel } from "../models/Document";

interface CreateDocumentInput {
  filename: string;
  pages: number;
  chunkCount: number;
}

export async function createDocument(
  data: CreateDocumentInput
) {
  return DocumentModel.create({
    filename: data.filename,
    pages: data.pages,
    chunkCount: data.chunkCount,
    status: "ready",
  });
}

export async function getAllDocuments() {
  return DocumentModel.find()
    .sort({ uploadedAt: -1 })
    .lean();
}

export async function getDocumentById(
  documentId: string
) {
  return DocumentModel.findById(
    documentId
  ).lean();
}

export async function deleteDocument(
  documentId: string
) {
  return DocumentModel.findByIdAndDelete(
    documentId
  );
}