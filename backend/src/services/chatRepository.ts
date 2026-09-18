import { ChatSession } from "../models/ChatSession";

export async function createChat(title: string = "New Chat") {
  const chat = await ChatSession.create({
    title,
    messages: [],
  });

  return chat;
}

export async function getAllChats() {
  return ChatSession.find()
    .sort({ updatedAt: -1 })
    .select("_id title createdAt updatedAt")
    .lean();
}

export async function getChatById(chatId: string) {
  return ChatSession.findById(chatId).lean();
}

export async function addMessageToChat(
  chatId: string,
  role: "user" | "assistant",
  content: string
) {
  return ChatSession.findByIdAndUpdate(
    chatId,
    {
      $push: {
        messages: {
          role,
          content,
          createdAt: new Date(),
        },
      },
    },
    {
      new: true,
    }
  ).lean();
}

export async function deleteChat(chatId: string) {
  return ChatSession.findByIdAndDelete(chatId);
}