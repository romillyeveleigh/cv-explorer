import {
  MessageParam,
  Messages,
} from "@anthropic-ai/sdk/resources/messages.mjs";

export const removeToolResults = (messages: MessageParam[]) => {
  console.log("🚀 ~ removeToolResults ~ messages:", messages)
  return messages.map((message) => ({
    role: message.role,
    content: Array.isArray(message.content)
      ? message.content.filter((content) => content.type !== "tool_result")
      : message.content,
  }));
};

export const createNewMessage = (
  content: string,
  toolUseBlock?: Messages.ToolUseBlockParam
): MessageParam => {
  return {
    role: "user",
    content: toolUseBlock
      ? [
          {
            type: "tool_result",
            tool_use_id: toolUseBlock.id,
            content: JSON.stringify(toolUseBlock.input),
          },
          {
            type: "text",
            text: content,
          },
        ]
      : content,
  };
};

function getToolUseBlock(
  message: MessageParam
): Messages.ToolUseBlockParam | undefined {
  return Array.isArray(message?.content)
    ? message.content.find((content) => content.type === "tool_use")
    : undefined;
}

export const getToolUseBlockFromLastMessage = (messages: MessageParam[]) => {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) return undefined;
  return getToolUseBlock(lastMessage);
};
