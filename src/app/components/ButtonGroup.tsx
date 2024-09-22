import { FC } from "react";
import { Button } from "@/components/ui/button";

import { renderIcon } from "../utils";

const DEFAULT_VISIBLE_OPTIONS = 3;

interface ButtonGroupProps {
  group: {
    name: string;
    options: {
      id: string;
      label: string;
    }[];
  };
  isExpanded: boolean;
  handleOptionToggle: (label: string) => void;
  toggleGroupExpansion: (name: string) => void;
  selectedOptions: string[];
}

const ButtonGroup: FC<ButtonGroupProps> = ({
  group,
  isExpanded,
  handleOptionToggle,
  toggleGroupExpansion,
  selectedOptions,
}) => {
  const getIsSelected = (option: string) => selectedOptions.includes(option);
  const ShouldBeVisible = (option: string, index: number) =>
    index < DEFAULT_VISIBLE_OPTIONS || isExpanded || getIsSelected(option);

  return (
    <>
      {group.options.map((option, i) => {
        const isSelected = getIsSelected(option.label);
        return (
          <Button
            key={option.id}
            type="button"
            variant={isSelected ? "default" : "outline"}
            onClick={() => handleOptionToggle(option.label)}
            className={`text-xs border ${
              isSelected ? "border-primary" : "border-input"
            } flex items-center ${
              ShouldBeVisible(option.label, i) ? "visible" : "hidden"
            }`}
            aria-pressed={isSelected}
          >
            {renderIcon(option.id)}
            {option.label}
          </Button>
        );
      })}

      {group.options.length > 3 && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => toggleGroupExpansion(group.name)}
          className="text-xs"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "less" : "more"}
        </Button>
      )}
    </>
  );
};

export default ButtonGroup;
