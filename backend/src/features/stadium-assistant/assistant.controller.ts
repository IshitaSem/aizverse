import type { Request, Response } from "express";
import { generateAssistantReply } from "./assistant.service.js";
import type { AssistantChatRequest } from "./assistant.schema.js";

export async function postAssistantChat(req: Request, res: Response): Promise<void> {
  const input = req.body as AssistantChatRequest;
  const result = await generateAssistantReply(input);
  res.status(200).json(result);
}
