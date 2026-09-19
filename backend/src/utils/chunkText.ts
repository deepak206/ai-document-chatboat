export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlapSentences: number = 1
): string[] {
  if (!text || !text.trim()) {
    return [];
  }

  // Normalize whitespace
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  // Split document into paragraphs
  const paragraphs = normalizedText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  let currentSentences: string[] = [];

  for (const paragraph of paragraphs) {
    // Split paragraph into sentences
    const sentences = paragraph
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || [];

    for (const sentence of sentences) {
      const currentText =
        currentSentences.join(" ");

      const newText = currentText
        ? `${currentText} ${sentence}`
        : sentence;

      // If adding this sentence exceeds the limit,
      // save the current chunk first.
      if (
        currentText &&
        newText.length > maxChunkSize
      ) {
        chunks.push(currentText);

        // Keep the last few sentences for overlap
        currentSentences =
          currentSentences.slice(
            -overlapSentences
          );

        currentSentences.push(sentence);
      } else {
        currentSentences.push(sentence);
      }
    }
  }

  // Add remaining sentences
  if (currentSentences.length > 0) {
    chunks.push(
      currentSentences.join(" ")
    );
  }

  return chunks;
}
