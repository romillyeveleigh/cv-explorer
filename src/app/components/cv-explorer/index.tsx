"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";
import { fileIsSupported } from "@/app/utils";
import { Model } from "@/app/hooks/useMessageThread";
import { CV_TEXT } from "../InputForm";
import { useClaudeConversationV2 } from "@/app/hooks/use-claude-conversation-v2";
import {
  getToolUseDataFromMessages,
  SkillGroupGenerator,
  DEFAULT_SKILL_GROUP_GENERATOR,
  InitialMemoGenerator,
  DEFAULT_INITIAL_MEMO_GENERATOR,
  InsightGenerator,
  DEFAULT_INSIGHT_GENERATOR,
  getCvText,
  INSIGHT_GENERATOR_SCHEMA,
  INITIAL_MEMO_GENERATOR_SCHEMA,
  SKILL_GROUP_GENERATOR_SCHEMA,
} from "./utils";

export default function CVExplorer() {
  const [isGeneratingInitialInsight, setIsGeneratingInitialInsight] =
    useState(false);
  const [isLoadingMoreInsights, setIsLoadingMoreInsights] = useState(false);
  const [fileName, setFileName] = useState("Romilly_Eveleigh_CV.pdf");
  const [cvText, setCvText] = useState<string | null>(CV_TEXT);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(false)

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

  const {
    messages,
    isLoading,
    sendMessage,
    reset: resetMessages,
  } = useClaudeConversationV2();
  // console.log("🚀 ~ CVExplorer ~ messages:", messages);

  const res2 = getToolUseDataFromMessages<SkillGroupGenerator>(
    messages,
    "skill-group-generator",
    DEFAULT_SKILL_GROUP_GENERATOR
  )[0];
  const { name, professionalTitle, skillGroups } = res2;
  console.log("🚀 ~ CVExplorer ~ res2:", res2);

  const res1 = getToolUseDataFromMessages<InitialMemoGenerator>(
    messages,
    "initial-memo-generator",
    DEFAULT_INITIAL_MEMO_GENERATOR
  )[0];

  const { tagline: headline, memo } = res1;
  console.log("🚀 ~ CVExplorer ~ res1:", res1);
  // console.log("🚀 ~ CVExplorer ~ memo:", memo);
  // console.log("🚀 ~ CVExplorer ~ headline:", headline);

  const insights = getToolUseDataFromMessages<InsightGenerator>(
    messages,
    "insight-generator",
    DEFAULT_INSIGHT_GENERATOR
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsGeneratingInitialInsight(true);
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
          system,
          tools: [SKILL_GROUP_GENERATOR_SCHEMA],
          tool_choice: { type: "tool", name: "skill-group-generator" },
        },
        true
      );
      setFileName(file.name);
      setCvText(cvText);
      setSelectedSkills([]);
    } catch (error) {
      console.error("Error generating skill groups:", error);
      setError("Error generating skill groups");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsGeneratingInitialInsight(false);
    }
  };

  const generateInitialMemo = async () => {
    if (!cvText) {
      setError("No CV text found");
      return;
    }

    setIsGeneratingInitialInsight(true);

    const system = `
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
  `;

    const content = `Focus on these skills: ${selectedSkills.join(", ")}
    Here is the CV: ${cvText}`;

    await sendMessage(
      content,
      {
        model: Model.HAIKU,
        temperature: 0.8,
        system,
        tools: [INITIAL_MEMO_GENERATOR_SCHEMA],
        tool_choice: { type: "tool", name: "initial-memo-generator" },
      },
      true
    );

    setIsGeneratingInitialInsight(false);
  };

  const handleShowMore = () => {
    setIsLoadingMoreInsights(true);
    sendMessage(
      "Show me more insights.",
      {
        model: Model.HAIKU,
        temperature: 0.8,
        tool_choice: { type: "tool", name: "insight-generator" },
        tools: [INSIGHT_GENERATOR_SCHEMA],
      },
      false
    );
    setIsLoadingMoreInsights(false);
  };

  const onReset = () => {
    setSelectedSkills([]);
    setFileName("Romilly_Eveleigh_CV.pdf");
    resetMessages();
  };

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
            generateInsight={generateInitialMemo}
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            isLoading={isLoading || isGeneratingInitialInsight}
            error={error}
            reset={onReset}
          />
        </Card>

        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvInsight
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            headline={headline}
            memo={memo}
            insights={insights}
            isFirstInsightGenerated={Boolean(memo && headline)}
            setInsights={() => null}
            handleShowMore={handleShowMore}
            isLoadingMoreInsights={isLoadingMoreInsights}
          />
        </Card>
      </div>
    </div>
  );
}
