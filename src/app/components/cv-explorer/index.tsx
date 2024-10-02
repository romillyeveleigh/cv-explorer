"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";
import {
  fileIsSupported,
  getInitialInsightMessageParams,
  getSkillGroupsMessageParams,
  SKILL_GROUPS,
} from "@/app/utils";
import { Insight, SkillGroup } from "@/app/utils/types";
import pdfToText from "@/app/utils/pdfToText";
import wordToText from "@/app/utils/wordToText";
import { getObjectFromPrompt, Model } from "@/app/hooks/useMessageThread";
import { CV_TEXT } from "../InputForm";
import { useClaudeConversation } from "@/app/hooks/use-claude-conversation";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";
import { useClaudeConversationV2 } from "@/app/hooks/use-claude-conversation-v2";

const getCvText: (file: File) => Promise<string> = async (file) => {
  if (file.type === "application/pdf") {
    console.log("PDF file detected");
    return await pdfToText(file);
  } else if (file.type === "text/plain") {
    console.log("Plain text file detected");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error("Error reading plain text file"));
      };
      reader.readAsText(file);
    });
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("Word file detected");
    return await wordToText(file);
  }
};

export default function CVExplorer() {
  // const [name, setName] = useState<string>("");
  // const [professionalTitle, setProfessionalTitle] = useState<string>("");
  const [fileName, setFileName] = useState("");
  // const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  // const [insights, setInsights] = useState<Insight[]>([]);
  // const [headline, setHeadline] = useState<string>("");
  const [isGeneratingInitialInsight, setIsGeneratingInitialInsight] =
    useState(false);
  const [isLoadingMoreInsights, setIsLoadingMoreInsights] = useState(false);

  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);

  useEffect(() => {
    // Preload default data
    // setSkillGroups(SKILL_GROUPS);
    // setName("Romilly Eveleigh");
    // setProfessionalTitle("Full Stack Developer");
    setCvText(CV_TEXT);
    setFileName("Romilly_Eveleigh_CV.pdf");
  }, []);

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
        name: {
          type: "string",
          description: "The name of the person",
        },
        professionalTitle: {
          type: "string",
          description: "The professional title of the person",
        },
      },
    },
    {
      name: "insight-generator",
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
        step: {
          type: "number",
          description: "The step of the insight",
        },
      },
    },
  ];

  const { messages, isLoading, sendMessage, reset } = useClaudeConversationV2({
    system,
    tools,
  });
  console.log("🚀 ~ CVExplorer ~ messages:", messages);

  const initialResponse = messages.find(
    (message) => message.role === "assistant"
  );

  const { name, professionalTitle, skillGroups } = initialResponse?.content[0]
    ?.input || {
    name: "Romilly Eveleigh",
    professionalTitle: "Full Stack Developer",
    skillGroups: SKILL_GROUPS,
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!fileIsSupported(file)) {
      console.log("File is not supported");
      setError("File type not supported");
      return;
    }
    try {
      const cvText = await getCvText(file);
      console.log("CV text sample:", `"${cvText.slice(0, 100)}..." `);
      await sendMessage(
        cvText,
        {
          model: Model.HAIKU,
          temperature: 0.8,
          tool_choice: { type: "tool", name: "skill-group-generator" },
        },
        true
      );
    } catch (error) {
      console.error("Error generating skill groups:", error);
      setError("Error generating skill groups");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const generateInsight = async () => {
    if (!cvText) {
      setError("No CV text found");
      return;
    }

    setIsGeneratingInitialInsight(true);

    // const { prompt, ...rest } = getInitialInsightMessageParams(
    //   cvText,
    //   selectedSkills
    // );

    const content = `
You are an expert in CV analysis with hipster-level knowledge of trending technologies.
Write a short memo (strictly under 90 words) to a tech recruiter about a candidate.
Focus on the given list of skills and CV.

If skills are not tech-related, briefly describe them and ignore the CV.
For tech skills, reference specific jobs, companies, and dates from the CV.
Explain skills simply and their impact on companies.

Use 2-3 short paragraphs. No subject, greeting, or sign-off.
Bold skill mentions. Use an informal but informative tone.
Refer to the person by name.

End with a bullet list of jobs using those skills and experience duration. 

Provide a witty, one-line tagline (don't use the person's name).

If your response exceeds 90 words, please retry with a more concise version.


  Based on the previously generated skill groups, focus on the skills: ${selectedSkills.join(
    ", "
  )}
  `;

    await sendMessage(content, {
      model: Model.HAIKU,
      temperature: 0.8,
      tool_choice: { type: "tool", name: "insight-generator" },
    });

    // const newInsight = await getObjectFromPrompt(prompt, {
    //   ...rest,
    //   model: Model.HAIKU,
    //   temperature: 0.8,
    // });

    // if (!newInsight || !newInsight.memo || !newInsight.tagline) {
    //   setError("No insight generated");
    //   return;
    // }

    // const { memo, tagline } = newInsight;

    // setInsights([{ content: memo, step: 1 }]);
    // setHeadline(tagline);
    // setHeadline(
    //   "Versatile Tech Professional with Full-Stack and Data Science Expertise"
    // );
    setIsGeneratingInitialInsight(false);
  };

  const handleShowMore = () => {
    setIsLoadingMoreInsights(true);
    // setTimeout(() => {
    //   const newInsights = [
    //     "Additionally, the candidate shows potential for leadership roles, given their experience in team management and Scrum practices. Their diverse skill set suggests they could be a valuable asset in cross-functional teams, bridging the gap between technical and managerial roles.",
    //     "The CV indicates a strong foundation in both front-end and back-end technologies, making the candidate suitable for full-stack development positions. Their experience with TypeScript suggests an attention to code quality and type safety.",
    //     "With skills in machine learning and data analysis, the candidate could contribute to data-driven decision-making processes. This combination of technical and analytical skills is highly valued in today's data-centric business environment.",
    //     "The candidate's proficiency in SQL, coupled with their data analysis skills, indicates they could excel in roles involving database management and data warehousing. This skill set is crucial for maintaining and optimizing data infrastructure.",
    //     "Given their diverse skill set, the candidate appears well-suited for roles in tech consulting or as a technical product manager. Their ability to understand both technical and business aspects could be invaluable in translating between technical and non-technical stakeholders.",
    //   ];
    //   const nextStep = insights.length + 1;
    //   const newInsight = {
    //     content: newInsights[(nextStep - 2) % newInsights.length],
    //     step: nextStep,
    //   };
    //   setInsights([...insights, newInsight]);

    // }, 1500);
    sendMessage(
      "Show me more insights",
      {
        model: Model.HAIKU,
        temperature: 0.8,
        tool_choice: { type: "auto" },
      },
      false
    );
    setIsLoadingMoreInsights(false);
  };

  const onReset = () => {
    setSelectedSkills([]);
    reset();
  };

  const initialInsight = messages.find(
    (message) =>
      message.role === "assistant" &&
      Array.isArray(message.content) &&
      message.content.find((content) => content.name === "insight-generator")
  );

  const initialInsightContent = initialInsight?.content[0]?.input;

  const { headline, memo, step } = initialInsightContent || {};

  const insights: Insight[] = useMemo(
    () => [{ headline, content: memo, step }],
    [headline, memo, step]
  );

  const isFirstInsightGenerated = useMemo(() => {
    return insights.length > 0;
  }, [insights]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90">
        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvAnalysis
            name={name}
            professionalTitle={professionalTitle}
            fileName={fileName}
            skillGroups={skillGroups}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            handleFileUpload={handleFileUpload}
            generateInsight={generateInsight}
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            isLoading={isLoading}
            error={error}
            reset={onReset}
          />
        </Card>

        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvInsight
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            insights={insights}
            headline={headline}
            isFirstInsightGenerated={isFirstInsightGenerated}
            setInsights={() => null}
            handleShowMore={handleShowMore}
            isLoadingMoreInsights={isLoadingMoreInsights}
          />
        </Card>
      </div>
    </div>
  );
}
