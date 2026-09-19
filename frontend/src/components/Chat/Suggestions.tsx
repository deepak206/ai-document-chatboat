interface SuggestionsProps {
    onSelect: (message: string) => void;
  }
  
  const suggestions = [
    {
      icon: "📅",
      label: "Leave policy",
      message: "How many annual paid leave days do employees get?",
    },
    {
      icon: "🕐",
      label: "Working hours",
      message: "What are the company working hours?",
    },
    {
      icon: "💻",
      label: "Technology",
      message: "What technologies does the company use?",
    },
  ];
  
  function Suggestions({ onSelect }: SuggestionsProps) {
    return (
      <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
  
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => onSelect(suggestion.message)}
            className="
              flex min-h-[65px] flex-col items-start
              justify-center gap-1
              rounded-2xl border border-gray-200
              bg-white/80 px-4 py-3
              text-left text-sm text-gray-700
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-blue-300
              hover:bg-blue-50
            "
          >
            <span className="text-lg">{suggestion.icon}</span>
  
            <span className="font-medium">
              {suggestion.label}
            </span>
          </button>
        ))}
  
      </div>
    );
  }
  
  export default Suggestions;