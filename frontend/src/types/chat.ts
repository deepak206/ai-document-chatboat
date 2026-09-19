export interface Source {
    filename: string;
    chunkIndex: number;
    score: number;
  }
  
  export interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
  }
  
  export interface ChatItem {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
  }