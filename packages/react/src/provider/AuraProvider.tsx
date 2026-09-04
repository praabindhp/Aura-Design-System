import {
  auraBrands,
  browserThemeColor,
  getThemeTokens,
  isThemePreference,
  resolveThemePreference,
  type AuraBrand,
  type ThemeMode,
  type ThemePreference,
} from "@praabindh/aura-tokens";
import { Moon, Sun } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  AntApp,
  AntConfigProvider,
  antTheme,
  type AntThemeConfig,
} from "../internal/antd.js";
import { cx } from "../types.js";
import styles from "./AuraProvider.module.css";

const DEFAULT_STORAGE_KEY = "pads-theme";
const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

interface AuraContextValue {
  readonly brand: AuraBrand;
  readonly mode: ThemeMode;
  readonly preference: ThemePreference;
  readonly setPreference: (preference: ThemePreference) => void;
  readonly toggleTheme: () => void;
}

const AuraContext = createContext<AuraContextValue | null>(null);

export interface AuraProviderProps extends PropsWithChildren {
  readonly applyTo?: "document" | "scope";
  readonly brand?: AuraBrand;
  readonly className?: string;
  readonly defaultTheme?: ThemePreference;
  readonly onThemeChange?: (preference: ThemePreference, mode: ThemeMode) => void;
  readonly storageKey?: string | null;
  readonly theme?: ThemePreference;
}

const antConfig = (mode: ThemeMode, brand: AuraBrand): AntThemeConfig => {
  const tokens = getThemeTokens(mode, brand);
  const value = (name: `--aura-${string}`): string => {
    const token = tokens[name];
    if (!token) throw new Error(`Missing required Aura token: ${name}`);
    return token;
  };

  return {
    cssVar: { prefix: "pads", key: `${brand}-${mode}` },
    hashed: true,
    algorithm: mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      borderRadius: 10,
      borderRadiusLG: 14,
      controlHeight: 40,
      fontFamily: value("--aura-font-sans"),
      fontSize: 14,
      fontSizeSM: 12,
      fontSizeLG: 16,
      colorPrimary: value("--aura-brand-action"),
      colorPrimaryHover: value("--aura-brand-hover"),
      colorInfo: value("--aura-status-info-content"),
      colorSuccess: value("--aura-status-success-content"),
      colorWarning: value("--aura-status-warning-content"),
      colorError: value("--aura-status-danger-content"),
      colorBgBase: value("--aura-bg-app"),
      colorBgLayout: value("--aura-bg-app"),
      colorBgContainer: value("--aura-bg-surface"),
      colorBgElevated: value("--aura-bg-elevated"),
      colorTextBase: value("--aura-text-primary"),
      colorTextSecondary: value("--aura-text-secondary"),
      colorTextTertiary: value("--aura-text-muted"),
      colorTextDisabled: value("--aura-text-disabled"),
      colorBorder: value("--aura-border-control"),
      colorBorderSecondary: value("--aura-border-subtle"),
      boxShadowSecondary: value("--aura-shadow-lg"),
      lineWidthFocus: 2,
    },
    components: {
      Button: { fontWeight: 620, primaryShadow: "none" },
      Input: { activeShadow: `0 0 0 3px ${value("--aura-focus-halo")}` },
      Modal: {
        contentBg: value("--aura-bg-elevated"),
        headerBg: value("--aura-bg-elevated"),
        titleColor: value("--aura-text-primary"),
      },
      Segmented: {
        trackBg: value("--aura-bg-subtle"),
        itemColor: value("--aura-text-secondary"),
        itemHoverBg: value("--aura-bg-hover"),
        itemSelectedBg: value("--aura-brand-soft"),
        itemSelectedColor: value("--aura-brand-content"),
      },
      Table: {
        headerBg: value("--aura-bg-subtle"),
        rowHoverBg: value("--aura-bg-hover"),
      },
    },
  };
};

export function AuraProvider({
  applyTo = "document",
  brand = "aura",
  children,
  className,
  defaultTheme = "system",
  onThemeChange,
  storageKey = DEFAULT_STORAGE_KEY,
  theme: controlledTheme,
}: AuraProviderProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = useState<ThemePreference>(() => {
    if (!isBrowser || !storageKey) return defaultTheme;
    try {
      const saved = window.localStorage.getItem(storageKey);
      return isThemePreference(saved) ? saved : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  const [systemDark, setSystemDark] = useState(
    () => isBrowser && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const preference = controlledTheme ?? uncontrolledTheme;
  const mode = resolveThemePreference(preference, systemDark);

  useEffect(() => {
    if (!isBrowser) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      const resolved = resolveThemePreference(next, systemDark);
      if (controlledTheme === undefined) setUncontrolledTheme(next);
      if (storageKey && isBrowser) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // A blocked storage API must never prevent a visual preference change.
        }
      }
      onThemeChange?.(next, resolved);
    },
    [controlledTheme, onThemeChange, storageKey, systemDark],
  );

  const toggleTheme = useCallback(
    () => setPreference(mode === "dark" ? "light" : "dark"),
    [mode, setPreference],
  );

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser || applyTo !== "document") return;
    const root = document.documentElement;
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    const previous = {
      brand: root.dataset.auraBrand,
      root: root.dataset.auraRoot,
      theme: root.dataset.auraTheme,
      colorScheme: root.style.colorScheme,
      themeColor: themeColor?.getAttribute("content") ?? null,
    };
    root.dataset.auraRoot = "";
    root.dataset.auraTheme = mode;
    root.dataset.auraBrand = brand;
    root.style.colorScheme = mode;
    themeColor?.setAttribute("content", browserThemeColor(mode));

    return () => {
      if (previous.root === undefined) delete root.dataset.auraRoot;
      else root.dataset.auraRoot = previous.root;
      if (previous.theme === undefined) delete root.dataset.auraTheme;
      else root.dataset.auraTheme = previous.theme;
      if (previous.brand === undefined) delete root.dataset.auraBrand;
      else root.dataset.auraBrand = previous.brand;
      root.style.colorScheme = previous.colorScheme;
      if (themeColor) {
        if (previous.themeColor === null) themeColor.removeAttribute("content");
        else themeColor.setAttribute("content", previous.themeColor);
      }
    };
  }, [applyTo, brand, mode]);

  const context = useMemo<AuraContextValue>(
    () => ({ brand, mode, preference, setPreference, toggleTheme }),
    [brand, mode, preference, setPreference, toggleTheme],
  );
  const content =
    applyTo === "scope" ? (
      <div
        className={cx("aura-root", styles.scope, className)}
        data-aura-brand={brand}
        data-aura-root=""
        data-aura-scope=""
        data-aura-theme={mode}
      >
        {children}
      </div>
    ) : (
      children
    );

  return (
    <AuraContext.Provider value={context}>
      <AntConfigProvider theme={antConfig(mode, brand)}>
        <AntApp>{content}</AntApp>
      </AntConfigProvider>
    </AuraContext.Provider>
  );
}

export const useAura = (): AuraContextValue => {
  const context = useContext(AuraContext);
  if (!context) throw new Error("useAura must be used within AuraProvider.");
  return context;
};

export interface ThemeToggleProps {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly labels?: { readonly dark: string; readonly light: string };
}

export function ThemeToggle({
  className,
  disabled,
  labels = { dark: "Use dark theme", light: "Use light theme" },
}: ThemeToggleProps) {
  const { mode, toggleTheme } = useAura();
  const next = mode === "dark" ? "light" : "dark";
  const Icon = next === "dark" ? Moon : Sun;
  return (
    <button
      aria-label={labels[next]}
      className={cx(styles.themeToggle, className)}
      disabled={disabled}
      type="button"
      onClick={toggleTheme}
    >
      <Icon aria-hidden size={18} />
    </button>
  );
}

export const getAuraThemeScript = ({
  brand = "aura",
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  readonly brand?: AuraBrand;
  readonly defaultTheme?: ThemePreference;
  readonly storageKey?: string | null;
} = {}) => {
  if (!auraBrands.includes(brand)) throw new Error(`Unknown Aura brand: ${brand}`);
  if (!isThemePreference(defaultTheme)) {
    throw new Error(`Unknown Aura theme preference: ${String(defaultTheme)}`);
  }
  const settings = JSON.stringify({ brand, defaultTheme, storageKey })
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  return `(function(){var s=${settings};var p=s.defaultTheme;if(s.storageKey){try{var v=localStorage.getItem(s.storageKey);if(v==='light'||v==='dark'||v==='system')p=v}catch(e){}}try{var d=typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches;var m=p==='system'?(d?'dark':'light'):p;var r=document.documentElement;r.dataset.auraRoot='';r.dataset.auraBrand=s.brand;r.dataset.auraTheme=m;r.style.colorScheme=m}catch(e){}})();`;
};

export function AuraThemeScript(
  props: Parameters<typeof getAuraThemeScript>[0] & { readonly nonce?: string },
): ReactNode {
  const { nonce, ...settings } = props;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: getAuraThemeScript(settings) }}
      nonce={nonce}
    />
  );
}
