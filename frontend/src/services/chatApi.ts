import type {
    ChatItem,
    AgentStep,
  } from "../types/chat";
  
  const API_URL = "http://localhost:5000/api";
  
  // ---------------------------------------
  // Get all chats
  // ---------------------------------------
  
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
  
  // ---------------------------------------
  // Get single chat
  // ---------------------------------------
  
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
  
  // ---------------------------------------
  // Existing chat API
  // ---------------------------------------
  
  interface SendMessageResponse {
    chatId: string;
    answer: string;
    sources?: {
      filename: string;
      chunkIndex: number;
      score: number;
    }[];
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chatId,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.error ||
          "Something went wrong"
      );
    }
  
    return data;
  }
  
  // ---------------------------------------
  // Agent API
  // ---------------------------------------
  
  export interface AgentResponse {
    answer: string;
    steps: AgentStep[];
  }
  
  export async function sendAgentMessage(
    message: string
  ): Promise<AgentResponse> {
    const response = await fetch(
      `${API_URL}/agent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.error ||
          "Agent request failed"
      );
    }
  
    return data;
  }