import { searchSimilarChunks } from "../services/searchService";
import type { AgentTool } from "../agent/types";

export const searchDocumentsTool: AgentTool = {
  name: "search_documents",

  description:
    "Search uploaded company documents for information relevant to the user's question.",

  execute: async (input: string) => {
    const results = await searchSimilarChunks(input, 5);

    return results.map((result) => ({
      filename: result.filename,
      chunkIndex: result.chunkIndex,
      text: result.text,
      score: result.score,
    }));
  },
};