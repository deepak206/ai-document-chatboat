import mongoose, { Document, Schema } from "mongoose";

export interface IDocumentChunk extends Document {
  documentId: string;
  filename: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
  pageNumber?: number;
}

const documentChunkSchema = new Schema<IDocumentChunk>(
  {
    documentId: {
      type: String,
      required: true,
      index: true,
    },

    filename: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    pageNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentChunk = mongoose.model<IDocumentChunk>(
  "DocumentChunk",
  documentChunkSchema
);