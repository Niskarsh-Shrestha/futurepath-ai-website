export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export function formatSalaryRange({ min, max, currency }: SalaryRange): string {
  const fmt = (n: number) => `${currency}${(n / 1000).toFixed(0)}k`;
  return `${fmt(min)} - ${fmt(max)}`;
}

export function getSalaryMidpoint(range: SalaryRange): number {
  return Math.round((range.min + range.max) / 2);
}

export type SalaryTier = "Entry" | "Mid" | "High" | "Very High";

export function getSalaryTier(range: SalaryRange): SalaryTier {
  const mid = getSalaryMidpoint(range);
  if (mid < 60000) return "Entry";
  if (mid < 100000) return "Mid";
  if (mid < 150000) return "High";
  return "Very High";
}