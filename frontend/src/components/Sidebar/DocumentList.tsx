import type { DocumentItem } from "../../types/document";

interface DocumentListProps {
  documents: DocumentItem[];
  uploading: boolean;
  deletingDocumentId: string | null;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onDelete: (documentId: string) => void;
}

function DocumentList({
  documents,
  uploading,
  deletingDocumentId,
  onUpload,
  onDelete,
}: DocumentListProps) {
  return (
    <section className="mt-6 shrink-0">
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Documents
      </div>

      {documents.length === 0 ? (
        <div className="px-2 py-2 text-xs text-gray-400">
          No documents uploaded
        </div>
      ) : (
        <div className="space-y-1">
          {documents.map((document) => {
            const deleting =
              deletingDocumentId === document._id;

            return (
              <div
                key={document._id}
                className="group flex items-center gap-2 rounded-xl bg-gray-50 p-2.5"
              >
                <div className="shrink-0 text-lg">
                  📄
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-gray-700">
                    {document.filename}
                  </div>

                  <div className="mt-1 text-[10px] text-gray-400">
                    {document.pages} pages ·{" "}
                    {document.chunkCount} chunks
                  </div>

                  <div
                    className={`mt-1 text-[10px] capitalize ${
                      document.status === "ready"
                        ? "text-green-500"
                        : document.status ===
                            "processing"
                          ? "text-orange-500"
                          : "text-red-500"
                    }`}
                  >
                    ● {document.status}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    onDelete(document._id)
                  }
                  title="Delete document"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:cursor-wait disabled:opacity-50"
                >
                  {deleting ? "⏳" : "🗑"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <label
        className={`mt-3 flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 text-sm font-medium transition ${
          uploading
            ? "cursor-wait border-gray-300 text-gray-400"
            : "border-gray-300 text-blue-500 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <span>
          {uploading ? "⏳" : "＋"}
        </span>

        {uploading
          ? "Uploading..."
          : "Upload PDF"}

        <input
          type="file"
          accept="application/pdf"
          onChange={onUpload}
          disabled={uploading}
          hidden
        />
      </label>
    </section>
  );
}

export default DocumentList;