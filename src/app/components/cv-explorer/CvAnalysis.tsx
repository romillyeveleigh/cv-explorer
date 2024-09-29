import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  FileText,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { renderIcon } from "@/app/utils";
const MAX_SKILLS = 3;

type SkillGroup = {
  name: string;
  skills: string[];
};

const HeaderAndSubtitle = ({
  header,
  subtitle,
}: {
  header: string;
  subtitle?: string;
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{header}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
      )}
    </>
  );
};

type CvAnalysisProps = {
  fileName: string;
  skillGroups: SkillGroup[];
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  generateInsight: () => void;
  isGeneratingInitialInsight: boolean;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
  name: string;
  professionalTitle: string;
};

export default function CvAnalysis({
  fileName,
  skillGroups,
  selectedSkills,
  setSelectedSkills,
  handleFileUpload,
  generateInsight,
  isGeneratingInitialInsight,
  isLoading,
  error,
  reset,
  name,
  professionalTitle,
}: CvAnalysisProps) {
  const [searchSkill, setSearchSkill] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<SkillGroup[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSearchSkill("");
    }
  };

  const handleReset = () => {
    setSearchSkill("");
    reset();
  };

  const skillGroupsSection = (searchSkill ? filteredGroups : skillGroups).map(
    (group, index) => (
      <div key={index}>
        <h3 className="font-semibold mb-2">{group.name}</h3>
        <div className="flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <Button
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSkillSelect(skill)}
            >
              {renderIcon(skill)}
              <span className="max-w-[180px] overflow-hidden text-ellipsis">
                {skill}
              </span>
            </Button>
          ))}
        </div>
      </div>
    )
  );

  const selectedSkillsSection = selectedSkills.length > 0 && (
    <>
      <HeaderAndSubtitle
        header="Selected Skills"
        subtitle="Skills that will be used for CV analysis"
      />
      <div className="flex flex-wrap gap-2">
        {selectedSkills.slice(0, MAX_SKILLS).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-sm cursor-pointer"
            onClick={() => handleSkillSelect(skill)}
          >
            {skill} ✕
          </Badge>
        ))}
        {selectedSkills.length > MAX_SKILLS && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge variant="secondary" className="text-sm cursor-pointer">
                    + {selectedSkills.length - MAX_SKILLS} more
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col">
                  {selectedSkills.slice(MAX_SKILLS).map((skill) => (
                    <Button
                      key={skill}
                      variant="secondary"
                      className="text-sm mb-1"
                      onClick={() => handleSkillSelect(skill)} // Deselect skill on click
                    >
                      {skill} ✕
                    </Button>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  );

  const ctaRow = (
    <>
      <Button
        onClick={generateInsight}
        disabled={selectedSkills.length === 0 || isGeneratingInitialInsight}
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
              disabled={selectedSkills.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset selected skills</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );

  return (
    <>
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
        {isLoading ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Cooking up your CV magic...
            </p>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium text-muted-foreground text-center">
              Uh oh! {error} <br />
              Please try again
            </p>
          </div>
        ) : (
          <>
            <div>
              <span className="font-bold text-xl">{name}</span> -{" "}
              <span className="text-muted-foreground text-lg">
                {professionalTitle}
              </span>
            </div>
            <div className="flex-grow flex flex-col min-h-0">
              <HeaderAndSubtitle
                header="Skills"
                subtitle="Search, select, or add new skills"
              />
              <form onSubmit={handleSearchSkill} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    placeholder="Search or enter a new skill"
                  />
                  <Button type="submit" disabled={!searchSkill}>
                    Add
                  </Button>
                </div>
              </form>

              <div className="overflow-y-auto flex-grow">
                <div className="space-y-4">{skillGroupsSection}</div>
              </div>
            </div>
            <div>{selectedSkillsSection}</div>
          </>
        )}

        <div className="flex gap-2">{ctaRow}</div>
      </CardContent>
    </>
  );
}
