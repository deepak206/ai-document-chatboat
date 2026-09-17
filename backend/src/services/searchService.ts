import { generateEmbedding } from "./embeddingService";
import { getChunks, DocumentChunk } from "./documentStore";
import { cosineSimilarity } from "../utils/similarity";

export async function searchSimilarChunks(
  query: string,
  topK: number = 3
): Promise<(DocumentChunk & { score: number })[]> {

  // 1. Convert user's question into an embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Get all stored PDF chunks
  const chunks = getChunks();

  // 3. Calculate similarity for every chunk
  const results = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(
      queryEmbedding,
      chunk.embedding
    ),
  }));

  // 4. Sort from most similar to least similar
  results.sort((a, b) => b.score - a.score);

  // 5. Return only the top results
  return results.slice(0, topK);
}