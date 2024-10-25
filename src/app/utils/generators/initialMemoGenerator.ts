import { ConversationGenerator } from "@/app/utils/types";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

export type InitialMemoGeneratorResponse = {
  tagline: string;
  memo: string;
};

const system = `
    You are an expert in CV analysis with hipster-level knowledge of trending technologies.
    Write a short memo (strictly under 90 words) to a tech recruiter about a candidate.
    Focus on the given list of skills and CV.

    If skills are not tech-related, briefly describe them and ignore the CV.
    For tech skills, reference specific jobs, companies, and dates from the CV.
    Explain skills simply and their impact on companies.

    Use 2-3 short paragraphs. No subject, greeting, or sign-off.
    Bold skill mentions. Use an informal but informative tone.
    Refer to the person by name. If the candidate's name is Romilly, then the candidate is male.

    End with a bullet list of jobs using those skills and experience duration. 
    Provide a witty, one-line tagline (don't use the person's name).
    If your response exceeds 90 words, please retry with a more concise version.
  `;

const tools: Tool[] = [
  {
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
  },
];

export const initialMemoGenerator: ConversationGenerator = {
  system,
  tools,
};
