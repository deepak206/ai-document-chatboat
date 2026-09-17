export interface DocumentChunk {
    id: number;
    text: string;
    embedding: number[];
  }
  
  const documentChunks: DocumentChunk[] = [];
  
  export function storeChunks(chunks: DocumentChunk[]) {
    documentChunks.length = 0;
    documentChunks.push(...chunks);
  }
  
  export function getChunks(): DocumentChunk[] {
    return documentChunks;
  }