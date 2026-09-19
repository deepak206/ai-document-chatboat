import type { ChatItem } from "../../types/chat";
import type { DocumentItem } from "../../types/document";
import ChatHistory from "./ChatHistory";
import DocumentList from "./DocumentList";

interface SidebarProps {
    chats: ChatItem[];
    documents: DocumentItem[];
    currentChatId: string | null;
    uploading: boolean;
    deletingDocumentId: string | null;
    isOpen: boolean;
    onNewChat: () => void;
    onChatSelect: (chatId: string) => void;
    onUpload: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    onDeleteDocument: (documentId: string) => void;
    onClose: () => void;
  }

  function Sidebar({
    chats,
    documents,
    currentChatId,
    uploading,
    deletingDocumentId,
    isOpen,
    onNewChat,
    onChatSelect,
    onUpload,
    onDeleteDocument,
    onClose,
  }: SidebarProps)  {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/25
            backdrop-blur-[2px]
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[290px] flex-col
          border-r border-gray-200
          bg-white/95
          p-4
          shadow-xl
          backdrop-blur-xl
          transition-transform duration-300

          md:static
          md:z-auto
          md:w-[300px]
          md:translate-x-0
          md:shadow-none

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Sidebar Header */}
        <div className="mb-4 flex items-center justify-between px-2">

          <div className="flex items-center gap-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white shadow-sm">
            GC
          </div>

          <strong className="block text-sm font-semibold text-gray-900">
            GenChat
            </strong>

            <span className="text-xs text-gray-400">
            AI Document Assistant
            </span>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-2xl text-gray-400
              hover:bg-gray-100
            "
          >
            ×
          </button>

        </div>

        {/* New Chat */}
        <button
          type="button"
          onClick={onNewChat}
          className="
            flex h-11 w-full
            items-center justify-center gap-2
            rounded-xl
            bg-blue-500
            text-sm font-semibold text-white
            shadow-md shadow-blue-500/20
            transition
            hover:bg-blue-600
            active:scale-[0.98]
          "
        >
          <span className="text-xl">＋</span>
          New Chat
        </button>

        {/* Chat history */}
        <ChatHistory
          chats={chats}
          currentChatId={currentChatId}
          onSelect={onChatSelect}
        />

        {/* Documents */}
        <DocumentList
        documents={documents}
        uploading={uploading}
        deletingDocumentId={deletingDocumentId}
        onUpload={onUpload}
        onDelete={onDeleteDocument}
        />

      </aside>
    </>
  );
}

export default Sidebar;