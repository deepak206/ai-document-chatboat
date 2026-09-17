import mongoose, { Schema, Document } from "mongoose";

export interface IDocumentChunk extends Document {
  documentName: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
}

const documentChunkSchema = new Schema<IDocumentChunk>(
  {
    documentName: {
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
  },
  {
    timestamps: true,
  }
);

export const DocumentChunk = mongoose.model<IDocumentChunk>(
  "DocumentChunk",
  documentChunkSchema
);