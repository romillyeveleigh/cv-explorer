import Anthropic from "@anthropic-ai/sdk";
import { ToolUseBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

export * from "./getCvText";

export function getToolUseDataFromMessage<T = any>(
  message: Anthropic.Messages.MessageParam,
  toolName: string
) {
  const isInsightMessage =
    message.role === "assistant" &&
    Array.isArray(message.content) &&
    message.content[0].type === "tool_use" &&
    message.content[0].name === toolName;

  if (!isInsightMessage) {
    return undefined;
  }

  return (message.content[0] as ToolUseBlock).input as T;
}

export function getToolUseDataByToolName<T = any>(
  messages: Anthropic.Messages.MessageParam[],
  toolName: string
) {
  return messages
    .map((message) => getToolUseDataFromMessage<T>(message, toolName))
    .filter((data): data is T => data !== undefined);
}
