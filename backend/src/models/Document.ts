import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
  filename: string;
  pages: number;
  chunkCount: number;
  uploadedAt: Date;
  status: "processing" | "ready" | "failed";
}

const documentSchema = new Schema<IDocument>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },

    pages: {
      type: Number,
      required: true,
      default: 0,
    },

    chunkCount: {
      type: Number,
      required: true,
      default: 0,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "processing",
        "ready",
        "failed",
      ],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentModel =
  mongoose.model<IDocument>(
    "Document",
    documentSchema
  );