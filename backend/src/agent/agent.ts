import ollama from "ollama";

import { tools } from "./toolRegistry";

import type {
  AgentResponse,
  AgentRunResult,
  AgentStep,
} from "./types";

const CHAT_MODEL = "llama3.2:3b";

const MAX_AGENT_STEPS = 5;

/**
 * Parse the response returned by Ollama.
 *
 * Expected TOOL response:
 *
 * TOOL
 * search_documents
 * What is the leave policy?
 *
 * Expected FINAL response:
 *
 * FINAL
 * Employees receive 18 annual paid leave days.
 */
function parseAgentResponse(
  content: string
): AgentResponse {
  const cleanedContent = content.trim();

  // -----------------------------
  // FINAL RESPONSE
  // -----------------------------
  if (/^FINAL\b/i.test(cleanedContent)) {
    return {
      type: "final",
      answer: cleanedContent
        .replace(/^FINAL\s*/i, "")
        .trim(),
    };
  }

  // -----------------------------
  // TOOL CALL
  // -----------------------------
  if (/^TOOL\b/i.test(cleanedContent)) {
    const lines = cleanedContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      type: "tool",
      tool: lines[1],
      input: lines.slice(2).join(" ").trim(),
    };
  }

  // -----------------------------
  // FALLBACK
  // -----------------------------
  return {
    type: "final",
    answer: cleanedContent,
  };
}

/**
 * Build the prompt used by the agent.
 */
function buildAgentPrompt(
  userMessage: string,
  context: string
): string {
  const toolDescriptions = tools
    .map(
      (tool) =>
        `- ${tool.name}: ${tool.description}`
    )
    .join("\n");

  return `
You are GenChat, an AI document assistant.

Your job is to answer the user's question using
the available tools when necessary.

AVAILABLE TOOLS:

${toolDescriptions}

----------------------------------------

PREVIOUS TOOL RESULTS:

${context || "No tools have been used yet."}

----------------------------------------

USER QUESTION:

${userMessage}

----------------------------------------

DECISION RULES:

1. If the question requires information from
uploaded company documents, use:

TOOL
search_documents
<question>

2. If the user asks which documents are uploaded,
use:

TOOL
list_documents
<optional input>

3. If you can answer without accessing documents,
provide a final answer directly.

4. Do not invent information.

5. If a tool result contains the answer,
use that information.

6. After receiving a tool result, decide whether
another tool is necessary.

7. When you have enough information, return:

FINAL
<answer>

IMPORTANT:

Return ONLY ONE of these formats.

TOOL
tool_name
input

OR

FINAL
answer
`;
}

/**
 * Run the GenChat Agent.
 *
 * Agent flow:
 *
 * User
 *   ↓
 * Agent
 *   ↓
 * Decide whether a tool is required
 *   ↓
 * Execute tool
 *   ↓
 * Observe result
 *   ↓
 * Agent decides again
 *   ↓
 * Final answer
 */
export async function runAgent(
  userMessage: string
): Promise<AgentRunResult> {
  let context = "";

  const steps: AgentStep[] = [];

  for (
    let step = 0;
    step < MAX_AGENT_STEPS;
    step++
  ) {
    console.log(
      `\n========== AGENT STEP ${
        step + 1
      } ==========`
    );

    // ---------------------------------------
    // Build prompt
    // ---------------------------------------

    const prompt = buildAgentPrompt(
      userMessage,
      context
    );

    console.log("AGENT THINKING...");

    // ---------------------------------------
    // Ask Ollama
    // ---------------------------------------

    const response = await ollama.chat({
      model: CHAT_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      response.message.content.trim();

    console.log("AGENT RESPONSE:");
    console.log(content);

    // ---------------------------------------
    // Parse agent decision
    // ---------------------------------------

    const decision =
      parseAgentResponse(content);

    // ---------------------------------------
    // FINAL ANSWER
    // ---------------------------------------

    if (decision.type === "final") {
      console.log("\nAGENT FINISHED");

      steps.push({
        type: "final",
        message: "Answer generated",
      });

      return {
        answer: decision.answer || "",
        steps,
      };
    }

    // ---------------------------------------
    // TOOL CALL
    // ---------------------------------------

    const toolName = decision.tool;

    console.log(
      `AGENT SELECTED TOOL: ${toolName}`
    );

    // ---------------------------------------
    // Find tool
    // ---------------------------------------

    const selectedTool = tools.find(
      (tool) => tool.name === toolName
    );

    // ---------------------------------------
    // Unknown tool
    // ---------------------------------------

    if (!selectedTool) {
      console.error(
        `Unknown tool requested: ${toolName}`
      );

      steps.push({
        type: "result",
        tool: toolName,
        message: `Unknown tool: ${toolName}`,
      });

      return {
        answer: `I tried to use an unavailable tool: ${toolName}`,
        steps,
      };
    }

    // ---------------------------------------
    // Record tool activity
    // ---------------------------------------

    let activityMessage =
      "Executing tool...";

    if (
      selectedTool.name ===
      "search_documents"
    ) {
      activityMessage =
        "Searching your documents...";
    }

    if (
      selectedTool.name ===
      "list_documents"
    ) {
      activityMessage =
        "Checking uploaded documents...";
    }

    steps.push({
      type: "tool",
      tool: selectedTool.name,
      input: decision.input || "",
      message: activityMessage,
    });

    console.log(
      `EXECUTING TOOL: ${selectedTool.name}`
    );

    console.log(
      `TOOL INPUT: ${
        decision.input || ""
      }`
    );

    // ---------------------------------------
    // Execute tool
    // ---------------------------------------

    try {
      const result =
        await selectedTool.execute(
          decision.input || ""
        );

      console.log("TOOL RESULT:");
      console.log(result);

      // ---------------------------------------
      // Record result activity
      // ---------------------------------------

      let resultMessage =
        "Tool completed successfully";

      if (
        selectedTool.name ===
        "search_documents"
      ) {
        resultMessage =
          "Found relevant document information";
      }

      if (
        selectedTool.name ===
        "list_documents"
      ) {
        resultMessage =
          "Retrieved uploaded documents";
      }

      steps.push({
        type: "result",
        tool: selectedTool.name,
        message: resultMessage,
      });

      // ---------------------------------------
      // Add tool result to agent context
      // ---------------------------------------

      context += `

TOOL USED:
${selectedTool.name}

TOOL INPUT:
${decision.input || ""}

TOOL RESULT:
${JSON.stringify(
  result,
  null,
  2
)}

----------------------------------------
`;
    } catch (error: any) {
      console.error(
        `TOOL ERROR (${selectedTool.name}):`,
        error
      );

      steps.push({
        type: "result",
        tool: selectedTool.name,
        message: "Tool failed",
      });

      // Give the error to the agent so it
      // can decide what to do next.

      context += `

TOOL USED:
${selectedTool.name}

TOOL INPUT:
${decision.input || ""}

TOOL ERROR:
${
  error?.message ||
  "Unknown tool error"
}

----------------------------------------
`;
    }
  }

  // ---------------------------------------
  // Maximum step protection
  // ---------------------------------------

  console.warn(
    "Agent reached maximum number of steps."
  );

  steps.push({
    type: "final",
    message: "Agent reached maximum steps",
  });

  return {
    answer:
      "I was unable to complete the request within the allowed number of steps.",
    steps,
  };
}