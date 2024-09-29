import Anthropic from "@anthropic-ai/sdk";

// Helper function to randomly select items from an array
const getRandomItems = <T>(array: T[], n: number): T[] => {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// Helper function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const leadershipSkills = {
  topLeadershipSkills: [
    "Leading teams",
    "Planning projects",
    "Setting goals",
    "Teaching others",
    "Helping team grow",
    "Checking team progress",
    "Managing money",
    "Saving costs",
    "Showing value",
    "Planning for success",
    "Growing income",
    "Understanding systems",
    "Designing solutions",
    "Checking code",
    "Setting tech rules",
    "Planning tech future",
    "Bringing new ideas",
    "Leading flexible teams",
    "Organizing work",
    "Making things simpler",
    "Talking clearly",
    "Solving arguments",
    "Making choices",
    "Fixing problems",
    "Understanding feelings",
    "Helping with changes",
    "Working with different teams",
    "Updating old systems",
    "Seeing future tech needs",
    "Planning long-term",
    "Sharing expert ideas",
    "Finding good workers",
    "Making teams better",
    "Creating good workplace",
    "Including everyone",
    "Finishing on time",
    "Staying in budget",
    "Ensuring good work",
    "Handling problems",
    "Improving how we work",
    "Always getting better",
    "Keeping customers happy",
    "Talking to bosses",
    "Making deals",
    "Understanding trends",
    "Knowing competitors",
    "Using best ways to work",
  ],
};

const perspectivePrompts = [
  "Imagine you're recruiting for a startup founder. How would the founder apply these skills?",
  "From the perspective of a client who is senior executive, what's the most crucial aspect of these skills?",
  "If you were mentoring a junior leader, which of these skills would you emphasize and why?",
  "As a tech industry analyst, how do you see these skills evolving in the next 5 years?",
];

const comparisonPrompts = [
  "Compare and contrast how these skills might be applied differently in a large corporation versus a small startup.",
  "Discuss how these skills might be valued differently in various tech sectors (e.g., AI, cybersecurity, e-commerce).",
  "Explore how the importance of these skills might vary between different leadership roles (e.g., CTO, Product Manager, Team Lead).",
];

export const getInitialInsightMessageParams = (
  cvText: string = "",
  selectedOptions: string[]
) => {
  const system = `
  You are an expert in CV analysis with hipster-level knowledge of trending technologies.
Write a short memo (strictly under 110 words) to a tech recruiter about a candidate.
Focus on the given list of skills and CV.

If skills are not tech-related, briefly describe them and ignore the CV.
For tech skills, reference specific jobs, companies, and dates from the CV.
Explain skills simply and their impact on companies.

Use 2-3 short paragraphs. No subject, greeting, or sign-off.
Bold skill mentions. Use an informal but informative tone.
Refer to the person by name.

End with a bullet list of jobs using those skills and experience duration. 

Provide a witty, one-line tagline (don't use the person's name).

If your response exceeds 110 words, please retry with a more concise version.
  `;

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "skill-group-v2",
      input_schema: {
        type: "object",
        name: {
          type: "string",
          description: "The name of the person",
        },
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

  const tool_choice: Anthropic.Messages.MessageCreateParams.ToolChoiceTool = {
    type: "tool",
    name: "skill-group-v2",
  };

  const prompt = `
  Skills to focus on: 
  ${selectedOptions.join(", ")}
  
  CV text: 
  ${cvText}
  `;

  return { system, tools, tool_choice, prompt };
};

export const generateFollowUpPrompt = (selectedOptions: string[]): string => {
  const followUpPrompt = `Based on our previous discussion about ${selectedOptions.join(
    ", "
  )}, please expand on your first response. 
  Focus on advanced features, real-world applications, or how these technologies integrate with each other. 
  If possible, include some practical examples or case studies.

  Describe the advantages that having this person lead or mentor a team will bring. Address this point to the recruiter in the second-person
  using words like "you", and "if you want", "hired", "choosing", "deciding", "trust", "you can rely on" or "deciding on", "looking for".
  Tie in the advantage to one or more of the most relevant leadership skills from this list: ${leadershipSkills.topLeadershipSkills.join(
    ", "
  )}

  Rules:
  Do not repeat the same answer as before.
  Use a mix of short and medium length sentences.
  Strictly limit the response to 60 words or less.
  The response should be 2 paragraphs.
  Do not include the previous response in the new response.
  `;
  return followUpPrompt;
};

export const validateInput = (
  cvText: string = "",
  selectedOptions: string[] = []
): boolean => {
  return cvText.trim().length > 0 && selectedOptions.length > 0;
};

export const getSkillGroupsMessageParams: (
  cvText: string
) => Partial<Anthropic.Messages.MessageCreateParamsNonStreaming> & {
  prompt: string;
} = (cvText) => {
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

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "skill-group-v2",
      input_schema: {
        type: "object",
        categories: {
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
        name: {
          type: "string",
          description: "The name of the person",
        },
        professional_title: {
          type: "string",
          description: "The professional title of the person",
        },
      },
    },
  ];

  const tool_choice: Anthropic.Messages.MessageCreateParams.ToolChoiceTool = {
    type: "tool",
    name: "skill-group-v2",
  };

  return { system, tools, tool_choice, prompt: cvText };
};
