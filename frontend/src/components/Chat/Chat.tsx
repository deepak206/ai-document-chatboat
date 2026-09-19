import { useEffect, useRef, useState } from "react";

import type { ChatItem, Message } from "../../types/chat";
import type { DocumentItem } from "../../types/document";

import {
  getChats,
  getChat,
  sendChatMessage,
} from "../../services/chatApi";

import {
  getDocuments,
  uploadDocument,
} from "../../services/documentApi";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import Sidebar from "../Sidebar/Sidebar";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [currentChatId, setCurrentChatId] =
    useState<string | null>(null);

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function loadInitialData() {
    try {
      const [chatData, documentData] =
        await Promise.all([
          getChats(),
          getDocuments(),
        ]);

      setChats(chatData);
      setDocuments(documentData);
    } catch (error) {
      console.error(
        "Failed to load initial data:",
        error
      );
    }
  }

  async function loadChat(chatId: string) {
    try {
      const chat = await getChat(chatId);

      setCurrentChatId(chat._id);
      setMessages(chat.messages || []);
      setSidebarOpen(false);
    } catch (error) {
      console.error(
        "Failed to load chat:",
        error
      );
    }
  }

  function newChat() {
    setCurrentChatId(null);
    setMessages([]);
    setSidebarOpen(false);
  }

  async function handleSend(message: string) {
    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setLoading(true);

    try {
      const data = await sendChatMessage(
        message,
        currentChatId
      );

      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);

      const updatedChats = await getChats();

      setChats(updatedChats);
    } catch (error: any) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error?.message ||
            "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      await uploadDocument(file);

      const updatedDocuments =
        await getDocuments();

      setDocuments(updatedDocuments);

      alert(
        "Document uploaded successfully!"
      );
    } catch (error: any) {
      alert(
        error?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 text-gray-900">

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        documents={documents}
        currentChatId={currentChatId}
        uploading={uploading}
        isOpen={sidebarOpen}
        onNewChat={newChat}
        onChatSelect={loadChat}
        onUpload={handleUpload}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col bg-gray-100">

        <ChatHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <ChatMessages
          messages={messages}
          loading={loading}
          onSuggestionSelect={handleSend}
        />

        <div ref={messagesEndRef} />

        <ChatInput
          loading={loading}
          onSend={handleSend}
        />

      </main>

    </div>
  );
}

export default Chat;