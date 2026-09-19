const API_URL = "http://localhost:5000/api";

// ---------------------------------------
// Get all documents
// ---------------------------------------

export async function getDocuments() {
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

// ---------------------------------------
// Upload document
// ---------------------------------------

export async function uploadDocument(
  file: File
) {
  const formData = new FormData();

  formData.append("document", file);

  const response = await fetch(
    `${API_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to upload document"
    );
  }

  return data;
}

// ---------------------------------------
// Delete document
// ---------------------------------------

export async function deleteDocument(
  documentId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to delete document"
    );
  }
}