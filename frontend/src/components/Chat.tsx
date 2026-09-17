import { useEffect, useRef, useState } from "react";
import "./Chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocumentInfo {
  filename: string;
  pages: number;
  text: string;
}

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // -----------------------------
  // Upload PDF
  // -----------------------------
  const uploadDocument = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();

    formData.append("document", file);

    setUploading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const data = await response.json();

      setDocument({
        filename: data.filename,
        pages: data.pages,
        text: data.text,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `📄 "${data.filename}" uploaded successfully. I found ${data.pages} page(s). You can now ask questions about the document.`,
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process that document. Please try again.",
        },
      ]);
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  // -----------------------------
  // Send Chat Message
  // -----------------------------
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
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
            message: currentMessage,

            // Send document text if a document exists
            documentText: document?.text || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.answer ||
          "I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Open File Picker
  // -----------------------------
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="chat-app">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <header className="chat-header">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h1>AI Assistant</h1>

            <span>
              <span className="online-dot"></span>
              Online
            </span>
          </div>

        </div>

        <button
          className="header-button"
          title="More options"
        >
          ⋮
        </button>

      </header>


      {/* -------------------------------- */}
      {/* Chat Area */}
      {/* -------------------------------- */}

      <main className="chat-body">

        {messages.length === 0 ? (

          <div className="welcome">

            <div className="welcome-icon">
              ✦
            </div>

            <h2>
              How can I help you today?
            </h2>

            <p>
              Ask me anything or upload a PDF
              to start chatting with your
              AI assistant.
            </p>


            {/* Document Upload */}

            <button
              className="upload-card"
              onClick={handleAttachClick}
              disabled={uploading}
            >

              <span className="upload-icon">
                📄
              </span>

              <span>
                {uploading
                  ? "Processing document..."
                  : "Upload a PDF document"}
              </span>

            </button>


            {/* Suggestions */}

            <div className="suggestions">

              <button
                onClick={() =>
                  setMessage(
                    "Explain Generative AI in simple terms"
                  )
                }
              >
                💡 Explain Generative AI
              </button>

              <button
                onClick={() =>
                  setMessage(
                    "What can you help me with?"
                  )
                }
              >
                🚀 What can you help me with?
              </button>

              <button
                onClick={() =>
                  setMessage(
                    "Give me some project ideas"
                  )
                }
              >
                🧠 Give me project ideas
              </button>

            </div>

          </div>

        ) : (

          <div className="messages">

            {/* Document badge */}

            {document && (

              <div className="document-badge">

                <div className="document-icon">
                  📄
                </div>

                <div className="document-info">

                  <strong>
                    {document.filename}
                  </strong>

                  <span>
                    {document.pages} page
                    {document.pages !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

                <button
                  className="remove-document"
                  onClick={() => setDocument(null)}
                  title="Remove document"
                >
                  ×
                </button>

              </div>

            )}


            {/* Messages */}

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`message-row ${msg.role}`}
              >

                {msg.role === "assistant" && (

                  <div className="avatar ai-avatar">
                    ✦
                  </div>

                )}


                <div className="message-content">

                  <div className="message-name">
                    {msg.role === "user"
                      ? "You"
                      : "AI Assistant"}
                  </div>

                  <div className="message-bubble">
                    {msg.content}
                  </div>

                </div>


                {msg.role === "user" && (

                  <div className="avatar user-avatar">
                    You
                  </div>

                )}

              </div>

            ))}


            {/* Loading */}

            {loading && (

              <div className="message-row assistant">

                <div className="avatar ai-avatar">
                  ✦
                </div>

                <div className="message-content">

                  <div className="message-name">
                    AI Assistant
                  </div>

                  <div className="message-bubble typing">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

        )}

      </main>


      {/* -------------------------------- */}
      {/* Input Footer */}
      {/* -------------------------------- */}

      <footer className="chat-footer">

        {/* Hidden file input */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
          onChange={uploadDocument}
        />


        <div className="input-container">

          <button
            className="attach-button"
            title="Attach PDF"
            onClick={handleAttachClick}
            disabled={uploading}
          >
            📎
          </button>


          <textarea
            value={message}
            placeholder={
              document
                ? "Ask something about your document..."
                : "Message AI Assistant..."
            }
            rows={1}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }

            }}
          />


          <button
            className="send-button"
            onClick={sendMessage}
            disabled={
              !message.trim() ||
              loading ||
              uploading
            }
          >
            ➤
          </button>

        </div>


        <p className="footer-text">
          AI can make mistakes. Check important
          information.
        </p>

      </footer>

    </div>
  );
}

export default Chat;

