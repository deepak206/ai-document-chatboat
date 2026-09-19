import { generateEmbedding } from "./embeddingService";
import { DocumentChunk } from "../models/DocumentChunk";

export async function searchSimilarChunks(
  query: string,
  topK: number = 3
) {
  const queryEmbedding =
    await generateEmbedding(query);

  const results =
    await DocumentChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: Math.max(
            topK * 10,
            50
          ),
          limit: topK,
        },
      },

      {
        $project: {
          _id: 1,
          documentId: 1,
          filename: 1,
          chunkIndex: 1,
          text: 1,

          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
}