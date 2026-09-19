import type { ChatItem } from "../../types/chat";

interface ChatHistoryProps {
  chats: ChatItem[];
  currentChatId: string | null;
  onSelect: (chatId: string) => void;
}

function ChatHistory({
  chats,
  currentChatId,
  onSelect,
}: ChatHistoryProps) {
  return (
    <section className="mt-6 flex min-h-0 flex-1 flex-col">
      <div className="mb-2 shrink-0 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Recent Chats
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {chats.length === 0 ? (
          <div className="px-2 py-2 text-xs text-gray-400">
            No previous chats
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat._id}
                type="button"
                onClick={() => onSelect(chat._id)}
                className={`flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                  currentChatId === chat._id
                    ? "bg-blue-50 font-medium text-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>💬</span>

                <span className="min-w-0 truncate">
                  {chat.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatHistory;