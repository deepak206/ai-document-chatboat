import { DocumentModel } from "../models/Document";

interface CreateDocumentInput {
  filename: string;
  pages: number;
}

export async function findDocumentByFilename(
  filename: string
) {
  return DocumentModel.findOne({
    filename,
  }).lean();
}

export async function createDocument(
  data: CreateDocumentInput
) {
  return DocumentModel.create({
    filename: data.filename,
    pages: data.pages,
    chunkCount: 0,
    status: "processing",
  });
}

export async function updateDocumentReady(
  documentId: string,
  chunkCount: number
) {
  return DocumentModel.findByIdAndUpdate(
    documentId,
    {
      chunkCount,
      status: "ready",
    },
    {
      new: true,
    }
  );
}

export async function updateDocumentFailed(
  documentId: string
) {
  return DocumentModel.findByIdAndUpdate(
    documentId,
    {
      status: "failed",
    },
    {
      new: true,
    }
  );
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


