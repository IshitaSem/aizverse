/**
 * Thin, typed fetch wrapper. Centralizing this means: one place to attach
 * auth headers, one place to handle non-2xx responses consistently, and one
 * place to point at a different API base URL per environment.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://aizverse-production.up.railway.app";

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
  token?: string;
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

  return res.json() as Promise<T>;
}
