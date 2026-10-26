export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev").replace(/\/$/, "");

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("movie_access_token");
}

export function saveSession(token: string, user: unknown) {
  window.localStorage.setItem("movie_access_token", token);
  window.localStorage.setItem("movie_user", JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem("movie_access_token");
  window.localStorage.removeItem("movie_user");
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function requireLoginOrRedirect() {
  if (typeof window !== "undefined" && !getToken()) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
}
