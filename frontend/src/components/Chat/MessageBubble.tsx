import type { Message } from "../../types/chat";

import AgentActivity from "./AgentActivity";

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`mb-5 flex items-start gap-2 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
          GC
        </div>
      )}

      <div className="max-w-[82%] md:max-w-[75%]">
        {/* Agent Activity */}
        {!isUser &&
          message.agentSteps &&
          message.agentSteps.length >
            0 && (
            <AgentActivity
              steps={
                message.agentSteps
              }
            />
          )}

        {/* Message */}
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 md:text-[15px] ${
            isUser
              ? "rounded-br-md bg-blue-500 text-white"
              : "rounded-bl-md bg-white text-gray-900 shadow-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Sources */}
        {!isUser &&
          message.sources &&
          message.sources.length >
            0 && (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white/80 p-3">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Sources
              </div>

              {message.sources.map(
                (
                  source,
                  index
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-1 text-[11px] text-gray-600"
                  >
                    <span className="min-w-0 truncate">
                      📄{" "}
                      {
                        source.filename
                      }
                    </span>

                    <span className="shrink-0 text-gray-400">
                      Chunk{" "}
                      {
                        source.chunkIndex
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm">
          👤
        </div>
      )}
    </div>
  );
}

export default MessageBubble;