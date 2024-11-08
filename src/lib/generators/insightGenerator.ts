import { ConversationGenerator } from "@/types";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

export type InsightGeneratorResponse = {
  insight: string;
  step: number;
};

const validateResponse = (response: any) => {
  return typeof response.insight === "string" && typeof response.step === "number";
};

const system = "";

const tools: Tool[] = [
  {
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
  },
];

export const insightGenerator: ConversationGenerator = {
  system,
  tools,
  validateResponse,
};
