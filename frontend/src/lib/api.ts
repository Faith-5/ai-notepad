const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Something went wrong");
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () =>
    request<{ id: string; name: string; email: string }>("/auth/me"),

  getNotes: () =>
    request<{ id: string; title: string; content: string; created_at: string; updated_at: string }[]>("/notes"),

  getNote: (id: string) =>
    request<{ id: string; title: string; content: string; created_at: string; updated_at: string }>(`/notes/${id}`),

  saveNote: (note: { id?: string; title: string; content: string }) =>
    request<{ id: string; title: string; content: string; created_at: string; updated_at: string }>(
      note.id ? `/notes/${note.id}` : "/notes",
      { method: note.id ? "PUT" : "POST", body: JSON.stringify(note) }
    ),

  deleteNote: (id: string) =>
    request<{ success: boolean }>(`/notes/${id}`, { method: "DELETE" }),

  aiAssist: (content: string, instruction?: string) =>
    request<{ result: string }>("/ai-assist", {
      method: "POST",
      body: JSON.stringify({ content, instruction }),
    }),
};
