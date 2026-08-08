import type { CareerRecord } from "@/lib/careers/career-data";
import { formatSalaryRange } from "@/lib/careers/salary-data";
import { getEducationLevelRank } from "@/lib/careers/career-engine";

export type Difficulty = "Accessible" | "Moderate" | "Challenging" | "Highly Competitive";

export function getDifficulty(career: CareerRecord): Difficulty {
  const eduRank = getEducationLevelRank(career.requiredDegree);
  if (eduRank <= 1) return "Accessible";
  if (eduRank <= 3) return "Moderate";
  if (eduRank === 4) return "Challenging";
  return "Highly Competitive";
}

export function buildReasoning(
  career: CareerRecord,
  matchedSignals: string[],
  childName: string
): string {
  const signalText =
    matchedSignals.length > 0
      ? matchedSignals.join(". ") + "."
      : "This career broadens the range of options worth exploring based on the overall profile.";
  return `${childName}'s profile suggests a good fit for ${career.name}. ${signalText} ${career.description}`;
}

export interface CareerPathStepInput {
  step: number;
  title: string;
  description: string;
  order: number;
}

/**
 * Generates a generic but education-level-appropriate career path template.
 * Not personalized per child — describes the standard route into this
 * career, which is genuinely the same regardless of which child is asking.
 */
export function buildCareerPath(career: CareerRecord): CareerPathStepInput[] {
  const steps: CareerPathStepInput[] = [];
  let stepNum = 1;

  steps.push({
    step: stepNum,
    order: stepNum,
    title: "Build foundational interest",
    description: `Explore ${career.name.toLowerCase()}-related hobbies, subjects, and activities during school years to confirm genuine interest.`,
  });
  stepNum++;

  if (career.requiredDegree !== "Not required") {
    steps.push({
      step: stepNum,
      order: stepNum,
      title: `Complete ${career.requiredDegree}`,
      description: `Pursue relevant coursework and a ${career.requiredDegree.toLowerCase()} in a field related to ${career.name.toLowerCase()}.`,
    });
    stepNum++;
  } else {
    steps.push({
      step: stepNum,
      order: stepNum,
      title: "Gain practical experience",
      description: `Seek apprenticeships, internships, or entry-level opportunities to build hands-on ${career.name.toLowerCase()} experience.`,
    });
    stepNum++;
  }

  steps.push({
    step: stepNum,
    order: stepNum,
    title: "Develop core skills",
    description: `Focus on building: ${career.skills.join(", ")}.`,
  });
  stepNum++;

  steps.push({
    step: stepNum,
    order: stepNum,
    title: "Enter the field",
    description: `Begin in an entry-level role and grow toward more senior ${career.name.toLowerCase()} positions over time.`,
  });

  return steps;
}

export interface SkillGapInput {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: "Low" | "Medium" | "High";
}

/**
 * Compares a career's required skills against the child's AI-identified
 * strengths. A skill mentioned among strengths gets a higher assumed
 * current level; skills not mentioned are flagged as gaps to develop.
 */
export function buildSkillGaps(career: CareerRecord, strengths: string[]): SkillGapInput[] {
  const strengthsLower = strengths.map((s) => s.toLowerCase());

  return career.skills.map((skill) => {
    const isStrength = strengthsLower.some(
      (s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
    );
    const currentLevel = isStrength ? 70 : 35;
    const requiredLevel = 85;
    const gap = requiredLevel - currentLevel;
    const priority: SkillGapInput["priority"] = gap >= 40 ? "High" : gap >= 20 ? "Medium" : "Low";

    return { skill, currentLevel, requiredLevel, priority };
  });
}


export interface AdvantagesAndChallenges {
  advantages: string[];
  challenges: string[];
}

/**
 * Derived entirely from the static CareerRecord — not stored in the DB
 * (see Module 2 note: Advantages/Challenges aren't in the spec's
 * CareerRecommendation field list, so they're computed at render time
 * instead of adding undocumented columns).
 */
export function buildAdvantagesAndChallenges(career: CareerRecord): AdvantagesAndChallenges {
  const advantages: string[] = [];
  const challenges: string[] = [];

  if (career.futureDemand === "High" || career.futureDemand === "Very High") {
    advantages.push(`Strong job market — ${career.futureDemand.toLowerCase()} demand expected in the coming years.`);
  }
  if (career.automationRisk === "Low") {
    advantages.push("Low automation risk — relies on skills that are difficult to replace with technology.");
  }
  if (career.growthRate >= 10) {
    advantages.push(`Fast-growing field, with a projected growth rate of ${career.growthRate}%.`);
  }
  if (career.averageSalary.max >= 120000) {
    advantages.push("Strong long-term earning potential as experience grows.");
  }
  if (career.requiredDegree === "Not required" || career.requiredDegree === "Trade Certification") {
    advantages.push("Accessible entry path that doesn't require a lengthy university degree.");
  }
  if (advantages.length === 0) {
    advantages.push("Offers a stable, well-established career path with predictable day-to-day work.");
  }

  if (career.automationRisk === "High") {
    challenges.push("Higher automation risk — some tasks in this role may be increasingly handled by technology.");
  }
  if (career.futureDemand === "Low") {
    challenges.push("Limited projected demand — competition for roles may be higher.");
  }
  if (career.growthRate < 0) {
    challenges.push("Field is projected to shrink slightly, so opportunities may become more competitive.");
  }
  if (career.requiredDegree === "Doctorate" || career.requiredDegree === "Master's Degree") {
    challenges.push(`Requires significant education investment (${career.requiredDegree}) before entering the field.`);
  }
  if (career.skills.length >= 4) {
    challenges.push("Requires a broad, well-rounded skill set to succeed.");
  }
  if (challenges.length === 0) {
    challenges.push("Like any career, success requires sustained effort and continuous skill development.");
  }

  return { advantages, challenges };
}

export { formatSalaryRange };