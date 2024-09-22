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

export const generatePrompt = (
  cvText: string = "",
  selectedOptions: string[]
) => {
  return `
    Generate a short memo to a tech recruiter about a male candidate named Romilly.
    CV text: ${cvText}
    
    Focus on these skills: ${selectedOptions.join(", ")}
    
    If the skills are not tech-related and unrelated to software development, give a brief description of the skill and ignore the CV.
    
    For tech-related skills, refer to the CV to provide explicit references to job positions, companies, and dates where the skills are mentioned.
    Explain the skills in an easy-to-understand way.
    For tech-related skills, explain how Romilly has benefited the companies he has worked for using these skills.
    Describe the impact Romilly has had on the companies using these skills.
    
    Do not use a subject, greeting, or sign-off.
    Do not say that Romilly is a developer, as this is already implied.
    
    Separate the response into paragraphs with a maximum of 3 sentences each.
    The first paragraph should be a witty, one-line, attention-grabbing tagline (don't use the name Romilly in the tagline). Don't wrap the tagline in quotes.
    Bold the mentions of the referenced skills.
    Use a mixture of long and short sentences and an informal but informative tone.
    Limit the response to 110 words.
    
    Follow the memo with a listing of the jobs where Romilly used those skills and approximately how long he has been using them.
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
