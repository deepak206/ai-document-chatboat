# 🤖 AI Document Chatbot

An AI-powered document chatbot built with **React, TypeScript, Node.js,
Express, Ollama, and MongoDB**.

The application allows users to upload PDF documents and ask questions
about their contents through a modern chat interface. The project is
being developed step by step into a complete **RAG (Retrieval-Augmented
Generation)** application using local AI models with Ollama.

------------------------------------------------------------------------

## ✨ Features

-   📄 Upload PDF documents
-   🔍 Extract text from PDFs
-   ✂️ Split documents into smaller chunks
-   🧠 Generate embeddings using Ollama
-   💾 Store chunks and embeddings in MongoDB
-   🔎 Semantic similarity search
-   💬 Modern interactive chat interface
-   🤖 Local AI responses using Ollama
-   🚫 Avoid answers that are not supported by document context
-   ⚡ React + Vite frontend
-   🚀 Node.js + Express backend
-   🧩 Modular backend architecture
-   🔐 Environment-based configuration

------------------------------------------------------------------------

## 🏗️ Current Architecture

``` text
                         React + TypeScript
                                │
                                │ HTTP
                                ▼
                         Node.js + Express
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
       documentRoutes.ts                  chatRoutes.ts
                │                               │
                ▼                               ▼
          PDF Processing                 searchService.ts
                │                               │
                ▼                               ▼
           Text Chunks                   Question Embedding
                │                               │
                ▼                               ▼
      Ollama Embedding Model                  MongoDB
                │                               │
                ▼                               ▼
             Embeddings                  Relevant Chunks
                │                               │
                └───────────────┬───────────────┘
                                ▼
                         Ollama Chat Model
                                │
                                ▼
                             Answer
```

------------------------------------------------------------------------

## 🧠 RAG Flow

The application follows the Retrieval-Augmented Generation pattern:

``` text
PDF
 ↓
Extract Text
 ↓
Chunk Text
 ↓
Generate Embeddings with Ollama
 ↓
Store Chunks + Embeddings in MongoDB
 ↓
                         User Question
                                ↓
                    Generate Question Embedding
                                ↓
                       Similarity Search
                                ↓
                      Relevant PDF Chunks
                                ↓
                       Build Context
                                ↓
                       Ollama Chat Model
                                ↓
                             Answer
```

The important idea is that the complete PDF does not need to be sent to
the LLM for every question. The application first retrieves the most
relevant chunks and then provides those chunks as context to the local
chat model.

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   CSS
-   Fetch API

### Backend

-   Node.js
-   Express.js
-   TypeScript
-   Multer
-   pdf-parse
-   CORS
-   dotenv
-   Mongoose

### AI

-   Ollama
-   Chat model: `llama3.2:3b`
-   Embedding model: `nomic-embed-text`

> If you use different Ollama models locally, update the model names in
> the backend configuration.

### Database

-   MongoDB
-   Mongoose

### RAG Concepts

-   Text chunking
-   Embeddings
-   Vector representations
-   Cosine similarity
-   Semantic search
-   Retrieval-Augmented Generation (RAG)

------------------------------------------------------------------------

## 📁 Project Structure

``` text
ai-document-chat/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── models/
│   │   │   └── DocumentChunk.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── chatRoutes.ts
│   │   │   └── documentRoutes.ts
│   │   │
│   │   ├── services/
│   │   │   ├── documentRepository.ts
│   │   │   ├── embeddingService.ts
│   │   │   ├── ollamaService.ts
│   │   │   └── searchService.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── chunkText.ts
│   │   │   └── similarity.ts
│   │   │
│   │   └── server.ts
│   │
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

------------------------------------------------------------------------

## ⚙️ Prerequisites

Install the following:

-   Node.js
-   npm
-   Ollama
-   MongoDB Atlas account or local MongoDB

Check Node.js and npm:

``` bash
node -v
npm -v
```

Check Ollama:

``` bash
ollama --version
```

------------------------------------------------------------------------

## 🦙 Ollama Setup

This project uses Ollama for local AI inference instead of OpenAI's
cloud API.

Check installed models:

``` bash
ollama list
```

Install the embedding model:

``` bash
ollama pull nomic-embed-text
```

Install the chat model:

``` bash
ollama pull llama3.2:3b
```

Verify:

``` bash
ollama list
```

You should see your installed models, for example:

``` text
NAME
llama3.2:3b
nomic-embed-text
```

Ollama normally exposes its local API at:

``` text
http://127.0.0.1:11434
```

------------------------------------------------------------------------

## 🗄️ MongoDB Setup

The application stores document chunks and their embeddings in MongoDB.

Create a MongoDB database, for example:

``` text
ai-document-chat
```

Then obtain your MongoDB connection string.

Example:

``` text
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ai-document-chat
```

Do not commit the connection string to Git.

The current document chunk data contains:

-   `documentName`
-   `chunkIndex`
-   `text`
-   `embedding`
-   timestamps

------------------------------------------------------------------------

## 🔐 Environment Variables

Create:

``` text
backend/.env
```

Add:

``` env
MONGODB_URI=your_mongodb_connection_string
```

Ollama runs locally, so an OpenAI API key is not required for the
current implementation.

**Never commit `.env` to Git.**

------------------------------------------------------------------------

## 🚀 Getting Started

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-document-chat
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

Make sure Ollama's Node.js package is installed:

``` bash
npm install ollama
```

### 3. Start Ollama

Make sure Ollama is running and the required models are available:

``` bash
ollama list
```

### 4. Configure MongoDB

Create:

``` text
backend/.env
```

and add:

``` env
MONGODB_URI=your_mongodb_connection_string
```

### 5. Start the backend

From the `backend` folder:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### 6. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

### 7. Start the frontend

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 📄 Using the Chatbot

1.  Open the frontend.
2.  Upload a PDF document.
3.  The backend extracts the PDF text.
4.  The text is divided into smaller chunks.
5.  Ollama generates an embedding for each chunk.
6.  Chunks and embeddings are stored in MongoDB.
7.  Ask a question about the document.
8.  Ollama generates an embedding for the question.
9.  The application compares the question embedding with stored chunk
    embeddings.
10. The most relevant chunks are retrieved.
11. The relevant chunks are sent as context to the Ollama chat model.
12. The chatbot returns the answer.

Example:

``` text
Question:
How many annual paid leave days do employees receive?

Answer:
Employees receive 18 annual paid leave days.
```

If the information is not present in the retrieved document context, the
chatbot should respond:

``` text
I couldn't find that information in the uploaded document.
```

------------------------------------------------------------------------

## 🔌 API Endpoints

### Health Check

``` http
GET /
```

Example response:

``` json
{
  "message": "AI Document Chat API is running"
}
```

### Upload Document

``` http
POST /api/upload
```

Content type:

``` text
multipart/form-data
```

Form field:

``` text
document
```

Processing flow:

``` text
PDF
 ↓
Extract Text
 ↓
Create Chunks
 ↓
Generate Ollama Embeddings
 ↓
Save Chunks + Embeddings to MongoDB
```

Example response:

``` json
{
  "message": "Document uploaded successfully",
  "filename": "company-handbook.pdf",
  "pages": 10,
  "chunks": 12
}
```

### Chat

``` http
POST /api/chat
```

Example request:

``` json
{
  "message": "What are the company's working hours?"
}
```

Processing flow:

``` text
Question
 ↓
Question Embedding
 ↓
Similarity Search
 ↓
Relevant Chunks
 ↓
Build Context
 ↓
Ollama Chat Model
 ↓
Answer
```

Example response:

``` json
{
  "answer": "The company's working hours are 9:30 AM to 6:30 PM, Monday through Friday."
}
```

### Development Test Endpoints

During development, the project may also contain:

``` http
GET /api/test-ollama
```

Tests communication between Node.js and Ollama.

``` http
GET /api/test-embedding
```

Tests the local embedding model.

``` http
GET /api/test-search
```

Tests semantic similarity search.

These endpoints are intended for development and can be removed or
protected before production.

------------------------------------------------------------------------

## 🧩 Backend Architecture

The backend separates responsibilities into routes, services, models,
utilities, and configuration.

### Routes

``` text
routes/
├── chatRoutes.ts
└── documentRoutes.ts
```

Routes handle HTTP requests and delegate business logic to services.

### Services

``` text
services/
├── documentRepository.ts
├── embeddingService.ts
├── ollamaService.ts
└── searchService.ts
```

Responsibilities:

-   `ollamaService.ts` → communicates with Ollama
-   `embeddingService.ts` → generates embeddings
-   `searchService.ts` → finds relevant document chunks
-   `documentRepository.ts` → reads and writes chunks in MongoDB

### Models

``` text
models/
└── DocumentChunk.ts
```

Defines the MongoDB schema for document chunks and embeddings.

### Utilities

``` text
utils/
├── chunkText.ts
└── similarity.ts
```

Responsibilities:

-   `chunkText.ts` → splits document text into smaller chunks
-   `similarity.ts` → calculates cosine similarity

------------------------------------------------------------------------

## 🧠 Embeddings

An embedding converts text into a numerical vector that represents its
semantic meaning.

For example:

``` text
"How many vacation days do employees get?"
```

and:

``` text
"Employees receive 18 annual paid leave days."
```

use different words but have related meaning.

The embedding model helps the application identify this semantic
relationship.

The same embedding model should be used for both:

``` text
Document chunks
       +
User questions
```

This project uses:

``` text
nomic-embed-text
```

for embeddings.

------------------------------------------------------------------------

## 🔎 Semantic Search

The current learning implementation uses cosine similarity.

For every stored chunk:

``` text
Question Vector
      ↓
Compare
      ↓
Chunk Vector
      ↓
Similarity Score
```

The chunks are sorted by similarity score and the top results are
selected.

Example:

``` text
Chunk A → 0.91
Chunk B → 0.74
Chunk C → 0.52
Chunk D → 0.21
```

The highest-ranking chunks become the context provided to the Ollama
chat model.

------------------------------------------------------------------------

## 🧠 RAG Roadmap

### Completed

-   [x] React chat interface
-   [x] Node.js / Express backend
-   [x] PDF upload
-   [x] PDF text extraction
-   [x] Text chunking
-   [x] Ollama chat integration
-   [x] Ollama embedding integration
-   [x] MongoDB connection
-   [x] MongoDB document chunk model
-   [x] Store chunks and embeddings
-   [x] Cosine similarity
-   [x] Semantic search
-   [x] Retrieve relevant chunks
-   [x] RAG context preparation
-   [x] Separate API route files

### Next Steps

-   [ ] Replace application-level similarity search with MongoDB Vector
    Search
-   [ ] Add document/page metadata
-   [ ] Add source citations to answers
-   [ ] Support multiple documents
-   [ ] Isolate searches by document
-   [ ] Store chat history
-   [ ] Improve chunking strategy
-   [ ] Add streaming Ollama responses
-   [ ] Add authentication
-   [ ] Add file validation and size limits
-   [ ] Add automated tests
-   [ ] Improve logging and monitoring
-   [ ] Dockerize the application
-   [ ] Deploy frontend and backend

------------------------------------------------------------------------

## 🔐 Security

Ollama is currently running locally, so the React frontend should
communicate with the Node.js backend rather than directly with Ollama.

``` text
Frontend
   ↓
Node.js Backend
   ↓
Ollama
```

Keep MongoDB credentials in:

``` text
backend/.env
```

Never expose database credentials in the React frontend.

Recommended `.gitignore`:

``` gitignore
node_modules/
.env
dist/
```

For production, consider:

-   authentication
-   authorization
-   file type validation
-   upload size limits
-   rate limiting
-   MongoDB access controls
-   prompt/context validation
-   logging and monitoring

------------------------------------------------------------------------

## 🧪 Suggested Test Questions

After uploading the company handbook, try:

``` text
What is NovaTech Solutions?
```

``` text
What are the company's working hours?
```

``` text
How many annual paid leave days do employees receive?
```

``` text
How many sick leave days are provided?
```

``` text
What is the remote work policy?
```

``` text
What technologies does the company use?
```

Also test information that is not in the PDF:

``` text
Who is the CEO?
```

The chatbot should not invent an answer.

------------------------------------------------------------------------

## 🎯 Learning Objectives

This project is designed as a hands-on Generative AI learning project.

You will learn:

-   Local LLM integration with Ollama
-   AI application architecture
-   PDF document processing
-   Text chunking
-   Embeddings
-   Vector representations
-   Cosine similarity
-   Semantic search
-   Retrieval-Augmented Generation (RAG)
-   MongoDB persistence
-   Vector databases
-   Prompt design
-   Full-stack AI development
-   Production considerations for AI applications

------------------------------------------------------------------------

## 🚧 Future Improvements

Potential enhancements:

-   Multiple document uploads
-   Drag-and-drop PDF upload
-   Document library
-   Streaming Ollama responses
-   Conversation history
-   Source citations
-   Source-text highlighting
-   Authentication
-   User-specific document collections
-   MongoDB Vector Search
-   Better chunking with page/section metadata
-   Hybrid search
-   Reranking
-   Cloud deployment
-   Rate limiting
-   File validation
-   Improved error handling
-   Logging and observability

------------------------------------------------------------------------

## 📌 Project Goal

The goal is to evolve this project from a simple **PDF + local LLM
chatbot** into a production-style **Generative AI Document Assistant**
using Retrieval-Augmented Generation.

``` text
                  AI DOCUMENT ASSISTANT

                           │
             ┌─────────────┴─────────────┐
             │                           │
         Documents                    Chat UI
             │                           │
         Extraction                  Questions
             │                           │
         Chunking                        │
             │                           │
        Embeddings                       │
             │                           │
       MongoDB Storage ◄─────────────────┘
             │
       Vector Search
             │
      Relevant Context
             │
        Ollama LLM
             │
           Answer
```

------------------------------------------------------------------------

## 👨‍💻 Author

**Deepak Mankotia**

Full-Stack Developer \| Generative AI \| React \| TypeScript \| Node.js

------------------------------------------------------------------------

⭐ If you find this project useful, consider giving the repository a
star.
