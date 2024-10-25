import { ConversationGenerator } from "@/app/utils/types";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

type InsightGeneratorResponse = {
  insight: string;
  step: number;
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


const defaultResponse: InsightGeneratorResponse = {
  insight: "",
  step: 0,
};

export const insightGenerator: ConversationGenerator<InsightGeneratorResponse> = {
  system,
  tools,
  defaultResponse,
};
