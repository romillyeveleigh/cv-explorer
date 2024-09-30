import { Anthropic } from "@anthropic-ai/sdk";


export function convertClaudeResponseToMessageParam(
  claudeResponse: Anthropic.Messages.ContentBlock[]
): Anthropic.Messages.MessageParam {
  console.log(":rocket: ~ claudeResponse:", claudeResponse);
  const messageContent: Anthropic.Messages.ContentBlock[] = claudeResponse.map(
    (item) => {
      if (typeof item === "string") {
        return {
          type: "text",
          text: item,
        };
      } else if ("type" in item) {
        switch (item.type) {
          case "text":
          case "tool_use":
            return item;
          default:
            // This case should not occur with proper typing, but we include it for safety
            return {
              type: "text",
              text: JSON.stringify(item),
            };
        }
      } else {
        // This case should not occur with proper typing, but we include it for safety
        return {
          type: "text",
          text: JSON.stringify(item),
        };
      }
    }
  );
  console.log(":rocket: ~ messageContent:", messageContent);
  return {
    role: "assistant",
    content: messageContent,
  } as Anthropic.Messages.MessageParam;
}
