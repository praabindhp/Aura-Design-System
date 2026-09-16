import { RichMarkdown } from "@praabindh/aura-rich-content";

export function CodeExample({ code, language }: { code: string; language: string }) {
  return <RichMarkdown>{`\`\`\`${language}\n${code}\n\`\`\``}</RichMarkdown>;
}
