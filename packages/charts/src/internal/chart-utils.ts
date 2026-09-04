import type { ChartDatum, ChartTone, ChartValueFormatter } from "../types.js";

export const defaultTones: readonly ChartTone[] = [
  "brand",
  "info",
  "success",
  "warning",
  "danger",
  "neutral",
];

export function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function percentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function datumKey(datum: ChartDatum, index: number): string {
  return datum.id ?? `${datum.label}-${index}`;
}

export function toneAt(tone: ChartTone | undefined, index: number): ChartTone {
  return tone ?? defaultTones[index % defaultTones.length] ?? "neutral";
}

export function displayValue(
  datum: ChartDatum,
  formatter: ChartValueFormatter,
): string {
  return datum.displayValue ?? formatter(finiteNonNegative(datum.value));
}

export function joinClassNames(
  ...names: ReadonlyArray<string | undefined>
): string | undefined {
  const value = names.filter(Boolean).join(" ");
  return value || undefined;
}
