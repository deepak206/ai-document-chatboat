# 🤖 AI Document Chatbot

An AI-powered document chatbot built with **React, TypeScript, Node.js, Express, and OpenAI**.

The project allows users to upload a PDF document and ask questions about its contents through a modern chat interface. The current implementation extracts text from uploaded PDFs and uses that content as context for AI-generated answers. The next stage is to evolve this into a complete **RAG (Retrieval-Augmented Generation)** pipeline.

## ✨ Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDFs
- 💬 Modern interactive chat interface
- 🤖 Ask questions about uploaded documents
- 🧠 Document-grounded AI answers
- 🚫 Avoid inventing information not present in the document
- ⚡ React + Vite frontend
- 🚀 Node.js + Express backend
- 🔐 Environment-based OpenAI API configuration
- 🧩 Architecture prepared for RAG

## 🏗️ Current Architecture

```text
React + TypeScript
        │
        │ HTTP / JSON / FormData
        ▼
Node.js + Express
        │
   ┌────┴────┐
   ▼         ▼
PDF Parser  OpenAI API
   │         │
   └────┬────┘
        ▼
   AI-generated
      Answer
```

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- TypeScript
- Multer
- pdf-parse
- CORS
- dotenv

### AI
- OpenAI API

### Planned
- Embeddings
- Vector database
- Semantic search
- RAG pipeline
- MongoDB / vector search
- Document and conversation persistence

## 📁 Project Structure

```text
ai-document-chat/
│
├── backend/
│   ├── src/
│   │   ├── utils/
│   │   │   └── chunkText.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   └── Chat.css
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## ⚙️ Prerequisites

Install:

- Node.js (current LTS recommended)
- npm
- OpenAI API key

Check versions:

```bash
node -v
npm -v
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-document-chat
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create:

```text
backend/.env
```

Add:

```env
OPENAI_API_KEY=your_openai_api_key
```

**Never commit `.env` to Git.**

### 4. Start the backend

From the `backend` folder:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 📄 Using the Chatbot

1. Open the frontend.
2. Upload a PDF document.
3. Wait for the document to be processed.
4. Ask a question about the document.
5. The backend sends the document context and question to the AI.
6. The chatbot returns an answer based on the document.

Example:

```text
Question:
How many annual paid leave days do employees receive?

Answer:
Employees receive 18 annual paid leave days.
```

If the document does not contain the requested information, the chatbot should indicate that it could not find the information in the uploaded document.

## 🔌 API Endpoints

### Health Check

```http
GET /
```

Example response:

```json
{
  "message": "AI Document Chat API is running"
}
```

### Upload Document

```http
POST /api/upload
```

Content type:

```text
multipart/form-data
```

Form field:

```text
document
```

The endpoint receives the PDF, extracts its text, and returns document information.

Example response:

```json
{
  "message": "Document uploaded successfully",
  "filename": "company-handbook.pdf",
  "pages": 10,
  "text": "..."
}
```

### Chat

```http
POST /api/chat
```

Example request:

```json
{
  "message": "What are the company's working hours?",
  "documentText": "..."
}
```

Example response:

```json
{
  "answer": "The company's working hours are 9:30 AM to 6:30 PM, Monday through Friday."
}
```

## 🧠 RAG Roadmap

### Current implementation

```text
PDF
 ↓
Extract Text
 ↓
Send Document Text + Question
 ↓
OpenAI
 ↓
Answer
```

### Target RAG implementation

```text
PDF
 ↓
Extract Text
 ↓
Chunk Document
 ↓
Generate Embeddings
 ↓
Store Embeddings
 ↓
User Question
 ↓
Generate Question Embedding
 ↓
Semantic Similarity Search
 ↓
Retrieve Relevant Chunks
 ↓
OpenAI
 ↓
Answer
```

### Development Checklist

- [x] React chat interface
- [x] Node.js / Express backend
- [x] OpenAI API integration
- [x] PDF upload
- [x] PDF text extraction
- [x] Document-aware chat
- [x] Basic text chunking
- [ ] Generate document embeddings
- [ ] Store embeddings
- [ ] Implement semantic similarity search
- [ ] Retrieve top relevant chunks
- [ ] Build complete RAG pipeline
- [ ] Add MongoDB / vector search
- [ ] Store documents
- [ ] Store chat history
- [ ] Improve document processing
- [ ] Add authentication
- [ ] Deploy frontend and backend

## 🔐 Security

Never expose your OpenAI API key in the React frontend.

Use:

```text
Frontend
   ↓
Backend
   ↓
OpenAI API
```

Keep the API key in:

```text
backend/.env
```

Recommended `.gitignore`:

```gitignore
node_modules/
.env
dist/
```

## 🧪 Suggested Test Questions

After uploading a company handbook, try:

```text
What is NovaTech Solutions?
```

```text
What are the company's working hours?
```

```text
How many annual paid leave days do employees receive?
```

```text
How many sick leave days are provided?
```

```text
What is the remote work policy?
```

```text
What technologies does the company use?
```

Also test something that is not in the PDF:

```text
Who is the CEO?
```

The chatbot should not invent an answer.

## 🎯 Learning Objectives

This project is designed as a hands-on Generative AI learning project.

You will learn:

- LLM API integration
- AI application architecture
- PDF document processing
- Text chunking
- Embeddings
- Vector similarity
- Semantic search
- Retrieval-Augmented Generation (RAG)
- Vector databases
- Prompt design
- Full-stack AI development
- Production considerations for AI applications

## 🚧 Future Improvements

Potential enhancements:

- Multiple document uploads
- Drag-and-drop PDF upload
- Document library
- Streaming AI responses
- Conversation history
- Source citations
- Source-text highlighting
- Authentication
- User-specific document collections
- MongoDB persistence
- Vector search
- Cloud deployment
- Rate limiting
- File validation
- Improved error handling
- Logging and observability

## 📌 Project Goal

The goal is to evolve this project from a simple **PDF + LLM chatbot** into a production-style **Generative AI Document Assistant** using Retrieval-Augmented Generation.

```text
              AI DOCUMENT ASSISTANT
                       │
          ┌────────────┴────────────┐
          │                         │
      Documents                  Chat UI
          │                         │
      Chunking                   Questions
          │                         │
     Embeddings                      │
          │                         │
    Vector Search ◄─────────────────┘
          │
    Relevant Context
          │
        LLM API
          │
        Answer
```

## 👨‍💻 Author

**Deepak Mankotia**

Full-Stack Developer | Generative AI | React | TypeScript | Node.js

---

⭐ If you find this project useful, consider giving the repository a star.
