import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAssistantChat } from "@/features/stadium-assistant/hooks/useAssistantChat";

vi.mock("@/lib/api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/client")>("@/lib/api/client");
  return { ...actual, apiRequest: vi.fn() };
});

import { apiRequest } from "@/lib/api/client";

describe("useAssistantChat", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it("optimistically appends the user message before the response arrives", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ reply: "Gate B is ahead.", language: "en" });
    const { result } = renderHook(() => useAssistantChat({ stadiumId: "s1", language: "en" }));

    act(() => {
      void result.current.sendMessage("How do I reach Gate B?");
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]?.role).toBe("user");

    await waitFor(() => expect(result.current.messages).toHaveLength(2));
    expect(result.current.messages[1]?.content).toBe("Gate B is ahead.");
  });

  it("ignores empty/whitespace-only input", async () => {
    const { result } = renderHook(() => useAssistantChat({ stadiumId: "s1", language: "en" }));

    await act(async () => {
      await result.current.sendMessage("   ");
    });

    expect(result.current.messages).toHaveLength(0);
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("surfaces an error message and clears loading state when the request fails", async () => {
    const { ApiError } = await import("@/lib/api/client");
    vi.mocked(apiRequest).mockRejectedValueOnce(new ApiError(500, "AI service unavailable"));

    const { result } = renderHook(() => useAssistantChat({ stadiumId: "s1", language: "en" }));

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(result.current.error).toBe("AI service unavailable");
    expect(result.current.isLoading).toBe(false);
  });
});
