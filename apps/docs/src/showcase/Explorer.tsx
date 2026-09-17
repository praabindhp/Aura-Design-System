import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  EmptyState,
  LinkButton,
  SearchInput,
  useAura,
} from "@praabindh/aura-design-system";
import { CodeExample } from "./CodeExample";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import {
  catalog,
  categories,
  componentHref,
  storyHref,
  type Category,
} from "./catalog";
import { Preview } from "./Previews";
import styles from "./showcase.module.css";

function StoryFrame({
  brand,
  mode,
  name,
  story,
}: {
  readonly brand: string;
  readonly mode: string;
  readonly name: string;
  readonly story: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  const src = `./storybook/iframe.html?id=${story}&viewMode=story&embed=1&globals=brand:${brand};theme:${mode}`;

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;
    const connect = () => {
      observer?.disconnect();
      const document = iframe.contentDocument;
      if (!document) return;
      const update = () => {
        const nextHeight = Math.ceil(
          Math.max(
            document.documentElement.scrollHeight,
            document.body?.scrollHeight ?? 0,
          ),
        );
        if (nextHeight > 0) setHeight(nextHeight);
      };
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(update);
        observer.observe(document.documentElement);
        if (document.body) observer.observe(document.body);
      }
      update();
    };
    setHeight(undefined);
    iframe.addEventListener("load", connect);
    if (iframe.contentDocument?.readyState === "complete") connect();
    return () => {
      iframe.removeEventListener("load", connect);
      observer?.disconnect();
    };
  }, [src]);

  return (
    <iframe
      ref={frame}
      className={styles.storyFrame}
      height={height}
      loading="lazy"
      src={src}
      title={`${name} Storybook example`}
    />
  );
}

export default function Explorer({ route }: { route: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All components">(
    "All components",
  );
  const { brand, mode } = useAura();
  const name = route.split("/")[2];
  const entry = catalog.find((item) => item.name === name);
  if (name && !entry)
    return (
      <EmptyState
        title="Component not found"
        description="This name isn't part of the current public library."
        action={<LinkButton href="#/components">Browse components</LinkButton>}
      />
    );
  if (entry)
    return (
      <div className={styles.detail}>
        <a className={styles.backLink} href="#/components">
          <ArrowLeft aria-hidden size={15} /> All components
        </a>
        <div className={styles.pageIntro}>
          <span className={styles.eyebrow}>{entry.category}</span>
          <h1>{entry.name}</h1>
          <p>{entry.description}</p>
          <Badge tone="neutral">{entry.package}</Badge>
        </div>
        <section
          className={styles.detailPreview}
          aria-label={`${entry.name} live preview`}
        >
          <header>
            <span>Live preview</span>
            <span>
              {brand} / {mode}
            </span>
          </header>
          <div>
            <Preview key={entry.name} name={entry.name} />
          </div>
        </section>
        <div className={styles.detailColumns}>
          <section>
            <h2>Make it part of your interface.</h2>
            <p>
              Import from the public package entry point. The examples below show the
              component in context, including its required props and related building
              blocks.
            </p>
            <CodeExample
              code={`import { ${entry.name} } from "${entry.package}";`}
              language="tsx"
            />
            <LinkButton
              variant="secondary"
              href={storyHref(entry.story, brand, mode)}
              endIcon={<ArrowUpRight aria-hidden size={15} />}
            >
              Open interactive Storybook example
            </LinkButton>
          </section>
          <section className={styles.guidance}>
            <h2>A considered starting point</h2>
            <p>
              Use this {entry.category.toLowerCase()} component for its documented
              purpose. Keep product data, routes, and business rules in your
              application.
            </p>
            <p>
              Try the controls using Tab, Enter, Space, and the arrow keys where
              relevant. Overlays support Escape. Switch brands and appearance below to
              inspect the same example in another context.
            </p>
            <a href="#/foundations">
              Explore the foundations <ArrowRight aria-hidden size={14} />
            </a>
          </section>
        </div>
        <section className={styles.storySection}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.eyebrow}>IN CONTEXT</span>
              <h2>Explore the full example.</h2>
            </div>
            <a href={storyHref(entry.story, brand, mode)}>
              Open in Storybook <ArrowUpRight aria-hidden size={14} />
            </a>
          </div>
          <p>
            The canvas includes related components so you can see how they work
            together.
          </p>
          <StoryFrame
            key={`${entry.story}-${brand}-${mode}`}
            brand={brand}
            mode={mode}
            name={entry.name}
            story={entry.story}
          />
        </section>
      </div>
    );
  const displayOrder: Category[] = [
    "Actions",
    "Forms",
    "Feedback",
    "Navigation",
    "Data display",
    "Patterns",
    "Charts",
    "Rich content",
    "Layouts",
    "Templates",
    "Foundations",
  ];
  const filtered = [...catalog]
    .sort((a, b) => displayOrder.indexOf(a.category) - displayOrder.indexOf(b.category))
    .filter(
      (item) =>
        (category === "All components" || item.category === category) &&
        `${item.name} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  return (
    <div className={styles.explorer}>
      <div className={styles.pageIntro}>
        <span className={styles.eyebrow}>THE BUILDING BLOCKS</span>
        <h1>A place for every piece.</h1>
        <p>
          From the smallest interaction to the whole experience.
          <br />
          Explore {catalog.length} components, ready to make your own.
        </p>
      </div>
      <div className={styles.catalogLayout}>
        <aside className={styles.catalogSidebar} aria-label="Component categories">
          <span className={styles.eyebrow}>BROWSE LIBRARY</span>
          {(["All components", ...categories] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              <span>{item}</span>
              <span>
                {item === "All components"
                  ? catalog.length
                  : catalog.filter((entry) => entry.category === item).length}
              </span>
            </button>
          ))}
          <a href="./storybook/">
            Explore Storybook <ArrowUpRight aria-hidden size={14} />
          </a>
        </aside>
        <div className={styles.catalogMain}>
          <div className={styles.searchBar}>
            <label htmlFor="catalog-search">
              <Search aria-hidden size={17} />
              <span>Find a component</span>
            </label>
            <SearchInput
              id="catalog-search"
              placeholder="Search by name, purpose, or category…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={styles.resultsHeading}>
            <h2>{category}</h2>
            <span role="status">
              {filtered.length} {filtered.length === 1 ? "component" : "components"}
            </span>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              title="A little too specific?"
              description="Try another name or clear your filters to see the whole library."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setCategory("All components");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className={styles.catalogGrid}>
              {filtered.map((entry) => (
                <article key={entry.name} className={styles.componentCard}>
                  <div className={styles.componentPreview}>
                    <Preview name={entry.name} />
                  </div>
                  <div className={styles.componentInfo}>
                    <span className={styles.eyebrow}>{entry.category}</span>
                    <h3>
                      <a href={componentHref(entry.name)}>
                        {entry.name}
                        <ArrowUpRight aria-hidden size={16} />
                      </a>
                    </h3>
                    <p>{entry.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
