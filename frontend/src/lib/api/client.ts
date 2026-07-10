/**
 * Thin, typed fetch wrapper shared by every feature hook. Centralizing this
 * means one place to attach the auth header, one place to handle non-2xx
 * responses consistently, and one place to point at a different API base
 * URL per environment (Vite exposes env vars via import.meta.env, prefixed
 * with VITE_).
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}
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

const requestCache = new Map<string, Promise<any>>();

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal } = options;
  const cacheKey = `${method}:${path}:${body ? JSON.stringify(body) : ""}`;

  // Return existing in‑flight promise if identical request is already pending
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey) as Promise<T>;
  }

  const fetchPromise = (async () => {
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
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
  })();

  // Store the in‑flight promise and ensure it is cleared once settled
  requestCache.set(cacheKey, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    requestCache.delete(cacheKey);
  }
}
