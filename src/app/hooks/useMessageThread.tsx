"use client";

import React, { useMemo, useState } from "react";

import Anthropic from "@anthropic-ai/sdk";

export const enum Model {
  SONNET = "claude-3-sonnet-20240229",
  HAIKU = "claude-3-haiku-20240307",
}

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

export const generateResponse = async (
  messages: Anthropic.Messages.MessageParam[],
  model: Model,
  temperature: number = 1
) => {
  return await getClient().messages.create({
    model: model,
    max_tokens: 1000,
    temperature,
    messages,
  });
};

const getMesssageFromResponse = (response: Anthropic.Messages.MessageParam) => {
  return typeof response.content[0] === "string"
    ? response.content[0]
    : "text" in response.content[0]
    ? response.content[0].text
    : "";
};

export const getMessageFromPrompt = async (
  prompt: string,
  model: Model = Model.HAIKU,
  temperature: number = 1
) => {
  const request = createRequestMessage(prompt);
  const response = await generateResponse([request], model, temperature);
  return getMesssageFromResponse(response);
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
      const response = await generateResponse(
        [...currentMessages, request],
        isNewThread ? Model.HAIKU : Model.SONNET
      );

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
