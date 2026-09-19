import type { DocumentItem } from "../../types/document";

interface DocumentListProps {
  documents: DocumentItem[];
  uploading: boolean;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function DocumentList({
  documents,
  uploading,
  onUpload,
}: DocumentListProps) {
  return (
    <section className="mt-6 min-h-0 flex-1 overflow-y-auto">

      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Documents
      </div>

      {documents.length === 0 ? (
        <div className="px-2 py-2 text-xs text-gray-400">
          No documents uploaded
        </div>
      ) : (
        <div className="space-y-1">

          {documents.map((document) => (
            <div
              key={document._id}
              className="flex gap-2 rounded-xl bg-gray-50 p-2.5"
            >
              <div className="shrink-0 text-lg">
                📄
              </div>

              <div className="min-w-0">

                <div className="truncate text-xs font-medium text-gray-700">
                  {document.filename}
                </div>

                <div className="mt-1 text-[10px] text-gray-400">
                  {document.pages} pages · {document.chunkCount} chunks
                </div>

                <div
                  className={`
                    mt-1 text-[10px] capitalize
                    ${
                      document.status === "ready"
                        ? "text-green-500"
                        : document.status === "processing"
                          ? "text-orange-500"
                          : "text-red-500"
                    }
                  `}
                >
                  ● {document.status}
                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* Upload */}
      <label
        className={`
          mt-3 flex min-h-10 w-full
          cursor-pointer items-center
          justify-center gap-2
          rounded-xl border border-dashed
          px-3 py-2 text-sm font-medium
          transition
          ${
            uploading
              ? "cursor-wait border-gray-300 text-gray-400"
              : "border-gray-300 text-blue-500 hover:border-blue-400 hover:bg-blue-50"
          }
        `}
      >
        <span>
          {uploading ? "⏳" : "＋"}
        </span>

        {uploading ? "Uploading..." : "Upload PDF"}

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