function TypingIndicator() {
    return (
      <div className="mb-5 flex items-start gap-2">
        
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
        GC
        </div>
  
        <div className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 shadow-sm">
  
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
  
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
            style={{ animationDelay: "150ms" }}
          />
  
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
            style={{ animationDelay: "300ms" }}
          />
  
        </div>
      </div>
    );
  }
  
  export default TypingIndicator;