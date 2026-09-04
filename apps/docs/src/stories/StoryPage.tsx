import { Heading, Text } from "@praabindh/aura-design-system";
import type { ReactNode } from "react";

export function StoryPage({ children }: { readonly children: ReactNode }) {
  return <div className="docsPage">{children}</div>;
}

export function StoryIntro({
  description,
  eyebrow,
  title,
}: {
  readonly description: ReactNode;
  readonly eyebrow: string;
  readonly title: ReactNode;
}) {
  return (
    <header className="docsIntro">
      <span className="docsEyebrow">{eyebrow}</span>
      <Heading level={1} size="lg">
        {title}
      </Heading>
      <Text size="lg" tone="secondary">
        {description}
      </Text>
    </header>
  );
}
