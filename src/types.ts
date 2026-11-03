export type DocumentStatus = "processing" | "ready" | "error";

export interface DocumentItem {
  _id: string;
  name: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  chunkCount: number;
  error?: string;
  createdAt: string;
}

export interface SourceReference {
  reference: number;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  score: number;
  excerpt: string;
}

export interface ApiHealth {
  status: string;
  database: string;
  maxUploadMb: number;
  vectorSearch: {
    status: "ready" | "missing" | "building" | "invalid" | "unavailable";
    message: string;
  };
}

export interface ChatResponse {
  answer: string;
  sources: SourceReference[];
}
