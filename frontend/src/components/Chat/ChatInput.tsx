import { useState } from "react";

interface ChatInputProps {
  loading: boolean;
  onSend: (message: string) => void;
}

function ChatInput({ loading, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const message = value.trim();

    if (!message || loading) {
      return;
    }

    onSend(message);
    setValue("");
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="w-full px-2 pb-2 md:px-0 md:pb-5">

      <div
        className="
          mx-auto flex min-h-[54px] w-full max-w-4xl
          items-end gap-2
          rounded-[20px]
          border border-gray-300
          bg-white/95
          px-3 py-2
          shadow-sm
          backdrop-blur-xl
        "
      >

        {/* Plus */}
        <button
          type="button"
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-full bg-gray-100
            text-xl text-gray-600
            transition hover:bg-gray-200
          "
        >
          ＋
        </button>

        {/* Text */}
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          disabled={loading}
          className="
            max-h-32 min-w-0 flex-1
            resize-none
            bg-transparent
            px-1 py-2
            text-sm text-gray-900
            outline-none
            placeholder:text-gray-400
            md:text-[15px]
          "
        />

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !value.trim()}
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-full
            bg-blue-500
            text-lg font-semibold text-white
            transition
            hover:bg-blue-600
            disabled:cursor-not-allowed
            disabled:bg-gray-300
            disabled:text-gray-500
          "
        >
          ↑
        </button>

      </div>

    </div>
  );
}

export default ChatInput;