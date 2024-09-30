"use client";
import GenericConversation from "../components/GenericConversation";
import Anthropic from "@anthropic-ai/sdk";

const astronomySystemMessage: Anthropic.MessageCreateParams["system"] =
  "You are an AI assistant specialized in astronomy. Provide accurate and engaging information about celestial bodies and space phenomena. Use the provided tool when asked for specific planetary data.";

const planetInfoTool: Anthropic.Messages.Tool = {
  name: "output_planet_info",
  description: "Outputs structured information about a planet as JSON",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Name of the planet" },
      type: {
        type: "string",
        description: "Type of planet (e.g., gas giant, terrestrial)",
      },
      diameter: {
        type: "number",
        description: "Diameter of the planet in kilometers",
      },
      mass: {
        type: "string",
        description: "Mass of the planet in scientific notation",
      },
      moons: { type: "number", description: "Number of known moons" },
      interesting_fact: {
        type: "string",
        description: "An interesting fact about the planet",
      },
    },
    required: ["name", "type", "diameter", "mass", "moons", "interesting_fact"],
  },
};

const customParams = {
  model: "claude-3-sonnet-20240229",
  max_tokens: 500,
  temperature: 0.7,
};

export default function AstronomyChat() {
  return (
    <GenericConversation
      placeholder="Ask about astronomy..."
      title="Chat with Claude about Astronomy"
      system={astronomySystemMessage}
      tools={[planetInfoTool]}
      customParams={customParams}
    />
  );
}
