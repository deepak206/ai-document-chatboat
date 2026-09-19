import type {
    DocumentItem,
  } from "../types/document";
  
  const API_URL =
    "http://localhost:5000/api";
  
  export async function getDocuments(): Promise<
    DocumentItem[]
  > {
    const response = await fetch(
      `${API_URL}/documents`
    );
  
    if (!response.ok) {
      throw new Error(
        "Failed to load documents"
      );
    }
  
    return response.json();
  }
  
  export async function uploadDocument(
    file: File
  ) {
    const formData =
      new FormData();
  
    formData.append(
      "document",
      file
    );
  
    const response = await fetch(
      `${API_URL}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to upload document"
      );
    }
  
    return data;
  }