import { generateEmbedding } from "./embeddingService";
import { getAllDocumentChunks } from "./documentRepository";
import { cosineSimilarity } from "../utils/similarity";

export async function searchSimilarChunks(
  query: string,
  topK: number = 5
) {
  const queryEmbedding = await generateEmbedding(query);

  const chunks = await getAllDocumentChunks();

  const results = chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}