import ollama from "ollama";

const CHAT_MODEL = "llama3.2:3b";
const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const response = await ollama.embed({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.embeddings[0];
}

export async function generateAnswer(
  context: string,
  question: string
): Promise<string> {
  const prompt = `
You are an AI assistant that answers questions about a company document.

Use ONLY the information provided in the document context.

Rules:
- Answer using only the provided context.
- Do not make up information.
- If the answer is not present in the context, say:
  "I couldn't find that information in the uploaded document."
- Keep the answer clear and concise.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${question}
`;

  const response = await ollama.chat({
    model: CHAT_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.message.content;
}