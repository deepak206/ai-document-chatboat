export interface Source {
    filename: string;
    chunkIndex: number;
    score: number;
  }
  
  export interface AgentStep {
    type: "tool" | "result" | "final";
    tool?: string;
    input?: string;
    message: string;
  }
  
  export interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    agentSteps?: AgentStep[];
  }
  
  export interface ChatItem {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
  }