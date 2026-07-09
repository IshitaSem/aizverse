import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatWindow } from "@/features/stadium-assistant/components/ChatWindow";

vi.mock("@/lib/api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/client")>("@/lib/api/client");
  return { ...actual, apiRequest: vi.fn().mockResolvedValue({ reply: "Gate B is ahead.", language: "en" }) };
});

describe("ChatWindow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows suggested questions when there are no messages yet", () => {
    render(<ChatWindow stadiumId="s1" />);
    expect(screen.getByText("How do I reach Gate B?")).toBeInTheDocument();
  });

  it("lets a user type and submit a question via the form", async () => {
    const user = userEvent.setup();
    render(<ChatWindow stadiumId="s1" />);

    const input = screen.getByLabelText(/ask the stadium assistant/i);
    await user.type(input, "Where is my seat?");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Where is my seat?")).toBeInTheDocument();
    expect(await screen.findByText("Gate B is ahead.")).toBeInTheDocument();
  });

  it("disables the send button while a request is in flight and re-enables after", async () => {
    const user = userEvent.setup();
    render(<ChatWindow stadiumId="s1" />);

    const input = screen.getByLabelText(/ask the stadium assistant/i);
    await user.type(input, "Nearest restroom?");
    const button = screen.getByRole("button", { name: /send message/i });
    await user.click(button);

    expect(await screen.findByText("Gate B is ahead.")).toBeInTheDocument();
  });
});
