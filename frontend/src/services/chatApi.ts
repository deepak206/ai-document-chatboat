import type {
    ChatItem,
    Message,
  } from "../types/chat";
  
  const API_URL =
    "http://localhost:5000/api";
  
  export async function getChats(): Promise<
    ChatItem[]
  > {
    const response = await fetch(
      `${API_URL}/chats`
    );
  
    if (!response.ok) {
      throw new Error(
        "Failed to load chats"
      );
    }
  
    return response.json();
  }
  
  export async function getChat(
    chatId: string
  ): Promise<ChatItem> {
    const response = await fetch(
      `${API_URL}/chats/${chatId}`
    );
  
    if (!response.ok) {
      throw new Error(
        "Failed to load chat"
      );
    }
  
    return response.json();
  }
  
  interface SendMessageResponse {
    chatId: string;
    answer: string;
    sources: Message["sources"];
  }
  
  export async function sendChatMessage(
    message: string,
    chatId: string | null
  ): Promise<SendMessageResponse> {
    const response = await fetch(
      `${API_URL}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message,
          chatId,
        }),
      }
    );
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.error ||
          "Something went wrong"
      );
    }
  
    return data;
  }