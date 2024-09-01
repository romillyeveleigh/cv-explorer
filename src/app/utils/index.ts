export const generatePrompt = (
  cvText: string = "",
  selectedOptions: string[]
) => {
  return `Generate a short memo to a tech recruiter. 
    The memo should promote the skillset of a male candidate called Romilly.
    Read the text of his CV: ${cvText}
    
    The memo should focus only on the skills listed as follows: ${selectedOptions.join(
      ", "
    )}.
    If the skills are not tech related, and unrelated to software development, give a brief description of the skill and ignore the CV.

    If the skills are tech related, refer to the CV to provide explicit references to the jobs positions, companies and dates listed in the CV where the skills are mentioned.
    Explain the skills in a way that is easy to understand.
    If the skills are tech related, explain how Romilly has benefited the companies he has worked for using the skills.
    If the skills are tech related, explain the impact that Romilly has had on the companies he has worked for using the skills.
    
    Do not use a subject or greeting or a sign off. 
    Do not say that Romilly is a developer, as this is already implied. 
   
    Separate the response into paragraphs that are maximum 3 sentences each. 
    Please respond in multiple paragraphs, with each main point in its own paragraph. 
    The first paragraph should be one line and be a witty 1-line, attention grabbing tagline (but don't use the name Romilly in the tagline). Don't wrap the tagline in quotes.
    Bold the mentions of the skills referenced.
    Use a mixture of long and short sentences and an informal but informative tone.
    Limit the response to 150 words or less.
    Follow the memo with a listing of the jobs where Romilly used those skills and approximately how long he has been using them`;
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
