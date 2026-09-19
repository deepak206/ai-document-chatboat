interface ChatHeaderProps {
    onMenuClick: () => void;
  }
  
  function ChatHeader({ onMenuClick }: ChatHeaderProps) {
    return (
      <header className="h-[68px] shrink-0 border-b border-gray-200 bg-white/90 px-3 backdrop-blur-xl md:px-6">
        <div className="flex h-full items-center justify-between">
  
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full bg-gray-100 text-xl text-gray-700
              transition hover:bg-gray-200
              md:hidden
            "
          >
            ☰
          </button>
  
          {/* Header title */}
          <div className="mr-auto ml-2 flex items-center gap-3 md:ml-0">
  
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-gray-900 md:text-base">
                GenChat
            </h1>

            <span className="text-[11px] text-gray-500">
                AI Document Assistant
            </span>
            </div>
  
          </div>
  
          {/* More button */}
          <button
            type="button"
            aria-label="More options"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full bg-gray-100 text-xl text-gray-600
              transition hover:bg-gray-200
            "
          >
            ⋯
          </button>
  
        </div>
      </header>
    );
  }
  
  export default ChatHeader;