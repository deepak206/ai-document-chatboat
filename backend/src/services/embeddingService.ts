import { generateEmbedding as generateOllamaEmbedding } from "./ollamaService";

export async function generateEmbedding(
  text: string
): Promise<number[]> {
  return generateOllamaEmbedding(text);
}