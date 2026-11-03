import type { ApiHealth, ChatResponse, DocumentItem } from "./types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const apiBase = (
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:4000`
).replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const requestInit: RequestInit = { ...init, credentials: "include" };
  let response = await fetch(`${apiBase}${path}`, requestInit);
  if (response.status === 401 && !path.startsWith("/api/auth/")) {
    const refreshed = await fetch(`${apiBase}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      response = await fetch(`${apiBase}${path}`, requestInit);
    } else if (window.location.pathname === "/workspace") {
      window.location.replace("/login");
    }
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Request failed (${response.status}).`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const result = await request<{ user: AuthUser | null }>("/api/auth/me");
  return result.user;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return result.user;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return result.user;
}

export async function signOut(): Promise<void> {
  await request<void>("/api/auth/logout", { method: "POST" });
}

export async function getHealth(): Promise<ApiHealth> {
  return request<ApiHealth>("/api/health");
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const result = await request<{ documents: DocumentItem[] }>("/api/documents");
  return result.documents;
}

export async function uploadDocument(file: File): Promise<DocumentItem> {
  const body = new FormData();
  body.append("file", file);
  const result = await request<{ document: DocumentItem }>("/api/documents", {
    method: "POST",
    body,
  });
  return result.document;
}

export async function deleteDocument(documentId: string): Promise<void> {
  await request<void>(`/api/documents/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  });
}

export async function askQuestion(question: string): Promise<ChatResponse> {
  return request<ChatResponse>("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}
