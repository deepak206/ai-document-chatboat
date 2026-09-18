import { generateEmbedding } from "./embeddingService";
import { getAllDocumentChunks } from "./documentRepository";
import { cosineSimilarity } from "../utils/similarity";

export async function searchSimilarChunks(
  query: string,
  topK: number = 3
) {
  // 1. Convert user's question into an embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Get stored chunks from MongoDB
  const chunks = await getAllDocumentChunks();

  // 3. Calculate similarity
  const results = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(
      queryEmbedding,
      chunk.embedding
    ),
  }));

  // 4. Sort by highest similarity
  results.sort((a, b) => b.score - a.score);

  // 5. Return top K results
  return results.slice(0, topK);
}