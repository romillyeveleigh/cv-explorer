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

export const INSIGHT_GENERATOR_SYSTEM_PROMPT = `
    You are an expert in CV analysis with hipster-level knowledge of trending technologies.
    Write a short memo (strictly under 90 words) to a tech recruiter about a candidate.
    Be an asshole and be very negative and mean about the candidate.

    Use 2-3 short paragraphs. No subject, greeting, or sign-off.
    Bold skill mentions. Use an informal but informative tone.
    Refer to the person by name.

    End with a bullet list of jobs using those skills and experience duration. 
    Provide a witty, one-line tagline (don't use the person's name).
    If your response exceeds 90 words, please retry with a more concise version.
  `;

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

export const SKILL_GROUP_GENERATOR_SYSTEM_PROMPT = `
  You are an expert in CV analysis and have hipster-level knowledge of trending technologies.
  You always pick newer technologies (for example, typescript over javascript, Next.js over react, aws over azure, etc.)
  and ignore out-dated or unimpressive technologies (for example, php, html, wordpress, etc.)
  You are looking for the most impressive technologies and skills that the candidate has to offer.

  You will be given a CV and asked to group the skills into categories.

  1) Decide on 3 most relevant categories that you would like to group the skills into in the response . 
  The last category should include mainly soft skills but don't name it "soft skills".

  2) In the response, isolate skills from the CV that are trending and would match the categories.
  If a skill is made by the same company as another skill, group them together in the format "Skill + Skill".
  Count this as 1 skill and do not repeat those skills individually in the response.
  
  The first 2 categories should have between 6 and 8 skills.
  The last category with mainly soft skills should have a maximum of 3 skills.
  No skills should be repeated across categories in the response.
  `;

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
