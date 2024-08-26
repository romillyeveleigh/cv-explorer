"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ChevronDown, ChevronUp } from "lucide-react"

export default function Component() {
  const [inputValue, setInputValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const optionGroups = [
    {
      name: "Key Tech",
      options: [
        { id: "javascript", label: "JavaScript" },
        { id: "typescript", label: "TypeScript" },
        { id: "python", label: "Python" },
        { id: "java", label: "Java" },
        { id: "csharp", label: "C#" },
        { id: "golang", label: "Go" },
      ],
    },
    {
      name: "Front End",
      options: [
        { id: "react", label: "React" },
        { id: "vue", label: "Vue.js" },
        { id: "angular", label: "Angular" },
        { id: "svelte", label: "Svelte" },
        { id: "nextjs", label: "Next.js" },
        { id: "tailwindcss", label: "Tailwind CSS" },
      ],
    },
    {
      name: "Full Stack",
      options: [
        { id: "nodejs", label: "Node.js" },
        { id: "django", label: "Django" },
        { id: "rails", label: "Ruby on Rails" },
        { id: "aspnet", label: "ASP.NET" },
        { id: "laravel", label: "Laravel" },
        { id: "spring", label: "Spring Boot" },
      ],
    },
    {
      name: "Databases",
      options: [
        { id: "postgresql", label: "PostgreSQL" },
        { id: "mysql", label: "MySQL" },
        { id: "mongodb", label: "MongoDB" },
        { id: "redis", label: "Redis" },
        { id: "elasticsearch", label: "Elasticsearch" },
        { id: "cassandra", label: "Cassandra" },
      ],
    },
  ]

  const allOptions = optionGroups.flatMap(group => group.options)

  const filteredOptions = allOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !inputValue.split(", ").includes(option.label)
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsDropdownOpen(true)
  }

  const handleOptionToggle = (optionLabel: string) => {
    const currentOptions = inputValue.split(", ").filter(Boolean)
    if (currentOptions.includes(optionLabel)) {
      const newOptions = currentOptions.filter(option => option !== optionLabel)
      setInputValue(newOptions.join(", "))
    } else {
      const newOptions = [...currentOptions, optionLabel]
      setInputValue(newOptions.join(", "))
    }
    setIsDropdownOpen(false)
  }

  const handleClearInput = () => {
    setInputValue("")
    setIsDropdownOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted options:", inputValue.split(", ").filter(Boolean))
    // Here you can handle the form submission, e.g., send data to an API
  }

  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="options-input" className="text-lg font-semibold">
          Search and select technologies:
        </Label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Input
              id="options-input"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type to search or click buttons to select technologies"
              className="pr-10"
              aria-expanded={isDropdownOpen}
              aria-autocomplete="list"
              aria-controls="options-list"
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleClearInput}
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isDropdownOpen && (
            <ul
              id="options-list"
              className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    onClick={() => handleOptionToggle(option.label)}
                    className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    role="option"
                    aria-selected={inputValue.includes(option.label)}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-muted-foreground">No technologies found</li>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <Label className="text-lg font-semibold">Available technologies:</Label>
        {optionGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            <Label className="text-md font-medium">{group.name}</Label>
            <div className="flex flex-wrap gap-2">
              {group.options.slice(0, expandedGroups.includes(group.name) ? undefined : 3).map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={inputValue.includes(option.label) ? "default" : "outline"}
                  onClick={() => handleOptionToggle(option.label)}
                  className="flex-grow sm:flex-grow-0"
                  aria-pressed={inputValue.includes(option.label)}
                >
                  {option.label}
                </Button>
              ))}
              {group.options.length > 3 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => toggleGroupExpansion(group.name)}
                  className="flex-grow sm:flex-grow-0"
                  aria-expanded={expandedGroups.includes(group.name)}
                >
                  {expandedGroups.includes(group.name) ? "less" : "more"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}