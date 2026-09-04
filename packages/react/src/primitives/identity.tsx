import type { AuraBrand } from "@praabindh/aura-tokens";
import type { ReactNode } from "react";
import { cx } from "../types.js";
import styles from "./identity.module.css";

const identities = {
  aura: { letter: "A", name: "Aura" },
  verbaura: { letter: "V", name: "VerbAura" },
  cognaura: { letter: "C", name: "CognAura" },
  rendaura: { letter: "R", name: "RendAura" },
  charteraura: { letter: "C", name: "CharterAura" },
  "charteraura-intermediate": { letter: "C", name: "CharterAura Intermediate" },
} satisfies Record<AuraBrand, { readonly letter: string; readonly name: string }>;

export interface ProductMarkProps {
  readonly brand: AuraBrand;
  readonly className?: string;
  readonly decorative?: boolean;
  readonly size?: "sm" | "md" | "lg";
}

export function ProductMark({
  brand,
  className,
  decorative = false,
  size = "md",
}: ProductMarkProps) {
  const identity = identities[brand];
  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : identity.name}
      className={cx(styles.mark, className)}
      data-brand={brand}
      data-size={size}
      role={decorative ? undefined : "img"}
    >
      {identity.letter}
    </span>
  );
}

export interface AvatarProps {
  readonly alt?: string;
  readonly className?: string;
  readonly fallback: ReactNode;
  readonly size?: "sm" | "md" | "lg";
  readonly src?: string;
}

export function Avatar({
  alt = "",
  className,
  fallback,
  size = "md",
  src,
}: AvatarProps) {
  return (
    <span className={cx(styles.avatar, className)} data-size={size}>
      {src ? <img alt={alt} src={src} /> : fallback}
    </span>
  );
}
