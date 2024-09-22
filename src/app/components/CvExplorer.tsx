"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Upload, FileText, InfoIcon, RotateCcw } from "lucide-react";

type SkillGroup = {
  name: string;
  skills: string[];
};

type Insight = {
  content: string;
  step: number;
};

export default function CVExplorer() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("Romilly_Eveleigh_CV.pdf");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<SkillGroup[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [headline, setHeadline] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingInitialInsight, setIsGeneratingInitialInsight] =
    useState(false);
  const [isGeneratingMoreInsights, setIsGeneratingMoreInsights] =
    useState(false);
  const [isFirstInsightGenerated, setIsFirstInsightGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload demo data
    const initialSkillGroups: SkillGroup[] = [
      {
        name: "Web Development",
        skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
      },
      {
        name: "Data Science",
        skills: [
          "Python",
          "Data Analysis",
          "Machine Learning",
          "SQL",
          "Statistics",
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
    setSkillGroups(initialSkillGroups);
  }, []);

  useEffect(() => {
    const filtered = skillGroups
      .map((group) => ({
        ...group,
        skills: group.skills.filter(
          (skill) =>
            skill.toLowerCase().includes(searchSkill.toLowerCase()) &&
            !selectedSkills.includes(skill)
        ),
      }))
      .filter((group) => group.skills.length > 0);
    setFilteredGroups(filtered);
  }, [searchSkill, skillGroups, selectedSkills]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      // Simulate CV analysis
      setIsLoading(true);
      setTimeout(() => {
        const newSkillGroups: SkillGroup[] = [
          {
            name: "Web Development",
            skills: [
              "JavaScript",
              "React",
              "Node.js",
              "TypeScript",
              "Vue.js",
              "Angular",
            ],
          },
          {
            name: "Data Science",
            skills: [
              "Python",
              "Data Analysis",
              "Machine Learning",
              "SQL",
              "R",
              "TensorFlow",
            ],
          },
          {
            name: "Project Management",
            skills: [
              "Agile",
              "Scrum",
              "Kanban",
              "PRINCE2",
              "Six Sigma",
              "Team Leadership",
            ],
          },
          {
            name: "Cloud Technologies",
            skills: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
          },
        ];
        setSkillGroups(newSkillGroups);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSearchSkill("");
  };

  const handleSearchSkill = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      searchSkill &&
      !selectedSkills.includes(searchSkill) &&
      !skillGroups.some((group) => group.skills.includes(searchSkill))
    ) {
      setSelectedSkills([...selectedSkills, searchSkill]);
      setSkillGroups((prevGroups) => {
        const customSkillGroup = prevGroups.find(
          (group) => group.name === "Custom Skills"
        );
        if (customSkillGroup) {
          return prevGroups.map((group) =>
            group.name === "Custom Skills"
              ? { ...group, skills: [...group.skills, searchSkill] }
              : group
          );
        } else {
          return [
            ...prevGroups,
            { name: "Custom Skills", skills: [searchSkill] },
          ];
        }
      });
      setSearchSkill("");
    }
  };

  const generateInsight = () => {
    setIsGeneratingInitialInsight(true);
    // Simulate insight generation
    setTimeout(() => {
      const newInsight = {
        content: `Based on the selected skills (${selectedSkills.join(
          ", "
        )}), the CV shows strong proficiency in web development and data science. The candidate has experience with modern JavaScript frameworks and Python-based data analysis tools. They also demonstrate project management skills, particularly in Agile methodologies.`,
        step: 1,
      };
      setInsights([newInsight]);
      setHeadline(
        "Versatile Tech Professional with Full-Stack and Data Science Expertise"
      );
      setIsGeneratingInitialInsight(false);
      setIsFirstInsightGenerated(true);
    }, 2000);
  };

  const handleShowMore = () => {
    setIsGeneratingMoreInsights(true);
    // Simulate generating more content
    setTimeout(() => {
      const newInsights = [
        "Additionally, the candidate shows potential for leadership roles, given their experience in team management and Scrum practices. Their diverse skill set suggests they could be a valuable asset in cross-functional teams, bridging the gap between technical and managerial roles.",
        "The CV indicates a strong foundation in both front-end and back-end technologies, making the candidate suitable for full-stack development positions. Their experience with TypeScript suggests an attention to code quality and type safety.",
        "With skills in machine learning and data analysis, the candidate could contribute to data-driven decision-making processes. This combination of technical and analytical skills is highly valued in today's data-centric business environment.",
        "The candidate's proficiency in SQL, coupled with their data analysis skills, indicates they could excel in roles involving database management and data warehousing. This skill set is crucial for maintaining and optimizing data infrastructure.",
        "Given their diverse skill set, the candidate appears well-suited for roles in tech consulting or as a technical product manager. Their ability to understand both technical and business aspects could be invaluable in translating between technical and non-technical stakeholders.",
      ];
      const nextStep = insights.length + 1;
      const newInsight = {
        content: newInsights[(nextStep - 2) % newInsights.length],
        step: nextStep,
      };
      setInsights([...insights, newInsight]);
      setIsGeneratingMoreInsights(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedSkills([]);
    setInsights([]);
    setHeadline("");
    setIsFirstInsightGenerated(false);
    setSkillGroups((prevGroups) =>
      prevGroups.filter((group) => group.name !== "Custom Skills")
    );
  };

  useEffect(() => {
    if (insightContentRef.current) {
      insightContentRef.current.scrollTop =
        insightContentRef.current.scrollHeight;
    }
  }, [insights]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90 ">
        <Card className="lg:h-[calc(70vh-2rem)] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>CV Analysis</CardTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">{fileName}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current CV: {fileName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Change CV
              </Button>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-6 overflow-hidden pt-6">
            <div className="flex-grow flex flex-col min-h-0">
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Search, select, or add new skills
              </p>
              <form onSubmit={handleSearchSkill} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    placeholder="Search or enter a new skill"
                  />
                  <Button type="submit">Add</Button>
                </div>
              </form>
              <div className="overflow-y-auto flex-grow">
                <div className="space-y-4">
                  {(searchSkill ? filteredGroups : skillGroups).map(
                    (group, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-2">{group.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {group.skills.map((skill) => (
                            <Button
                              key={skill}
                              variant={
                                selectedSkills.includes(skill)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleSkillSelect(skill)}
                            >
                              {skill}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {selectedSkills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Selected Skills</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Skills that will be used for CV analysis
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-sm cursor-pointer"
                      onClick={() => handleSkillSelect(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={generateInsight}
                disabled={
                  selectedSkills.length === 0 ||
                  isGeneratingInitialInsight ||
                  isGeneratingMoreInsights
                }
                className="flex-grow"
              >
                {isGeneratingInitialInsight ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Brewing insights...
                  </>
                ) : (
                  "Generate Insight"
                )}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      disabled={
                        selectedSkills.length === 0 && insights.length === 0
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="sr-only">Reset</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset selected skills and insights</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:h-[calc(70vh-2rem)] flex flex-col">
          <CardHeader>
            <CardTitle>CV Insight</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col overflow-hidden">
            {isGeneratingInitialInsight ? (
              <div className="flex-grow flex flex-col justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Analyzing CV superpowers...
                </p>
              </div>
            ) : insights.length === 0 ? (
              <div className="bg-muted p-4 rounded-lg flex items-start space-x-4">
                <InfoIcon className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Welcome to the CV Explorer
                  </h3>
                  <p className="text-muted-foreground">
                    This is a demo insight based on Romilly's default CV. Select
                    skills to generate a personalized insight based on the CV
                    content and your selected skills.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {headline && (
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-primary">
                      {headline}
                    </h2>
                  </div>
                )}
                <div
                  ref={insightContentRef}
                  className="flex-grow overflow-y-auto mb-4 pr-4"
                >
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-border"></div>
                    {insights.map((insight, index) => (
                      <div key={index} className="mb-4 last:mb-0 relative pl-6">
                        {index > 0 && (
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                        )}
                        <p className="whitespace-pre-line">{insight.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {isFirstInsightGenerated && (
                  <Button
                    onClick={handleShowMore}
                    variant="outline"
                    className="w-full"
                    disabled={isGeneratingMoreInsights}
                  >
                    {isGeneratingMoreInsights ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating More Insights...
                      </>
                    ) : (
                      "More Insights"
                    )}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
