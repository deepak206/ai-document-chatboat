export interface DocumentItem {
    _id: string;
    filename: string;
    pages: number;
    chunkCount: number;
    status: "processing" | "ready" | "failed";
    uploadedAt: string;
  }