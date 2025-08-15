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
  SONNET = "claude-sonnet-4-20250514",
  HAIKU = "claude-3-5-haiku-latest",
  OPUS = "claude-3-5-opus-latest",
}

export interface ConversationGenerator {
  system: MessageCreateParamsBase["system"];
  tools: Tool[];
  validateResponse: (response: any) => boolean;
}
