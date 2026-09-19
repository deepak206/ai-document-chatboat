import {
    getAllDocuments,
  } from "../services/documentManagementRepository";
  
  import type { AgentTool } from "../agent/types";
  
  export const listDocumentsTool: AgentTool = {
    name: "list_documents",
  
    description:
      "Return a list of all documents uploaded to GenChat.",
  
    execute: async () => {
      const documents = await getAllDocuments();
  
      return documents.map((document) => ({
        id: document._id,
        filename: document.filename,
        pages: document.pages,
        chunkCount: document.chunkCount,
        status: document.status,
      }));
    },
  };