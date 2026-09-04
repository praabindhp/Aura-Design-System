import { AuraProvider, type AuraProviderProps } from "@praabindh/aura-design-system";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import axe, { type AxeResults, type Result, type RunOptions } from "axe-core";
import type { PropsWithChildren, ReactElement } from "react";

export interface RenderWithAuraOptions extends Omit<RenderOptions, "wrapper"> {
  readonly provider?: Omit<AuraProviderProps, "children">;
}

export function renderWithAura(
  ui: ReactElement,
  { provider, ...options }: RenderWithAuraOptions = {},
): RenderResult {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <AuraProvider applyTo="scope" defaultTheme="light" {...provider}>
      {children}
    </AuraProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

export interface MatchMediaController {
  readonly setMatches: (query: string, matches: boolean) => void;
  readonly restore: () => void;
}

type MediaQueryChangeListener = NonNullable<MediaQueryList["onchange"]>;
type MediaQueryEventListener =
  MediaQueryChangeListener | EventListener | EventListenerObject;

interface ListenerRegistration {
  readonly listener: MediaQueryEventListener;
  readonly once: boolean;
  readonly removeAbortListener: (() => void) | null;
}

class ControlledMediaQueryList implements MediaQueryList {
  readonly media: string;
  onchange: MediaQueryChangeListener | null = null;

  readonly #getMatches: () => boolean;
  readonly #listeners = new Map<
    string,
    Map<MediaQueryEventListener, ListenerRegistration>
  >();

  constructor(media: string, getMatches: () => boolean) {
    this.media = media;
    this.#getMatches = getMatches;
  }

  get matches(): boolean {
    return this.#getMatches();
  }

  addListener(listener: MediaQueryChangeListener | null): void {
    if (listener) this.#addEventListener("change", listener);
  }

  removeListener(listener: MediaQueryChangeListener | null): void {
    if (listener) this.#removeEventListener("change", listener);
  }

  addEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, event: MediaQueryListEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: MediaQueryEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.#addEventListener(type, listener, options);
  }

  removeEventListener<K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, event: MediaQueryListEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: string, listener: MediaQueryEventListener): void {
    this.#removeEventListener(type, listener);
  }

  dispatchEvent(event: Event): boolean {
    this.#dispatchToListeners(event);
    return !event.defaultPrevented;
  }

  emit(matches: boolean): void {
    const event = createMediaQueryListEvent(this.media, matches);
    this.onchange?.call(this, event);
    this.dispatchEvent(event);
  }

  #addEventListener(
    type: string,
    listener: MediaQueryEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    const registrations =
      this.#listeners.get(type) ??
      new Map<MediaQueryEventListener, ListenerRegistration>();
    if (registrations.has(listener)) return;

    const optionBag = typeof options === "object" ? options : undefined;
    const signal = optionBag?.signal;
    if (signal?.aborted) return;

    const abort = () => this.#removeEventListener(type, listener);
    signal?.addEventListener("abort", abort, { once: true });
    registrations.set(listener, {
      listener,
      once: optionBag?.once ?? false,
      removeAbortListener: signal
        ? () => signal.removeEventListener("abort", abort)
        : null,
    });
    this.#listeners.set(type, registrations);
  }

  #removeEventListener(type: string, listener: MediaQueryEventListener): void {
    const registrations = this.#listeners.get(type);
    const registration = registrations?.get(listener);
    if (!registrations || !registration) return;

    registration.removeAbortListener?.();
    registrations.delete(listener);
    if (registrations.size === 0) this.#listeners.delete(type);
  }

  #dispatchToListeners(event: Event): void {
    const registrations = this.#listeners.get(event.type);
    if (!registrations) return;

    for (const registration of [...registrations.values()]) {
      if (registration.once) {
        this.#removeEventListener(event.type, registration.listener);
      }
      if (typeof registration.listener === "function") {
        registration.listener.call(this, event as MediaQueryListEvent);
      } else {
        registration.listener.handleEvent(event);
      }
    }
  }
}

const createMediaQueryListEvent = (
  media: string,
  matches: boolean,
): MediaQueryListEvent => {
  if (typeof MediaQueryListEvent === "function") {
    return new MediaQueryListEvent("change", { matches, media });
  }

  const event = new Event("change");
  Object.defineProperties(event, {
    matches: { enumerable: true, value: matches },
    media: { enumerable: true, value: media },
  });
  return event as MediaQueryListEvent;
};

export function installMatchMedia(
  initial: Readonly<Record<string, boolean>> = {},
): MatchMediaController {
  const originalDescriptor = Object.getOwnPropertyDescriptor(window, "matchMedia");
  const values = new Map(Object.entries(initial));
  const queries = new Map<string, Set<ControlledMediaQueryList>>();
  let active = true;

  const matchMedia = (query: string): MediaQueryList => {
    const controlled = new ControlledMediaQueryList(
      query,
      () => values.get(query) ?? false,
    );
    const instances = queries.get(query) ?? new Set<ControlledMediaQueryList>();
    instances.add(controlled);
    queries.set(query, instances);
    return controlled;
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: matchMedia,
    writable: true,
  });

  return {
    setMatches: (query, matches) => {
      const previous = values.get(query) ?? false;
      values.set(query, matches);
      if (previous === matches) return;
      queries.get(query)?.forEach((controlled) => controlled.emit(matches));
    },
    restore: () => {
      if (!active) return;
      active = false;
      queries.clear();
      if (originalDescriptor) {
        Object.defineProperty(window, "matchMedia", originalDescriptor);
      } else {
        Reflect.deleteProperty(window, "matchMedia");
      }
    },
  };
}

export async function auditAccessibility(
  container: Element,
  options?: RunOptions,
): Promise<AxeResults> {
  return options === undefined ? axe.run(container) : axe.run(container, options);
}

export async function expectNoAccessibilityViolations(
  container: Element,
  options?: RunOptions,
): Promise<void> {
  const result = await auditAccessibility(container, options);
  if (result.violations.length === 0) return;

  const details = result.violations
    .map(
      (violation: Result) =>
        `${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`,
    )
    .join("\n");
  throw new Error(`Accessibility violations detected:\n${details}`);
}
