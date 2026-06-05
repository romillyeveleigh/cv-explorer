import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";
import {
  Message,
  MessageParam,
  MessageCreateParamsBase,
} from "@anthropic-ai/sdk/resources/messages.mjs";

export type SkillGroup = {
  name: string;
  skills: string[];
};

export type Insight = {
  content: string;
  step: number;
  headline?: string;
};

export const enum Model {
  SONNET = "claude-sonnet-4-6",
  HAIKU = "claude-haiku-4-5",
  OPUS = "claude-opus-4-8",
}

export interface ConversationGenerator {
  system: MessageCreateParamsBase["system"];
  tools: Tool[];
  validateResponse: (response: any) => boolean;
}
