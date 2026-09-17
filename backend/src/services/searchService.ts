import { generateEmbedding } from "./embeddingService";
import { getAllChunks } from "./documentRepository";
import { cosineSimilarity } from "../utils/similarity";

export async function searchSimilarChunks(
  query: string,
  topK: number = 3
) {
  const queryEmbedding = await generateEmbedding(query);

  const chunks = await getAllChunks();

  const results = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(
      queryEmbedding,
      chunk.embedding
    ),
  }));

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}