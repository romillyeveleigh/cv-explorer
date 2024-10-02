import { SKILL_GROUPS } from "@/app/utils";
import pdfToText from "@/app/utils/pdfToText";
import { SkillGroup } from "@/app/utils/types";
import wordToText from "@/app/utils/wordToText";
import Anthropic from "@anthropic-ai/sdk";
import { Tool, ToolUseBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

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
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("Word file detected");
    return await wordToText(file);
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

export function getToolUseDataFromMessages<T = any>(
  messages: Anthropic.Messages.MessageParam[],
  toolName: string
) {
  return messages
    .map((message) => getToolUseDataFromMessage<T>(message, toolName))
    .filter((data): data is T => data !== undefined);
}

export type InsightGenerator = {
  insight: string;
  step: number;
};

export const INSIGHT_GENERATOR_SCHEMA: Tool = {
  name: "insight-generator",
  input_schema: {
    type: "object",
    insght: {
      type: "string",
      description: "The memo for the recruiter in markdown format",
    },
    step: {
      type: "number",
      description: "The step of the insight",
    },
  },
};

export const DEFAULT_INSIGHT_GENERATOR: InsightGenerator = {
  insight: "",
  step: 0,
};

export type InitialMemoGenerator = {
  tagline: string;
  memo: string;
};

export const INITIAL_MEMO_GENERATOR_SCHEMA: Tool = {
  name: "initial-memo-generator",
  input_schema: {
    type: "object",
    tagline: {
      type: "string",
      description: "The tagline for the memo",
    },
    memo: {
      type: "string",
      description: "The memo for the recruiter in markdown format",
    },
  },
};

export const DEFAULT_INITIAL_MEMO_GENERATOR: InitialMemoGenerator = {
  tagline: "",
  memo: "",
};

export type SkillGroupGenerator = {
  name: string;
  professionalTitle: string;
  skillGroups: SkillGroup[];
};

export const SKILL_GROUP_GENERATOR_SCHEMA: Tool = {
  name: "skill-group-generator",
  input_schema: {
    type: "object",
    name: {
      type: "string",
      description: "The name of the person",
    },
    professionalTitle: {
      type: "string",
      description: "The professional title of the person",
    },
    skillGroups: {
      type: "array",
      description: "The categories to group the skills into",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the skill category",
          },
          skills: {
            type: "array",
            description: "The skills in the category",
            items: {
              type: "string",
              description: "The name of the skill",
            },
          },
        },
      },
    },
  },
};

export const DEFAULT_SKILL_GROUP_GENERATOR: SkillGroupGenerator = {
  name: "Romilly Eveleigh",
  professionalTitle: "Full Stack Developer",
  skillGroups: SKILL_GROUPS,
};
