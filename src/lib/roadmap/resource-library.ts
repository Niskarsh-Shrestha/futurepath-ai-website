import type {
  LearningResourceProvider,
  LearningResourceType,
  ResourceTemplate,
  MilestoneTemplate,
} from "./roadmap-types";

/** Token replaced with the real career title at generation time (Module 3). */
export const CAREER_TOKEN = "{{CAREER}}";

const PROVIDER_SEARCH_BASE: Record<LearningResourceProvider, string> = {
  Coursera: "https://www.coursera.org/search?query=",
  Udemy: "https://www.udemy.com/courses/search/?q=",
  edX: "https://www.edx.org/search?q=",
  "Microsoft Learn": "https://learn.microsoft.com/en-us/search/?terms=",
  "AWS Skill Builder": "https://skillbuilder.aws/search?searchText=",
  "Google Skill Boost": "https://www.cloudskillsboost.google/catalog?keywords=",
  freeCodeCamp: "https://www.freecodecamp.org/news/search/?query=",
  MDN: "https://developer.mozilla.org/en-US/search?q=",
  Codecademy: "https://www.codecademy.com/search?query=",
  "Khan Academy": "https://www.khanacademy.org/search?page_search_query=",
  "Cisco Skills for All": "https://skillsforall.com/search?query=",
  "Oracle Learning": "https://mylearn.oracle.com/ou/search-page?searchText=",
  "Official Documentation": "https://www.google.com/search?q=official+documentation+",
};

function searchUrl(provider: LearningResourceProvider, query: string): string {
  return `${PROVIDER_SEARCH_BASE[provider]}${encodeURIComponent(query)}`;
}

interface ResourceInput {
  title: string;
  type: LearningResourceType;
  provider: LearningResourceProvider;
  /** Search query used to build the URL — usually close to `title`. */
  query: string;
  estimatedHours: number;
  isOptional?: boolean;
  isFree?: boolean;
}

/** Builds a fully-formed ResourceTemplate with a stable search-page URL. */
export function resource(input: ResourceInput): ResourceTemplate {
  return {
    title: input.title,
    type: input.type,
    provider: input.provider,
    url: searchUrl(input.provider, input.query),
    estimatedHours: input.estimatedHours,
    isOptional: input.isOptional ?? false,
    isFree: input.isFree ?? true,
  };
}

export function milestone(title: string, description: string, order: number): MilestoneTemplate {
  return { title, description, order };
}

/**
 * Builds a skill-specific resource from a real CareerRecord skill string
 * (used by roadmap-builder.ts in Module 3 to inject career-specific
 * resources into an otherwise category-level template).
 */
export function skillResource(skill: string, provider: LearningResourceProvider = "Coursera"): ResourceTemplate {
  return resource({
    title: `Introduction to ${skill}`,
    type: "Online Course",
    provider,
    query: skill,
    estimatedHours: 10,
    isFree: false,
  });
}