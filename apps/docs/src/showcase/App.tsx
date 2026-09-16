import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  AuraProvider,
  Avatar,
  Badge,
  Button,
  IconButton,
  Inline,
  LinkButton,
  LoadingState,
  ProductMark,
  Select,
  Stack,
  Text,
  useAura,
  type AuraBrand,
  type ThemePreference,
} from "@praabindh/aura-design-system";
import { auraBrands, isAuraBrand, isThemePreference } from "@praabindh/aura-tokens";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  CircleCheck,
  GitFork,
  Layers,
  Moon,
  Plus,
  Settings2,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  ActivityDemo,
  ComposerDemo,
  PreferencesDemo,
  Preview,
  ProjectDemo,
} from "./Previews";
import { catalog, componentHref, repositoryUrl, storyHref } from "./catalog";
import styles from "./showcase.module.css";

const Explorer = lazy(() => import("./Explorer"));
const Guide = lazy(() => import("./Guide"));
export const brandNames: Record<AuraBrand, string> = {
  aura: "Aura",
  verbaura: "VerbAura",
  cognaura: "CognAura",
  rendaura: "RendAura",
  charteraura: "CharterAura",
  "charteraura-intermediate": "CharterAura Intermediate",
};

function savedPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences remain usable when storage is unavailable. */
  }
}

function currentRoute() {
  return window.location.hash.startsWith("#/") ? window.location.hash.slice(1) : "/";
}

function subscribeToRoute(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function App() {
  const [brand, setBrand] = useState<AuraBrand>(() => {
    const value = savedPreference("pads-showcase-brand");
    return isAuraBrand(value) ? value : "verbaura";
  });
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const value = savedPreference("pads-showcase-theme");
    return isThemePreference(value) ? value : "dark";
  });
  return (
    <AuraProvider
      brand={brand}
      theme={theme}
      storageKey={null}
      onThemeChange={(value) => {
        setTheme(value);
        savePreference("pads-showcase-theme", value);
      }}
    >
      <Site
        brand={brand}
        theme={theme}
        setBrand={(value) => {
          setBrand(value);
          savePreference("pads-showcase-brand", value);
        }}
        setTheme={(value) => {
          setTheme(value);
          savePreference("pads-showcase-theme", value);
        }}
      />
    </AuraProvider>
  );
}

function Site({
  brand,
  theme,
  setBrand,
  setTheme,
}: {
  brand: AuraBrand;
  theme: ThemePreference;
  setBrand: (brand: AuraBrand) => void;
  setTheme: (theme: ThemePreference) => void;
}) {
  const route = useSyncExternalStore(subscribeToRoute, currentRoute);
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const { mode } = useAura();
  useEffect(() => {
    const section = route.startsWith("/components")
      ? "Components"
      : route === "/foundations"
        ? "Foundations"
        : route === "/start"
          ? "Get started"
          : "Showcase";
    document.title = `${section} · PADS — Praabindh's Aura Design System`;
    if (!first.current) {
      main.current?.focus();
      window.scrollTo(0, 0);
    }
    first.current = false;
  }, [route]);
  return (
    <div className={styles.site}>
      <a
        className={styles.skipLink}
        href="#showcase-main"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className={styles.header}>
        <a href="#/" className={styles.logo} aria-label="PADS home">
          <span className={styles.logoMark}>
            <Layers aria-hidden size={22} />
          </span>
          <strong>
            PADS<span className={styles.logoDot}>.</span>
          </strong>
          <span className={styles.version}>v1.0</span>
        </a>
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#/" aria-current={route === "/" ? "page" : undefined}>
            Showcase
          </a>
          <a
            href="#/components"
            aria-current={route.startsWith("/components") ? "page" : undefined}
          >
            Components <span>{catalog.length}</span>
          </a>
          <a
            href="#/foundations"
            aria-current={route === "/foundations" ? "page" : undefined}
          >
            Foundations
          </a>
          <a href="#/start" aria-current={route === "/start" ? "page" : undefined}>
            Get started
          </a>
        </nav>
        <div className={styles.headerActions}>
          <IconButton
            label={mode === "dark" ? "Use light theme" : "Use dark theme"}
            variant="ghost"
            onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
          >
            {mode === "dark" ? (
              <Sun aria-hidden size={18} />
            ) : (
              <Moon aria-hidden size={18} />
            )}
          </IconButton>
          <a
            className={styles.githubLink}
            href={repositoryUrl}
            aria-label="PADS GitHub repository"
          >
            <GitFork aria-hidden size={18} />
            <span>GitHub</span>
            <ArrowUpRight aria-hidden size={13} />
          </a>
        </div>
      </header>
      <main className={styles.main} id="showcase-main" tabIndex={-1} ref={main}>
        {route === "/" ? (
          <Showcase />
        ) : (
          <Suspense fallback={<LoadingState label="Opening the PADS library" />}>
            {route.startsWith("/components") ? (
              <Explorer route={route} />
            ) : route === "/foundations" || route === "/start" ? (
              <Guide page={route} />
            ) : (
              <div className={styles.pageIntro}>
                <h1>That page isn't in the library.</h1>
                <LinkButton href="#/components">Explore components</LinkButton>
              </div>
            )}
          </Suspense>
        )}
      </main>
      <footer className={styles.footer}>
        <a href="#/" className={styles.logo}>
          <Layers aria-hidden size={20} />
          <strong>PADS.</strong>
        </a>
        <p>
          Praabindh's Aura Design System.
          <br />
          <span>Thoughtfully built by Praabindh · PRAABINDH CORP</span>
        </p>
        <a href={storyHref("introduction-welcome--design-system", brand, mode)}>
          Open Storybook <ArrowUpRight aria-hidden size={14} />
        </a>
        <a href={repositoryUrl}>
          Source on GitHub <ArrowUpRight aria-hidden size={14} />
        </a>
      </footer>
      <aside className={styles.appearance} aria-label="Appearance settings">
        <span className={styles.appearanceLabel}>
          <Settings2 aria-hidden size={15} /> Make it yours
        </span>
        <div className={styles.appearanceControl}>
          <label htmlFor="site-brand">Brand</label>
          <Select
            id="site-brand"
            value={brand}
            onValueChange={setBrand}
            options={auraBrands.map((item) => ({
              value: item,
              label: brandNames[item],
            }))}
          />
        </div>
        <div className={styles.appearanceControl}>
          <label htmlFor="site-theme">Theme</label>
          <Select
            id="site-theme"
            value={theme}
            onValueChange={setTheme}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "System" },
            ]}
          />
        </div>
      </aside>
    </div>
  );
}

function DemoCard({
  title,
  category,
  children,
  className = "",
  link,
}: {
  title: string;
  category: string;
  children: ReactNode;
  className?: string | undefined;
  link: string;
}) {
  return (
    <article className={`${styles.demoCard} ${className}`}>
      <header className={styles.demoCardHeader}>
        <span>{category}</span>
        <a href={link} aria-label={`Explore ${title}`}>
          <ArrowUpRight aria-hidden size={16} />
        </a>
      </header>
      <h3>{title}</h3>
      <div className={styles.demoContent}>{children}</div>
    </article>
  );
}

function Showcase() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <a href="#/start" className={styles.release}>
          <span className={styles.liveDot} /> Meet your next creative foundation{" "}
          <ArrowRight aria-hidden size={13} />
        </a>
        <div className={styles.heroEyebrow}>PRAABINDH'S AURA DESIGN SYSTEM</div>
        <h1 id="hero-title">
          Thoughtful pieces.
          <br />
          <span>Extraordinary possibilities.</span>
        </h1>
        <p>
          A shared design language for ideas worth building. Beautiful components,
          <br className={styles.desktopBreak} /> accessible foundations, and a little
          Aura in every detail.
        </p>
        <div className={styles.heroActions}>
          <LinkButton
            href="#/components"
            size="lg"
            endIcon={<ArrowRight aria-hidden size={17} />}
          >
            Explore components
          </LinkButton>
          <LinkButton
            href="#/start"
            variant="secondary"
            size="lg"
            startIcon={<Braces aria-hidden size={18} />}
          >
            Start building
          </LinkButton>
        </div>
        <div className={styles.heroFacts}>
          <span>
            <CircleCheck aria-hidden size={14} /> Built for accessibility
          </span>
          <span>
            <Layers aria-hidden size={14} /> {catalog.length} components
          </span>
          <span>
            <Sun aria-hidden size={14} /> Light, dark & yours
          </span>
        </div>
      </section>
      <section className={styles.showcaseSection} aria-labelledby="showcase-title">
        <div className={styles.sectionIntro}>
          <div>
            <span className={styles.eyebrow}>THE SYSTEM, IN ACTION</span>
            <h2 id="showcase-title">Small details. A whole experience.</h2>
          </div>
          <p>
            Real components. Go ahead, try them. <ArrowDown aria-hidden size={14} />
          </p>
        </div>
        <div className={styles.mosaic}>
          <div className={styles.mosaicColumn}>
            <DemoCard
              title="Every action, considered."
              category="01 / ACTIONS"
              link={componentHref("Button")}
            >
              <Stack gap={5}>
                <Inline gap={2}>
                  <Button
                    startIcon={<Plus aria-hidden size={15} />}
                    onClick={() => {
                      window.location.hash = "/components/Button";
                    }}
                  >
                    Create
                  </Button>
                  <LinkButton href="#/components" variant="secondary">
                    Explore
                  </LinkButton>
                  <IconButton
                    label="Explore icon buttons"
                    variant="ghost"
                    onClick={() => {
                      window.location.hash = "/components/IconButton";
                    }}
                  >
                    <ArrowUpRight aria-hidden size={18} />
                  </IconButton>
                </Inline>
                <Preview name="SegmentedControl" />
                <Inline gap={2}>
                  <Badge icon={<Check aria-hidden size={12} />} tone="success">
                    Ready to ship
                  </Badge>
                  <Badge tone="neutral">In progress</Badge>
                </Inline>
              </Stack>
            </DemoCard>
            <DemoCard
              title="Your workspace. Your way."
              category="04 / PREFERENCES"
              link={componentHref("SettingsPanel")}
            >
              <PreferencesDemo />
            </DemoCard>
          </div>
          <div className={styles.mosaicColumn}>
            <DemoCard
              title="A little progress, every day."
              category="02 / DATA & INSIGHT"
              link={componentHref("ActivityChart")}
              className={styles.chartCard}
            >
              <div className={styles.metricLine}>
                <strong>
                  1,284<span> creations</span>
                </strong>
                <Badge tone="success">↗ 24.8%</Badge>
              </div>
              <ActivityDemo />
              <div className={styles.chartCaption}>
                <span>Example workspace activity</span>
                <span>Last 7 days</span>
              </div>
            </DemoCard>
            <DemoCard
              title="Something good is taking shape."
              category="05 / CONVERSATION"
              link={componentHref("ComposerDock")}
              className={styles.conversationCard}
            >
              <div className={styles.conversationIntro}>
                <span className={styles.sparkleMark}>
                  <Sparkles aria-hidden size={24} />
                </span>
                <p>
                  Big ideas begin
                  <br />
                  with a simple thought.
                </p>
              </div>
              <ComposerDemo />
            </DemoCard>
          </div>
          <div className={styles.mosaicColumn}>
            <DemoCard
              title="Make space for an idea."
              category="03 / FORMS"
              link={componentHref("Field")}
              className={styles.formCard}
            >
              <ProjectDemo />
            </DemoCard>
            <DemoCard
              title="Better, together."
              category="06 / IDENTITY"
              link={componentHref("Avatar")}
              className={styles.identityCard}
            >
              <Inline>
                <Avatar fallback="PA" size="lg" />
                <Avatar fallback="AK" size="lg" />
                <Avatar fallback="JD" size="lg" />
                <span className={styles.teamMore}>+4</span>
              </Inline>
              <Text size="sm" tone="secondary">
                Different perspectives.
                <br />
                One shared design language.
              </Text>
              <div className={styles.identityFooter}>
                <span className={styles.liveDot} />
                <span>Made for the Aura family</span>
              </div>
            </DemoCard>
          </div>
        </div>
      </section>
      <section className={styles.brandSection} aria-labelledby="brand-title">
        <div>
          <span className={styles.eyebrow}>ONE FOUNDATION. EVERY AURA.</span>
          <h2 id="brand-title">
            A shared language.
            <br />
            Room for personality.
          </h2>
          <p>
            Semantic tokens bring every brand into focus.
            <br />
            Try a different identity in the appearance bar.
          </p>
        </div>
        <div className={styles.brandGrid}>
          {auraBrands.map((brand) => (
            <div key={brand}>
              <ProductMark brand={brand} size="md" />
              <span>{brandNames[brand]}</span>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.bottomCta}>
        <div>
          <span className={styles.eyebrow}>FROM FIRST PIXEL TO FINAL PRODUCT</span>
          <h2>Find your next building block.</h2>
          <p>Explore the full library, from a single button to a complete workspace.</p>
        </div>
        <LinkButton
          href="#/components"
          size="lg"
          endIcon={<ArrowRight aria-hidden size={17} />}
        >
          Browse all {catalog.length} components
        </LinkButton>
      </section>
    </>
  );
}
