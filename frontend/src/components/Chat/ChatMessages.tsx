import type { Message } from "../../types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import Suggestions from "./Suggestions";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  onSuggestionSelect: (message: string) => void;
}

function ChatMessages({
  messages,
  loading,
  onSuggestionSelect,
}: ChatMessagesProps) {

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">

        <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-blue-500 text-xl font-bold tracking-tight text-white shadow-lg shadow-blue-500/20">
        GC
        </div>

        <h2>
        Welcome to GenChat
        </h2>

        <p className="mb-6 mt-2 text-sm text-gray-500">
        Ask anything about your uploaded documents.
        </p>

        <Suggestions onSelect={onSuggestionSelect} />

      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-5 md:px-6 md:py-7">

      <div className="mx-auto max-w-4xl">

        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${index}`}
            message={message}
          />
        ))}

        {loading && <TypingIndicator />}

      </div>

    </div>
  );
}

export default ChatMessages;