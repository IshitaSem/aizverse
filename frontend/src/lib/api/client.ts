/**
 * Thin, typed fetch wrapper shared by every feature hook. Centralizing this
 * means one place to attach the auth header, one place to handle non-2xx
 * responses consistently, and one place to point at a different API base
 * URL per environment (Vite exposes env vars via import.meta.env, prefixed
 * with VITE_).
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, payload.message ?? "Request failed");
  }

  // 204 No Content has no body to parse
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
