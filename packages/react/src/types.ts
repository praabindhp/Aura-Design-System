import type { ComponentType, ReactNode } from "react";

export interface AuraIconProps {
  readonly "aria-hidden"?: boolean;
  readonly className?: string;
  readonly size?: number | string;
  readonly strokeWidth?: number;
}

export type AuraIcon = ComponentType<AuraIconProps>;

export interface CommonProps {
  readonly className?: string;
  readonly testId?: string;
}

export type RenderLink = (props: {
  readonly children: ReactNode;
  readonly className: string;
  readonly href: string;
  readonly onClick?: () => void;
}) => ReactNode;

export const cx = (...values: ReadonlyArray<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");
