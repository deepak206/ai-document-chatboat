import {
    useEffect,
    useRef,
    useState,
  } from "react";
  
  import type {
    ChatItem,
    Message,
  } from "../../types/chat";
  
  import type { DocumentItem } from "../../types/document";
  
  import {
    getChats,
    getChat,
    sendAgentMessage,
  } from "../../services/chatApi";
  
  import {
    getDocuments,
    uploadDocument,
    deleteDocument
  } from "../../services/documentApi";
  
  import ChatHeader from "./ChatHeader";
  import ChatMessages from "./ChatMessages";
  import ChatInput from "./ChatInput";
  
  import Sidebar from "../Sidebar/Sidebar";
  
  function Chat() {
    const [messages, setMessages] =
      useState<Message[]>([]);
  
      const [
        deletingDocumentId,
        setDeletingDocumentId,
      ] = useState<string | null>(null);

    const [chats, setChats] =
      useState<ChatItem[]>([]);
  
    const [
      currentChatId,
      setCurrentChatId,
    ] = useState<string | null>(null);
  
    const [documents, setDocuments] =
      useState<DocumentItem[]>([]);
  
    const [loading, setLoading] =
      useState(false);
  
    const [uploading, setUploading] =
      useState(false);
  
    const [sidebarOpen, setSidebarOpen] =
      useState(false);
  
    const messagesEndRef =
      useRef<HTMLDivElement | null>(
        null
      );
  
    // ---------------------------------------
    // Load initial data
    // ---------------------------------------
  
    useEffect(() => {
      loadInitialData();
    }, []);
  
    // ---------------------------------------
    // Auto scroll
    // ---------------------------------------
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView(
        {
          behavior: "smooth",
        }
      );
    }, [messages, loading]);

    async function handleDeleteDocument(
        documentId: string
      ) {
        const document = documents.find(
          (item) => item._id === documentId
        );
      
        if (!document) return;
      
        const confirmed = window.confirm(
          `Delete "${document.filename}"?\n\nThis will also delete its document chunks and embeddings.`
        );
      
        if (!confirmed) return;
      
        try {
          setDeletingDocumentId(documentId);
      
          await deleteDocument(documentId);
      
          setDocuments((current) =>
            current.filter(
              (item) => item._id !== documentId
            )
          );
        } catch (error: any) {
          alert(
            error?.message ||
              "Failed to delete document"
          );
        } finally {
          setDeletingDocumentId(null);
        }
      }
  
    // ---------------------------------------
    // Initial data
    // ---------------------------------------
  
    async function loadInitialData() {
      try {
        const [
          chatData,
          documentData,
        ] = await Promise.all([
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
  
    // ---------------------------------------
    // Load chat
    // ---------------------------------------
  
    async function loadChat(
        chatId: string
      ) {
        try {
          const chat =
            await getChat(chatId);
      
          setCurrentChatId(chat._id);
      
          setMessages(
            chat.messages || []
          );
      
          setSidebarOpen(false);
        } catch (error: any) {
          console.error(
            "LOAD CHAT ERROR:",
            error
          );
      
          alert(
            error?.message ||
              "Failed to load chat"
          );
        }
      }
  
  
    // ---------------------------------------
    // Send message to Agent
    // ---------------------------------------
  
    async function handleSend(
      message: string
    ) {
      const userMessage: Message = {
        role: "user",
        content: message,
      };
  
      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );
  
      setLoading(true);
  
      try {
        const data =
          await sendAgentMessage(
            message
          );
  
        // -----------------------------------
        // Add AI response
        // -----------------------------------
  
        setMessages(
          (previous) => [
            ...previous,
            {
              role: "assistant",
              content: data.answer,
              agentSteps:
                data.steps,
            },
          ]
        );
  
        // Refresh chat list.
        //
        // This is kept here for compatibility
        // with the existing chat system.
        const updatedChats =
          await getChats();
  
        setChats(updatedChats);
      } catch (error: any) {
        console.error(
          "Agent request failed:",
          error
        );
  
        setMessages(
          (previous) => [
            ...previous,
            {
              role: "assistant",
              content:
                error?.message ||
                "Something went wrong while processing your request.",
            },
          ]
        );
      } finally {
        setLoading(false);
      }
    }
  
    // ---------------------------------------
    // Upload document
    // ---------------------------------------
  
    async function handleUpload(
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      const file =
        event.target.files?.[0];
  
      if (!file) {
        return;
      }
  
      if (
        !file.name
          .toLowerCase()
          .endsWith(".pdf")
      ) {
        alert(
          "Please select a PDF file."
        );
  
        event.target.value = "";
  
        return;
      }
  
      setUploading(true);
  
      try {
        await uploadDocument(file);
  
        const updatedDocuments =
          await getDocuments();
  
        setDocuments(
          updatedDocuments
        );
  
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

      async function handleNewChat() {
        setCurrentChatId(null);
        setMessages([]);
        setSidebarOpen(false);
      }
  
    // ---------------------------------------
    // UI
    // ---------------------------------------
  
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gray-100 text-gray-900">
        <Sidebar
            chats={chats}
            documents={documents}
            currentChatId={currentChatId}
            uploading={uploading}
            deletingDocumentId={deletingDocumentId}
            isOpen={sidebarOpen}
            onNewChat={handleNewChat}
            onChatSelect={loadChat}
            onUpload={handleUpload}
            onDeleteDocument={handleDeleteDocument}
            onClose={() => setSidebarOpen(false)}
            />
  
        <main className="flex min-w-0 flex-1 flex-col bg-gray-100">
          <ChatHeader
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />
  
          <ChatMessages
            messages={messages}
            loading={loading}
            onSuggestionSelect={
              handleSend
            }
          />
  
          <div
            ref={messagesEndRef}
          />
  
          <ChatInput
            loading={loading}
            onSend={handleSend}
          />
        </main>
      </div>
    );
  }
  
  export default Chat;