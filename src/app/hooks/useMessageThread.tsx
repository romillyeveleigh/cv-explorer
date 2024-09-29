"use client";

import React, { useMemo, useState } from "react";

import Anthropic from "@anthropic-ai/sdk";

export const enum Model {
  SONNET = "claude-3-sonnet-20240229",
  HAIKU = "claude-3-haiku-20240307",
}

const DEFAULT_GENERATE_RESPONSE_PARAMS = {
  model: Model.SONNET,
  max_tokens: 1000,
  temperature: 0.8,
  messages: [],
};

export const getClient = () => {
  return new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    dangerouslyAllowBrowser: true,
  });
};

export const createRequestMessage: (
  prompt: string
) => Anthropic.Messages.MessageParam = (prompt) => ({
  role: "user",
  content: prompt,
});

type GenerateResponseParams =
  Partial<Anthropic.Messages.MessageCreateParamsNonStreaming>;

export const generateResponseMessage = async (
  params: GenerateResponseParams
) => {
  return await getClient().messages.create({
    ...DEFAULT_GENERATE_RESPONSE_PARAMS,
    ...params,
  });
};

const getMesssageFromResponse = (response: Anthropic.Messages.MessageParam) => {
  return typeof response.content[0] === "string"
    ? response.content[0]
    : "text" in response.content[0]
    ? response.content[0].text
    : "";
};

export const getObjectFromResponse = (
  response: Anthropic.Messages.MessageParam
) => {
  const isTooluseBlockParam =
    typeof response.content[0] === "object" &&
    response.content[0] !== null &&
    response.content[0].type === "tool_use";

  if (!isTooluseBlockParam) {
    console.error("Response does not contain a tool use block");
    return;
  }

  const result = response.content[0].input;

  if (typeof result !== "object" || result === null) return null;

  return result;
};

export const getMessageFromPrompt = async (
  prompt: string,
  options: GenerateResponseParams = {}
) => {
  const inputMessage = createRequestMessage(prompt);
  const response = await generateResponseMessage({
    ...options,
    messages: [inputMessage],
  });
  return getMesssageFromResponse(response);
};

export const getObjectFromPrompt = async (
  prompt: string,
  options: GenerateResponseParams = {}
) => {
  const inputMessage = createRequestMessage(prompt);
  const response = await generateResponseMessage({
    ...options,
    messages: [inputMessage],
  });
  return getObjectFromResponse(response);
};

export const useMessageThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Anthropic.Messages.MessageParam[]>(
    []
  );

  const updateThread = async (prompt: string, isNewThread: boolean = false) => {
    setIsLoading(true);
    try {
      const request = createRequestMessage(prompt);
      const currentMessages = isNewThread ? [] : messages;
      const response = await generateResponseMessage({
        messages: [...currentMessages, request],
        model: isNewThread ? Model.HAIKU : Model.SONNET,
      });

      const responseMessage: Anthropic.Messages.MessageParam = {
        role: "assistant",
        content: response.content,
      };

      setMessages((prevMessages) =>
        isNewThread
          ? [request, responseMessage]
          : [...prevMessages, request, responseMessage]
      );
    } catch (error) {
      console.error("Error updating thread:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const responses = useMemo(() => {
    return messages
      .filter((message) => message.role === "assistant")
      .map((message) =>
        typeof message.content[0] === "string"
          ? message.content[0]
          : "text" in message.content[0]
          ? message.content[0].text
          : ""
      );
  }, [messages]);

  return {
    isLoading,
    responses,
    updateThread,
  };
};
