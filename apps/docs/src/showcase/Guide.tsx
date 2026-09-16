import { useState } from "react";
import {
  Badge,
  Heading,
  LinkButton,
  SearchInput,
  useAura,
} from "@praabindh/aura-design-system";
import { getThemeTokens } from "@praabindh/aura-tokens";
import { CodeExample } from "./CodeExample";
import { ArrowRight, ArrowUpRight, Check, Code2, Layers, Package } from "lucide-react";
import { repositoryUrl, utilities } from "./catalog";
import styles from "./showcase.module.css";

const setupCode = `import { AuraProvider, Button } from "@praabindh/aura-design-system";
import "@praabindh/aura-design-system/styles.css";

export function App() {
  return (
    <AuraProvider brand="verbaura" defaultTheme="system">
      <Button onClick={() => console.log("An idea begins")}>
        Create something
      </Button>
    </AuraProvider>
  );
}`;
const colors = [
  ["Canvas", "--aura-bg-app", "canvas"],
  ["Surface", "--aura-bg-surface", "surface"],
  ["Primary action", "--aura-brand-action", "action"],
  ["Soft brand", "--aura-brand-soft", "soft"],
  ["Success", "--aura-status-success-content", "success"],
  ["Information", "--aura-status-info-content", "info"],
] as const;

export default function Guide({ page }: { page: string }) {
  const { brand, mode } = useAura();
  const tokens = getThemeTokens(mode, brand);
  const [query, setQuery] = useState("");
  if (page === "/start")
    return (
      <div className={styles.guide}>
        <div className={styles.pageIntro}>
          <span className={styles.eyebrow}>YOUR NEXT IDEA STARTS HERE</span>
          <h1>
            A little setup.
            <br />A lot of possibility.
          </h1>
          <p>Bring the Aura design language into your React application.</p>
        </div>
        <div className={styles.steps}>
          <section>
            <span className={styles.stepNumber}>01</span>
            <h2>Install your foundation.</h2>
            <p>
              PADS packages are published to the restricted <code>@praabindh</code> npm
              scope. Configure your authorized registry access first. This showcase is
              available independently of package access.
            </p>
            <CodeExample
              language="bash"
              code="npm install @praabindh/aura-design-system react react-dom"
            />
          </section>
          <section>
            <span className={styles.stepNumber}>02</span>
            <h2>Give your application an Aura.</h2>
            <p>
              Import the stylesheet once and wrap your interface in AuraProvider. Pick a
              brand and let the system follow your preferred appearance.
            </p>
            <CodeExample code={setupCode} language="tsx" />
          </section>
          <section>
            <span className={styles.stepNumber}>03</span>
            <h2>Choose only what you need.</h2>
            <div className={styles.packageGrid}>
              {[
                [
                  "aura-tokens",
                  "Framework-independent color, type, spacing, and brand decisions.",
                  Layers,
                ],
                [
                  "aura-design-system",
                  "Providers, controls, patterns, layouts, and complete templates.",
                  Package,
                ],
                [
                  "aura-charts",
                  "Accessible visualizations in an optional package.",
                  Check,
                ],
                [
                  "aura-rich-content",
                  "Safe Markdown and code presentation when you need it.",
                  Code2,
                ],
                [
                  "aura-testing",
                  "Render helpers and deterministic browser mocks for consumers.",
                  Check,
                ],
              ].map(([name, description, Icon]) => {
                const Mark = Icon as typeof Layers;
                return (
                  <article className={styles.packageCard} key={String(name)}>
                    <Mark aria-hidden size={22} />
                    <h3>@praabindh/{String(name)}</h3>
                    <p>{String(description)}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
        <section className={styles.utilitySection}>
          <h2>Small helpers. Useful context.</h2>
          <p>
            The public library also includes runtime helpers and a theme initialization
            component:
          </p>
          <div className={styles.utilityGrid}>
            {utilities.map((name) => (
              <Badge key={name} tone="neutral">
                {name}
              </Badge>
            ))}
          </div>
          <p>
            <code>useAura</code> reads the current appearance and brand.{" "}
            <code>useAuraFeedback</code> provides scoped messages.{" "}
            <code>getAuraThemeScript</code> and <code>AuraThemeScript</code> support
            theme initialization; review their CSP and hydration guidance before use.
          </p>
          <a href={`${repositoryUrl}/blob/main/packages/react/README.md`}>
            Read package and helper API guidance <ArrowUpRight aria-hidden size={14} />
          </a>
        </section>
        <section className={styles.bottomCta}>
          <div>
            <h2>Make something feel like Aura.</h2>
            <p>Browse the pieces. Try the interactions. Find your starting point.</p>
          </div>
          <LinkButton
            href="#/components"
            endIcon={<ArrowRight aria-hidden size={16} />}
          >
            Explore components
          </LinkButton>
        </section>
      </div>
    );
  const filtered = Object.entries(tokens).filter(([name, value]) =>
    `${name} ${value}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className={styles.guide}>
      <div className={styles.pageIntro}>
        <span className={styles.eyebrow}>THE THINKING BENEATH THE PIXELS</span>
        <h1>Consistency, by design.</h1>
        <p>
          One source of truth. Five apps. A shared language
          <br />
          of color, typography, space, and interaction.
        </p>
      </div>
      <section className={styles.foundationSection}>
        <div className={styles.sectionIntro}>
          <div>
            <span className={styles.eyebrow}>01 / COLOR</span>
            <h2>Color with a purpose.</h2>
          </div>
          <Badge tone="neutral">
            {brand} · {mode}
          </Badge>
        </div>
        <p>
          Every color has a semantic role. Switch appearance below to see the same
          decisions adapt to another context.
        </p>
        <div className={styles.colorGrid}>
          {colors.map(([label, token, role]) => (
            <article key={token} className={styles.colorCard}>
              <div className={styles.colorSwatch} data-color={role} />
              <h3>{label}</h3>
              <code>{token}</code>
              <span>{tokens[token]}</span>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.foundationSection}>
        <span className={styles.eyebrow}>02 / TYPOGRAPHY</span>
        <h2>A clear voice, at every size.</h2>
        <div className={styles.typeSpecimen}>
          <div className={styles.typeHero}>
            Aa<span>Lexend Variable</span>
          </div>
          <div>
            <Heading level={3} size="lg">
              Room for the big idea.
            </Heading>
            <Heading level={4} size="md">
              A little structure helps.
            </Heading>
            <p>Readable, purposeful, and quietly expressive.</p>
            <span className={styles.eyebrow}>THE DETAILS MAKE THE DIFFERENCE.</span>
          </div>
        </div>
      </section>
      <section className={styles.foundationSection}>
        <span className={styles.eyebrow}>03 / THE TOKEN MODEL</span>
        <h2>Meaning before appearance.</h2>
        <div className={styles.tokenFlow}>
          {[
            "Reference values",
            "Semantic roles",
            "Brand recipes",
            "Component decisions",
          ].map((label, index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
              {index < 3 && <ArrowRight aria-hidden size={18} />}
            </div>
          ))}
        </div>
        <p>
          Components consume semantic decisions. The canonical source generates CSS,
          JSON, TypeScript, and the internal theme adapter together.
        </p>
      </section>
      <section className={styles.foundationSection}>
        <span className={styles.eyebrow}>04 / EXPLORE THE VALUES</span>
        <h2>Meet the tokens.</h2>
        <label className={styles.tokenSearch} htmlFor="token-search">
          Find a token
          <SearchInput
            id="token-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try space, radius, focus, or brand…"
          />
        </label>
        <p role="status">
          {filtered.length} resolved tokens for {brand} in {mode} mode.
        </p>
        <div
          className={styles.tokenTable}
          role="region"
          aria-label="Resolved design tokens"
          tabIndex={0}
        >
          <table>
            <caption>Current brand and appearance values</caption>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Resolved value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(([name, value]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
