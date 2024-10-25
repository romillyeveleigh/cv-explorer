"use client";

import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { fileIsSupported } from "@/app/utils";
import {
  DEFAULT_SKILL_GROUPS,
  DEFAULT_CV_TEXT,
  DEFAULT_NAME,
  DEFAULT_PROFESSIONAL_TITLE,
} from "@/app/config";
import { Model } from "@/types";
import { useClaudeConversation } from "@/app/hooks";
import { getToolUseDataByToolName, getCvText } from "./utils";
import {
  skillGroupGenerator,
  initialMemoGenerator,
  insightGenerator,
  InsightGeneratorResponse,
  InitialMemoGeneratorResponse,
  SkillGroupGeneratorResponse,
} from "@/lib/generators";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";

const DEFAULTS = {
  name: DEFAULT_NAME,
  professionalTitle: DEFAULT_PROFESSIONAL_TITLE,
  skillGroups: DEFAULT_SKILL_GROUPS,
  selectedSkills: [] as string[],
  cvText: DEFAULT_CV_TEXT,
  fileName: `${DEFAULT_NAME}_CV.pdf`,
};

export default function CVExplorer() {
  const [cvState, setCvState] = useState(DEFAULTS);

  const [loadingState, setLoadingState] = useState({
    cvText: false,
    skillGroups: false,
    initialMemo: false,
    moreInsights: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [headline, setHeadline] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const { messages, sendMessage, resetMessages } = useClaudeConversation();
  const insights = getToolUseDataByToolName<InsightGeneratorResponse>(
    messages,
    "insight-generator"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLoading = (key: keyof typeof loadingState, value: boolean) => {
    setLoadingState((prev) => ({ ...prev, [key]: value }));
  };

  const updateCvState = (updates: Partial<typeof cvState>) => {
    setCvState((prev) => ({ ...prev, ...updates }));
  };

  const onReset = () => {
    updateCvState(DEFAULTS);
    setMemo("");
    setHeadline("");
    resetMessages();
  };

  const handleGenerateSkillGroups = async (cvText: string) => {
    setLoading("skillGroups", true);
    try {
      const response = await sendMessage(
        cvText,
        {
          model: Model.HAIKU,
          temperature: 0.8,
          system: skillGroupGenerator.system,
          tools: skillGroupGenerator.tools,
          tool_choice: { type: "tool", name: skillGroupGenerator.tools[0].name },
        },
        true
      );

      if (response?.content[0].type !== "tool_use") {
        throw new Error("No tool use found in response");
      }

      if (!skillGroupGenerator.validateResponse(response.content[0].input)) {
        throw new Error("Invalid format for skill groups");
      }

      const { name, professionalTitle, skillGroups } = response.content[0]
        .input as SkillGroupGeneratorResponse;

      updateCvState({ name, professionalTitle, skillGroups });
    } catch (error) {
      console.error("Error generating skill groups:", error);
      setError("Error generating skill groups");
    } finally {
      setLoading("skillGroups", false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading("cvText", true);
    const file = event.target.files?.[0];

    if (!file) {
      setLoading("cvText", false);
      return;
    }

    if (!fileIsSupported(file)) {
      console.log("File type is not supported");
      setError("File type not supported");
      setLoading("cvText", false);
      return;
    }

    try {
      const cvText = await getCvText(file);
      console.log("CV text sample:", `"${cvText.slice(0, 100)}..." `);

      await handleGenerateSkillGroups(cvText);

      updateCvState({
        fileName: file.name,
        cvText,
        selectedSkills: [],
      });
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Error processing file");
    } finally {
      setLoading("cvText", false);
    }
  };

  const generateInitialMemo = async () => {
    if (!cvState.cvText) {
      setError("No CV text found");
      return;
    }

    setLoading("initialMemo", true);

    const content = `Focus on these skills: ${cvState.selectedSkills.join(", ")}
    Here is the CV: ${cvState.cvText}`;

    try {
      const response = await sendMessage(
        content,
        {
          model: Model.SONNET,
          temperature: 1,
          system: initialMemoGenerator.system,
          tools: initialMemoGenerator.tools,
          tool_choice: { type: "tool", name: initialMemoGenerator.tools[0].name },
        },
        true
      );

      if (response?.content[0].type !== "tool_use") {
        throw new Error("No tool use found in response");
      }

      if (!initialMemoGenerator.validateResponse(response.content[0].input)) {
        throw new Error("Invalid format for initial memo");
      }

      const { tagline, memo } = response.content[0].input as InitialMemoGeneratorResponse;
      setHeadline(tagline);
      setMemo(memo);
    } catch (error) {
      console.error("Error generating initial memo:", error);
      setError("Error generating initial memo");
    } finally {
      setLoading("initialMemo", false);
    }
  };

  const generateInsight = async () => {
    setLoading("moreInsights", true);
    try {
      await sendMessage(
        "Show me more insights.",
        {
          model: Model.HAIKU,
          temperature: 0.8,
          tools: insightGenerator.tools,
          tool_choice: { type: "tool", name: insightGenerator.tools[0].name },
        },
        false
      );
    } catch (error) {
      console.error("Error generating insight:", error);
      setError("Error generating insight");
    } finally {
      setLoading("moreInsights", false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90">
        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvAnalysis
            {...cvState}
            setSelectedSkills={(skills) => updateCvState({ selectedSkills: skills })}
            handleFileUpload={handleFileUpload}
            generateInitialMemo={generateInitialMemo}
            isGeneratingInitialMemo={loadingState.initialMemo}
            isLoading={
              loadingState.skillGroups ? "skill-groups" : loadingState.cvText ? "cv-text" : false
            }
            error={error}
            reset={onReset}
            onClickUpload={() => fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
          />
        </Card>

        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvInsight
            isGeneratingInitialInsight={loadingState.initialMemo}
            headline={headline}
            memo={memo}
            insights={insights}
            handleShowMore={generateInsight}
            isLoadingMoreInsights={loadingState.moreInsights}
            name={cvState.name}
            onClickUpload={() => fileInputRef.current?.click()}
          />
        </Card>
      </div>
    </div>
  );
}
