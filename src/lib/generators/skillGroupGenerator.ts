import { SkillGroup } from "@/types";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";
import { ConversationGenerator } from "@/types";

export type SkillGroupGeneratorResponse = {
  name: string;
  professionalTitle: string;
  skillGroups: SkillGroup[];
};

const validateResponse = (response: any) => {
  return (
    typeof response.name === "string" &&
    typeof response.professionalTitle === "string" &&
    Array.isArray(response.skillGroups) &&
    response.skillGroups.every(
      (group: any) => typeof group.name === "string" && Array.isArray(group.skills)
    )
  );
};

const system = `
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

const tools: Tool[] = [
  {
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
  },
];

export const skillGroupGenerator: ConversationGenerator = {
  system,
  tools,
  validateResponse,
};
