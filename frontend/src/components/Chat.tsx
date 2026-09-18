import { useEffect, useRef, useState } from "react";
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

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [chats, setChats] = useState<ChatItem[]>([]);

  const [currentChatId, setCurrentChatId] =
    useState<string | null>(null);

  const [currentMessage, setCurrentMessage] =
    useState("");

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  );

  /*
   * Load previous chats
   */
  useEffect(() => {
    loadChats();
  }, []);

  /*
   * Auto scroll
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function loadChats() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chats"
      );

      const data = await response.json();

      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }

  /*
   * Load selected chat
   */
  async function loadChat(chatId: string) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chats/${chatId}`
      );

      const data = await response.json();

      setCurrentChatId(data._id);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  }

  /*
   * Start new chat
   */
  function newChat() {
    setCurrentChatId(null);
    setMessages([]);
  }

  /*
   * Send message
   */
  async function sendMessage() {
    if (!currentMessage.trim() || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    const messageToSend = currentMessage;

    setCurrentMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageToSend,
            chatId: currentChatId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      /*
       * Save the newly created chat ID
       */
      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      /*
       * Refresh sidebar
       */
      await loadChats();

    } catch (error: any) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error?.message ||
            "Something went wrong while processing your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="chat-app">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="chat-sidebar">

        <div className="sidebar-header">
          <div className="sidebar-logo">
            🤖
          </div>

          <div>
            <h2>AI Document Chat</h2>
            <span>RAG Assistant</span>
          </div>
        </div>

        <button
          className="new-chat-button"
          onClick={newChat}
        >
          <span>＋</span>
          New Chat
        </button>

        <div className="chat-history">

          <div className="history-title">
            Recent Chats
          </div>

          {chats.length === 0 ? (
            <div className="no-chats">
              No previous chats
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat._id}
                className={`chat-history-item ${
                  currentChatId === chat._id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  loadChat(chat._id)
                }
              >
                <span className="chat-icon">
                  💬
                </span>

                <span className="chat-title">
                  {chat.title}
                </span>
              </button>
            ))
          )}

        </div>

      </aside>


      {/* =========================
          MAIN CHAT
      ========================== */}

      <main className="chat-main">

        <header className="chat-header">

          <div>
            <h1>Document Assistant</h1>

            <span>
              Ask questions about your documents
            </span>
          </div>

          {currentChatId && (
            <div className="active-chat-badge">
              Chat Active
            </div>
          )}

        </header>


        {/* =========================
            MESSAGES
        ========================== */}

        <div className="messages-container">

          {messages.length === 0 ? (

            <div className="welcome-screen">

              <div className="welcome-icon">
                🤖
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>
                Ask questions about your uploaded
                company documents.
              </p>

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

            messages.map((message, index) => (

              <div
                key={index}
                className={`message-row ${message.role}`}
              >

                <div className="message-avatar">
                  {message.role === "user"
                    ? "👤"
                    : "🤖"}
                </div>

                <div className="message-content">

                  <div className="message-bubble">
                    {message.content}
                  </div>


                  {/* Sources */}

                  {message.sources &&
                    message.sources.length > 0 && (

                      <div className="sources">

                        <div className="sources-title">
                          Sources
                        </div>

                        {message.sources.map(
                          (source, sourceIndex) => (

                            <div
                              key={sourceIndex}
                              className="source-item"
                            >
                              📄 {source.filename}

                              <span>
                                Chunk{" "}
                                {source.chunkIndex}
                              </span>
                            </div>

                          )
                        )}

                      </div>

                    )}

                </div>

              </div>

            ))

          )}


          {/* Loading */}

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

          <div ref={messagesEndRef} />

        </div>


        {/* =========================
            INPUT
        ========================== */}

        <div className="input-container">

          <textarea
            value={currentMessage}
            onChange={(event) =>
              setCurrentMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your documents..."
            rows={1}
            disabled={loading}
          />

          <button
            className="send-button"
            onClick={sendMessage}
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