import Anthropic from "@anthropic-ai/sdk";
import {
  Message,
  MessageParam,
} from "@anthropic-ai/sdk/resources/messages.mjs";
import { useState, useCallback, useMemo } from "react";
import {
  removeToolResults,
  createNewMessage,
  getToolUseBlockFromLastMessage,
} from "./utils";
import { fetchClaudeResponse } from "./api";

interface UseClaudeConversationProps {
  system: Anthropic.MessageCreateParams["system"];
  tools: Anthropic.Tool[];
}

export function useClaudeConversationV2({
  system,
  tools,
}: UseClaudeConversationProps) {
  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMessages = useMemo(() => {
    return removeToolResults(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (
      content: string,
      customParams?: Partial<Anthropic.MessageCreateParams>,
      isNewConversation = false
    ) => {
      const toolUseBlock = getToolUseBlockFromLastMessage(messages);
      const newMessage = createNewMessage(content, toolUseBlock);
      const newMessages = [...(isNewConversation ? [] : messages), newMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const data = await fetchClaudeResponse(
          newMessages,
          system,
          tools,
          customParams
        );

        const { content }: Message = data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content },
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
    [messages, system, tools]
  );

  const reset = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages: filteredMessages, isLoading, sendMessage, reset };
}
