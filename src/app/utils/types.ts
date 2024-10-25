export type SkillGroup = {
    name: string;
    skills: string[];
  };
  
export type Insight = {
    content: string;
    step: number;
    headline?: string;
  };

  export const enum Model {
    SONNET = "claude-3-sonnet-20240229",
    HAIKU = "claude-3-haiku-20240307",
    OPUS = "claude-3-opus-20240229",
  }