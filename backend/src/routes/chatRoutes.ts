import { Router } from "express";

import {
  createChat,
  getAllChats,
  getChatById,
  addMessageToChat,
  deleteChat,
} from "../services/chatRepository";

import { searchSimilarChunks } from "../services/searchService";
import { generateAnswer } from "../services/ollamaService";

const router = Router();

/*
 * CREATE NEW CHAT
 * POST /api/chats
 */
router.post("/chats", async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await createChat(
      title || "New Chat"
    );

    res.status(201).json(chat);
  } catch (error: any) {
    console.error("CREATE CHAT ERROR:", error);

    res.status(500).json({
      error: error?.message || "Failed to create chat",
    });
  }
});


/*
 * GET ALL CHATS
 * GET /api/chats
 */
router.get("/chats", async (req, res) => {
  try {
    const chats = await getAllChats();

    res.json(chats);
  } catch (error: any) {
    console.error("GET CHATS ERROR:", error);

    res.status(500).json({
      error: error?.message || "Failed to get chats",
    });
  }
});


/*
 * GET SINGLE CHAT
 * GET /api/chats/:id
 */
router.get("/chats/:id", async (req, res) => {
  try {
    const chat = await getChatById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error: any) {
    console.error("GET CHAT ERROR:", error);

    res.status(500).json({
      error: error?.message || "Failed to get chat",
    });
  }
});


/*
 * CHAT WITH DOCUMENT
 * POST /api/chat
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("User question:", message);

    /*
     * If chatId doesn't exist,
     * create a new chat.
     */
    let currentChatId = chatId;

    if (!currentChatId) {
      const newChat = await createChat(
        message.substring(0, 40)
      );

      currentChatId = newChat._id.toString();

      console.log(
        "Created new chat:",
        currentChatId
      );
    }

    /*
     * Save user message
     */
    await addMessageToChat(
      currentChatId,
      "user",
      message
    );

    /*
     * RAG SEARCH
     */
    const relevantChunks =
      await searchSimilarChunks(message, 3);

    console.log(
      "Relevant chunks found:",
      relevantChunks.length
    );

    const context = relevantChunks
      .map((chunk, index) => {
        return `
SOURCE ${index + 1}
File: ${chunk.filename}
Chunk: ${chunk.chunkIndex}

${chunk.text}
`;
      })
      .join("\n--------------------\n");

    /*
     * Generate AI answer
     */
    const answer = await generateAnswer(
      context,
      message
    );

    /*
     * Save assistant response
     */
    await addMessageToChat(
      currentChatId,
      "assistant",
      answer
    );

    /*
     * Return response
     */
    res.json({
      chatId: currentChatId,
      answer,
      sources: relevantChunks.map((chunk) => ({
        filename: chunk.filename,
        chunkIndex: chunk.chunkIndex,
        score: chunk.score,
      })),
    });

  } catch (error: any) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Something went wrong while processing the question",
    });
  }
});


/*
 * DELETE CHAT
 * DELETE /api/chats/:id
 */
router.delete("/chats/:id", async (req, res) => {
  try {
    const deletedChat = await deleteChat(
      req.params.id
    );

    if (!deletedChat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    res.json({
      message: "Chat deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE CHAT ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Failed to delete chat",
    });
  }
});


export default router;