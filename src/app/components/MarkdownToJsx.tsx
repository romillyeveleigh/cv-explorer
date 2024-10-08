import Markdown from "markdown-to-jsx";
import { FC } from "react";

export const MarkdownToJsx: FC<{ markdown: string }> = ({ markdown }) => {
    return (
      <Markdown
        options={{
          overrides: {
            strong: { component: "strong", props: { className: "font-bold" } },
            p: { props: { className: "mb-4" } },
            ul: { props: { className: "list-disc list-inside mb-4" } },
            ol: { props: { className: "list-decimal list-inside mb-4" } },
            li: { props: { className: "ml-4 mb-0" } },
            h1: { props: { className: "text-2xl font-bold mb-4" } },
            h2: { props: { className: "text-xl font-bold mb-3" } },
            h3: { props: { className: "text-lg font-bold mb-2" } },
            a: {
              component: ({ children, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              props: { className: "text-blue-500 hover:underline" },
            },
            img: { props: { className: "max-w-full h-auto my-4" } },
            blockquote: {
              props: {
                className: "border-l-4 border-gray-300 pl-4 italic my-4",
              },
            },
          },
        }}
      >
        {markdown}
      </Markdown>
    );
  };