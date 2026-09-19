import { useState } from "react";

import type { AgentStep } from "../../types/chat";

interface AgentActivityProps {
  steps: AgentStep[];
}

function AgentActivity({
  steps,
}: AgentActivityProps) {
  const [expanded, setExpanded] =
    useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      {/* Activity Header */}
      <button
        type="button"
        onClick={() =>
          setExpanded((value) => !value)
        }
        className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-gray-700"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          ✨
        </span>

        <span>
          Agent completed{" "}
          {steps.length}{" "}
          {steps.length === 1
            ? "step"
            : "steps"}
        </span>

        <span className="text-gray-400">
          {expanded ? "⌃" : "⌄"}
        </span>
      </button>

      {/* Expanded Activity */}
      {expanded && (
        <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="space-y-3">
            {steps.map(
              (step, index) => (
                <div
                  key={`${step.type}-${index}`}
                  className="flex items-start gap-3"
                >
                  {/* Icon */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs shadow-sm">
                    {step.type ===
                    "tool"
                      ? "🔍"
                      : step.type ===
                          "result"
                        ? "📄"
                        : "✓"}
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-700">
                      {step.message}
                    </div>

                    {step.tool && (
                      <div className="mt-1 text-[10px] text-gray-400">
                        Tool:{" "}
                        {step.tool}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentActivity;