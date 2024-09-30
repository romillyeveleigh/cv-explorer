import Anthropic from "@anthropic-ai/sdk";
import {
  Message,
  MessageParam,
} from "@anthropic-ai/sdk/resources/messages.mjs";
import { useState, useCallback, useMemo } from "react";
import { removeToolResults, createNewMessage, getToolUseBlockFromLastMessage } from "./utils";
import { fetchClaudeResponse } from "./api";

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
  const [isLoading, setIsLoading] = useState(false);

  const filteredMessages = useMemo(() => {
    return removeToolResults(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const toolUseBlock = getToolUseBlockFromLastMessage(messages);
      const newMessage = createNewMessage(content, toolUseBlock);
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const data = await fetchClaudeResponse(
          newMessages,
          system,
          tools,
          customParams
        );

        const assistantMessage: Message = data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: assistantMessage.content },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: `Sorry, there was an error processing your request: ${error.message}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, system, tools, customParams]
  );

  return { messages: filteredMessages, isLoading, sendMessage };
}
