export interface AgentTool {
    name: string;
    description: string;
    execute: (input: string) => Promise<unknown>;
  }
  
  export interface AgentToolCall {
    tool: string;
    input: string;
  }
  
  export interface AgentResponse {
    type: "tool" | "final";
    tool?: string;
    input?: string;
    answer?: string;
  }
  
  /**
   * Represents one step performed by the agent.
   */
  export interface AgentStep {
    type: "tool" | "result" | "final";
    tool?: string;
    input?: string;
    message: string;
  }
  
  /**
   * Complete result returned by the agent.
   */
  export interface AgentRunResult {
    answer: string;
    steps: AgentStep[];
  }