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

export const generateInitialInsightPrompt = (
  cvText: string = "",
  selectedOptions: string[]
) => {
  return `
    Generate a short memo to a tech recruiter about a candidate from the CV.
    CV text: ${cvText}
    
    Focus on these skills: ${selectedOptions.join(", ")}
    
    If the skills are not tech-related and unrelated to software development, give a brief description of the skill and ignore the CV.
    
    For tech-related skills, refer to the CV to provide explicit references to job positions, companies, and dates where the skills are mentioned.
    Explain the skills in an easy-to-understand way.
    For tech-related skills, explain how the person has benefited the companies he has worked for using these skills.
    Describe the impact the person has had on the companies using these skills.
    
    Do not use a subject, greeting, or sign-off.
    Do not say that the person is a developer, as this is already implied.
    
    Separate the response into paragraphs with a maximum of 3 sentences each.
    Bold the mentions of the referenced skills.
    Use a mixture of long and short sentences and an informal but informative tone.
    Limit the response to 110 words.
    Refer to the person by name in the response.
    
    Conclude the memo with a listing of the jobs where the person used those skills and approximately how long he has been using them.
    Also, provide a witty, one-line, attention-grabbing tagline (don't use the name the person in the tagline). Don't wrap the tagline in quotes.

    Send the response in json format.
    The json should be an object with the following structure:
    {
      tagline: string;
      memo: string;
    }

    The memo should be the reponse paragraphs and the job listing.
    Replace newline characters with \n to ensure the JSON is valid.
    Return only the json object and nothing else before or after the json object.
  `;
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

export const getSkillGroupsPrompt = (cvText: string): string => `
        You are an expert in CV analysis and have hipster-level knowledge of trending technologies.
        You always pick newer technologies (for example, typescript over javascript, Next.js over react, aws over azure, etc.)
        and ignore out-dated or unimpressive technologies (for example, php, html, wordpress, etc.)
        You are looking for the most impressive technologies and skills that the candidate has to offer.

        You will be given a CV and asked to group the skills into categories.
        1) This is the text of the CV: 
        ===START OF TEXT===
        ${cvText}
        ===END OF TEXT===
        
        2) Decide on 3 most relevant categories that you would like to group the skills into in the response . 
        The last category should include mainly soft skills but don't name it "soft skills".

        3) In the response, isolate skills from the CV that are trending and would match the categories.
        If a skill is made by the same company as another skill, group them together in the format "Skill + Skill".
        Count this as 1 skill and do not repeat those skills individually in the response.
      
        4) Send the response in json format.
        The json should be an array of objects with the following structure:
        [{
          name: string; // The name of the skill category
          skills: string[]; 
        }]
        
        Your response should not contain any other text or formatting.
        The first 2 categories should have between 6 and 8 skills.
        The last category with mainly soft skills should have a maximum of 3 skills.
        No skills should be repeated across categories in the response.
        `;

export const getSkillGroupsPromptV2: (
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
  
  const prompt = cvText;

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
      },
    },
  ];

  const tool_choice: Anthropic.Messages.MessageCreateParams.ToolChoiceTool = {
    type: "tool",
    name: "skill-group-v2",
  };

  return { system, tools, tool_choice, prompt };
};
