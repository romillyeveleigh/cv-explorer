import pdfToText from "@/app/utils/pdfToText";
import wordFileToText from "@/app/utils/wordFileToText";
import Anthropic from "@anthropic-ai/sdk";
import { ToolUseBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

export const getCvText: (file: File) => Promise<string> = async (file) => {
  if (file.type === "application/pdf") {
    console.log("PDF file detected");
    return await pdfToText(file);
  } else if (file.type === "text/plain") {
    console.log("Plain text file detected");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error("Error reading plain text file"));
      };
      reader.readAsText(file);
    });
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("Word file detected");
    return await wordFileToText(file);
  }
};

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
