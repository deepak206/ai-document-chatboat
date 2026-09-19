import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Chat.css";

interface Source {
  filename: string;
  chunkIndex: number;
  score: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface ChatItem {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

interface DocumentItem {
  _id: string;
  filename: string;
  pages: number;
  chunkCount: number;
  status:
    | "processing"
    | "ready"
    | "failed";
  uploadedAt: string;
}

function Chat() {
  /*
  ========================================
  CHAT STATE
  ========================================
  */

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [chats, setChats] =
    useState<ChatItem[]>([]);

  const [currentChatId, setCurrentChatId] =
    useState<string | null>(null);

  const [currentMessage, setCurrentMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  ========================================
  DOCUMENT STATE
  ========================================
  */

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [uploading, setUploading] =
    useState(false);

  /*
  ========================================
  REFS
  ========================================
  */

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /*
  ========================================
  LOAD DATA WHEN COMPONENT STARTS
  ========================================
  */

  useEffect(() => {
    loadChats();
    loadDocuments();
  }, []);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
  ========================================
  LOAD CHATS
  ========================================
  */

  async function loadChats() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chats"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load chats"
        );
      }

      const data = await response.json();

      setChats(data);
    } catch (error) {
      console.error(
        "Failed to load chats:",
        error
      );
    }
  }

  /*
  ========================================
  LOAD DOCUMENTS
  ========================================
  */

  async function loadDocuments() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/documents"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load documents"
        );
      }

      const data = await response.json();

      setDocuments(data);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );
    }
  }

  /*
  ========================================
  LOAD SINGLE CHAT
  ========================================
  */

  async function loadChat(
    chatId: string
  ) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chats/${chatId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load chat"
        );
      }

      const data = await response.json();

      setCurrentChatId(data._id);

      setMessages(
        data.messages || []
      );
    } catch (error) {
      console.error(
        "Failed to load chat:",
        error
      );
    }
  }

  /*
  ========================================
  NEW CHAT
  ========================================
  */

  function newChat() {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentMessage("");
  }

  /*
  ========================================
  UPLOAD DOCUMENT
  ========================================
  */

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    ------------------------------
    Validate PDF
    ------------------------------
    */

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      alert(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }

    /*
    ------------------------------
    Create FormData
    ------------------------------
    */

    const formData =
      new FormData();

    formData.append(
      "document",
      file
    );

    setUploading(true);

    try {
      /*
      ------------------------------
      Upload PDF
      ------------------------------
      */

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      /*
      ------------------------------
      Handle API Error
      ------------------------------
      */

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload document"
        );
      }

      console.log(
        "Document uploaded:",
        data
      );

      /*
      ------------------------------
      Refresh documents
      ------------------------------
      */

      await loadDocuments();

      alert(
        "Document uploaded successfully!"
      );
    } catch (error: any) {
      console.error(
        "Upload error:",
        error
      );

      alert(
        error?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);

      /*
      Allow selecting
      the same file again
      */

      event.target.value = "";
    }
  }

  /*
  ========================================
  SEND MESSAGE
  ========================================
  */

  async function sendMessage() {
    if (
      !currentMessage.trim() ||
      loading
    ) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
    };

    /*
    ------------------------------
    Show user message immediately
    ------------------------------
    */

    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ]
    );

    const messageToSend =
      currentMessage;

    setCurrentMessage("");

    setLoading(true);

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message:
                messageToSend,

              chatId:
                currentChatId,
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

      /*
      ------------------------------
      Save chat ID
      ------------------------------
      */

      if (
        !currentChatId &&
        data.chatId
      ) {
        setCurrentChatId(
          data.chatId
        );
      }

      /*
      ------------------------------
      Assistant message
      ------------------------------
      */

      const assistantMessage: Message =
        {
          role: "assistant",

          content:
            data.answer,

          sources:
            data.sources,
        };

      setMessages(
        (previous) => [
          ...previous,
          assistantMessage,
        ]
      );

      /*
      ------------------------------
      Refresh chat history
      ------------------------------
      */

      await loadChats();
    } catch (error: any) {
      console.error(
        "Chat error:",
        error
      );

      setMessages(
        (previous) => [
          ...previous,
          {
            role: "assistant",

            content:
              error?.message ||
              "Something went wrong while processing your question.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  ========================================
  KEYBOARD HANDLER
  ========================================
  */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <div className="chat-app">

      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside className="chat-sidebar">

        {/* ================================
            SIDEBAR HEADER
        ================================= */}

        <div className="sidebar-header">

          <div className="sidebar-logo">
            🤖
          </div>

          <div>
            <h2>
              AI Document Chat
            </h2>

            <span>
              RAG Assistant
            </span>
          </div>

        </div>

        {/* ================================
            NEW CHAT
        ================================= */}

        <button
          className="new-chat-button"
          onClick={newChat}
        >
          <span>＋</span>

          New Chat
        </button>

        {/* ================================
            CHAT HISTORY
        ================================= */}

        <div className="chat-history">

          <div className="history-title">
            Recent Chats
          </div>

          {chats.length === 0 ? (
            <div className="no-chats">
              No previous chats
            </div>
          ) : (
            chats.map(
              (chat) => (
                <button
                  key={
                    chat._id
                  }
                  className={`chat-history-item ${
                    currentChatId ===
                    chat._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    loadChat(
                      chat._id
                    )
                  }
                >

                  <span className="chat-icon">
                    💬
                  </span>

                  <span className="chat-title">
                    {chat.title}
                  </span>

                </button>
              )
            )
          )}

        </div>

        {/* ================================
            DOCUMENTS
        ================================= */}

        <div className="documents-section">

          <div className="history-title">
            Documents
          </div>

          {documents.length ===
          0 ? (
            <div className="no-documents">
              No documents uploaded
            </div>
          ) : (
            documents.map(
              (document) => (
                <div
                  key={
                    document._id
                  }
                  className="document-item"
                >

                  <span className="document-icon">
                    📄
                  </span>

                  <div className="document-info">

                    <span className="document-name">
                      {
                        document.filename
                      }
                    </span>

                    <span className="document-meta">
                      {
                        document.pages
                      }{" "}
                      pages ·{" "}
                      {
                        document.chunkCount
                      }{" "}
                      chunks
                    </span>

                    <span
                      className={`document-status ${document.status}`}
                    >
                      ●{" "}
                      {
                        document.status
                      }
                    </span>

                  </div>

                </div>
              )
            )
          )}

          {/* ================================
              UPLOAD BUTTON
          ================================= */}

          <label
            htmlFor="document-upload"
            className={`upload-document-button ${
              uploading
                ? "uploading"
                : ""
            }`}
          >

            <span>
              {uploading
                ? "⏳"
                : "＋"}
            </span>

            {uploading
              ? "Uploading..."
              : "Upload PDF"}

          </label>

          <input
            id="document-upload"
            type="file"
            accept="application/pdf"
            onChange={
              handleFileUpload
            }
            disabled={uploading}
            hidden
          />

        </div>

      </aside>

      {/* ==================================
          MAIN CHAT
      ================================== */}

      <main className="chat-main">

        {/* ================================
            HEADER
        ================================= */}

        <header className="chat-header">

          <div>

            <h1>
              Document Assistant
            </h1>

            <span>
              Ask questions about
              your documents
            </span>

          </div>

          {currentChatId && (
            <div className="active-chat-badge">
              Chat Active
            </div>
          )}

        </header>

        {/* ================================
            MESSAGES
        ================================= */}

        <div className="messages-container">

          {messages.length ===
          0 ? (
            <div className="welcome-screen">

              <div className="welcome-icon">
                🤖
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>
                Ask questions about
                your uploaded company
                documents.
              </p>

              {/* ==========================
                  SUGGESTIONS
              =========================== */}

              <div className="suggestions">

                <button
                  onClick={() =>
                    setCurrentMessage(
                      "How many annual paid leave days do employees get?"
                    )
                  }
                >
                  📅 Leave policy
                </button>

                <button
                  onClick={() =>
                    setCurrentMessage(
                      "What are the company working hours?"
                    )
                  }
                >
                  🕐 Working hours
                </button>

                <button
                  onClick={() =>
                    setCurrentMessage(
                      "What technologies does the company use?"
                    )
                  }
                >
                  💻 Technology stack
                </button>

              </div>

            </div>
          ) : (
            messages.map(
              (
                message,
                index
              ) => (

                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >

                  <div className="message-avatar">
                    {message.role ===
                    "user"
                      ? "👤"
                      : "🤖"}
                  </div>

                  <div className="message-content">

                    <div className="message-bubble">
                      {
                        message.content
                      }
                    </div>

                    {/* ======================
                        SOURCES
                    ======================= */}

                    {message.sources &&
                      message.sources
                        .length >
                        0 && (

                        <div className="sources">

                          <div className="sources-title">
                            Sources
                          </div>

                          {message.sources.map(
                            (
                              source,
                              sourceIndex
                            ) => (

                              <div
                                key={
                                  sourceIndex
                                }
                                className="source-item"
                              >

                                📄{" "}
                                {
                                  source.filename
                                }

                                <span>
                                  Chunk{" "}
                                  {
                                    source.chunkIndex
                                  }
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      )}

                  </div>

                </div>

              )
            )
          )}

          {/* ================================
              TYPING INDICATOR
          ================================= */}

          {loading && (

            <div className="message-row assistant">

              <div className="message-avatar">
                🤖
              </div>

              <div className="message-content">

                <div className="typing-indicator">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            </div>

          )}

          <div
            ref={
              messagesEndRef
            }
          />

        </div>

        {/* ================================
            MESSAGE INPUT
        ================================= */}

        <div className="input-container">

          <textarea
            value={
              currentMessage
            }
            onChange={(
              event
            ) =>
              setCurrentMessage(
                event.target
                  .value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Ask something about your documents..."
            rows={1}
            disabled={loading}
          />

          <button
            className="send-button"
            onClick={
              sendMessage
            }
            disabled={
              loading ||
              !currentMessage.trim()
            }
          >
            ➤
          </button>

        </div>

      </main>

    </div>
  );
}

export default Chat;