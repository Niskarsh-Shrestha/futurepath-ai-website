export type FutureDemand = "Low" | "Moderate" | "High" | "Very High";
export type AutomationRisk = "Low" | "Moderate" | "High";

export const DEMAND_DESCRIPTIONS: Record<FutureDemand, string> = {
  Low: "Limited growth expected over the next decade.",
  Moderate: "Steady, stable demand expected over the next decade.",
  High: "Strong growth expected, with more openings than qualified candidates in many regions.",
  "Very High": "Rapid growth expected, among the fastest-growing fields.",
};

export const AUTOMATION_RISK_DESCRIPTIONS: Record<AutomationRisk, string> = {
  Low: "Requires judgment and interpersonal skills that are difficult to automate.",
  Moderate: "Some routine tasks may be automated, but core responsibilities remain human-led.",
  High: "Significant portions of this role may be automated in the coming years.",
};

export function getDemandBadgeVariant(demand: FutureDemand): "subtle" | "warning" | "primary" | "success" {
  switch (demand) {
    case "Low":
      return "subtle";
    case "Moderate":
      return "warning";
    case "High":
      return "primary";
    case "Very High":
      return "success";
  }
}