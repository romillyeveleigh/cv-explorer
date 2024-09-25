import { SkillGroup } from "./types";

export const OPTION_GROUPS = [
  {
    name: "Key Tech",
    options: [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "nodedotjs", label: "Node.js" },
      { id: "amazonwebservices", label: "AWS" },
    ],
  },
  {
    name: "Front End",
    options: [
      { id: "react", label: "React" },
      { id: "nextdotjs", label: "Next.js" },
      { id: "tailwindcss", label: "Tailwind CSS" },
      { id: "redux", label: "Redux" },
      { id: "html5", label: "HTML" },
      { id: "css3", label: "CSS" },
      { id: "bootstrap", label: "Bootstrap" },
      { id: "material-ui", label: "Material-UI" },
      { id: "react-testing-library", label: "React Testing Library" },
      { id: "graphql", label: "GraphQL" },
      { id: "apollographql", label: "Apollo" },
    ],
  },
  {
    name: "Full Stack",
    options: [
      { id: "Docker", label: "Docker" },
      { id: "CI", label: "CI/CD" },
      { id: "Git", label: "Git" },
      { id: "Jest", label: "Jest" },
      { id: "Cypress", label: "Cypress" },
      { id: "vercel", label: "Vercel" },
      { id: "firebase", label: "Firebase" },
      { id: "azure", label: "Azure" },
    ],
  },
  {
    name: "Databases",
    options: [
      { id: "postgresql", label: "PostgreSQL" },
      { id: "mysql", label: "MySQL" },
      { id: "mongodb", label: "MongoDB" },
      { id: "redis", label: "Redis" },
      { id: "DynamoDB", label: "DynamoDB" },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "Web Development",
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  },
  {
    name: "Backend Development",
    skills: [
      "AWS",
      "Docker",
      "CI/CD",
      "Git",
      "Jest",
      "Cypress",
      "Vercel",
      "Firebase",
      "Azure",
    ],
  },
  {
    name: "Project Management",
    skills: [
      "Agile",
      "Scrum",
      "Kanban",
      "Risk Management",
      "Stakeholder Management",
    ],
  },
];
