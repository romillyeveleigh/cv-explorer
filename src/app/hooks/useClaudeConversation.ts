import Anthropic from "@anthropic-ai/sdk";
import {
  ImageBlockParam,
  MessageParam,
  TextBlock,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/messages.mjs";
import { useState, useCallback } from "react";

// export interface Message {
//   role: "user" | "assistant" | "system" | "tool";
//   content: string | Record<string, any>;
// }

interface UseClaudeConversationProps {
  system: Anthropic.MessageCreateParams["system"];
  tools: Anthropic.Tool[];
  customParams?: Partial<Anthropic.MessageCreateParams>;
}

export function useClaudeConversation({
  system,
  tools,
  customParams,
}: UseClaudeConversationProps) {
  const [messages, setMessages] = useState<MessageParam[]>([]);
  console.log("🚀 ~ messages:", messages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      console.log("🚀 ~ content:", content);
      const newMessages: MessageParam[] = [
        ...messages,
        { role: "user", content },
      ];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/claude-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            system,
            tools,
            customParams,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();
        console.log("🚀 ~ data:", data);
        const assistantMessages: Anthropic.Messages.Message = data.response;

        const getSingleBlock: (
          block: Anthropic.Messages.ContentBlock
        ) =>
          | Anthropic.Messages.TextBlockParam
          | Anthropic.Messages.ImageBlockParam
          | Anthropic.Messages.ToolUseBlockParam
          | Anthropic.Messages.ToolResultBlockParam = (block) => {
          if ("text" in block) {
            return {
              type: "text",
              text: block.text,
            };
          } else if ("image" in block) {
            return {
              type: "image",
              image: block.image,
            };
          } else if (block.type === "tool_use") {
            return {
              type: "tool_response",
              tool_response: {
                type: "tool_name",
                output: block.input,
              },
            };
          } else if (block.type === "tool_result") {
            return {
              type: "tool_result",
            };
          }
          return {
            type: "unkonwn",
            text: "",
          };
        };

        const formatAssisantMessageContent: (
          content: Anthropic.Messages.ContentBlock[]
        ) => MessageParam["content"] = (content) => {
          return Array.isArray(content)
            ? content.map(getSingleBlock)
            : [getSingleBlock(content)];
        };

        const assistantMessage: MessageParam = {
          role: "assistant",
          content: formatAssisantMessageContent(assistantMessages.content),
        };

        setMessages([...newMessages, assistantMessage]);

        // let responseMessage: MessageParam = {
        //   role: "assistant",
        //   content: [],
        // };

        // for (const assistantMessage of assistantMessages) {
        //   switch (assistantMessage.type) {
        //     case "text":
        //       responseMessage = {
        //         role: "assistant",
        //         content: (responseMessage.content as TextBlockParam[]).push(
        //           assistantMessage.content
        //         ),
        //       };
        //       break;
        //     case "tool_call":
        //       const toolCall = assistantMessage.tool_call;
        //       console.log("🚀 ~ toolCall:", toolCall);
        //       setMessages([
        //         ...newMessages,
        //         { role: "assistant", content: toolCall.function.arguments },
        //         {
        //           role: "assistant",
        //           content:
        //             "Here's the structured information. Would you like me to explain it?",
        //         },
        //       ]);
        //       break;
        //     case "structured_data":
        //       setMessages([
        //         ...newMessages,
        //         { role: "assistant", content: assistantMessage.content },
        //         {
        //           role: "assistant",
        //           content:
        //             "Here's the structured information you requested. Would you like me to explain it?",
        //         },
        //       ]);
        //       break;
        //     case "image":
        //       setMessages([
        //         ...newMessages,
        //         {
        //           role: "assistant",
        //           content:
        //             "An image was generated, but I cannot display it here.",
        //         },
        //       ]);
        //       break;
        //     default:
        //       setMessages([
        //         ...newMessages,
        //         {
        //           role: "assistant",
        //           content: "I received a response I don't know how to handle.",
        //         },
        //       ]);
        //   }
        // }

        // setMessages([...newMessages, responseMessage]);
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, system, tools, customParams]
  );

  return { messages, isLoading, sendMessage };
}
