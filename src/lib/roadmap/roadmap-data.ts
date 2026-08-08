import type { PhaseTemplate, RoadmapTemplate, RoadmapDifficulty } from "./roadmap-types";
import { resource, milestone, CAREER_TOKEN } from "./resource-library";

// ---- Shared phase builders (used across every category) ----

function foundationPhase(categoryLabel: string, order: number): PhaseTemplate {
  return {
    title: `Foundation: Exploring ${categoryLabel}`,
    description: `Build early awareness of what a ${CAREER_TOKEN} actually does day to day, and confirm genuine interest before investing in deeper study.`,
    order,
    estimatedWeeks: 3,
    resources: [
      resource({
        title: `A Day in the Life of a ${CAREER_TOKEN}`,
        type: "Video",
        provider: "Khan Academy",
        query: `career overview ${categoryLabel.toLowerCase()}`,
        estimatedHours: 2,
      }),
      resource({
        title: `${categoryLabel} Career Fundamentals`,
        type: "Website",
        provider: "Coursera",
        query: `${categoryLabel.toLowerCase()} career fundamentals`,
        estimatedHours: 4,
      }),
      resource({
        title: `Is ${CAREER_TOKEN} Right for You?`,
        type: "Practice Project",
        provider: "Khan Academy",
        query: `self assessment ${categoryLabel.toLowerCase()} career`,
        estimatedHours: 2,
        isOptional: true,
      }),
    ],
    milestones: [
      milestone(
        "Complete a career self-assessment",
        `Reflect on interests and strengths relative to what a ${CAREER_TOKEN} needs day to day.`,
        1
      ),
    ],
  };
}

function practicalProjectPhase(categoryLabel: string, order: number): PhaseTemplate {
  return {
    title: "Hands-On Practice",
    description: `Apply core skills from earlier phases in a real, self-directed project relevant to ${CAREER_TOKEN} work.`,
    order,
    estimatedWeeks: 4,
    resources: [
      resource({
        title: `${categoryLabel} Practice Project`,
        type: "Practice Project",
        provider: "freeCodeCamp",
        query: `${categoryLabel.toLowerCase()} practice project`,
        estimatedHours: 15,
      }),
      resource({
        title: `${categoryLabel} Case Studies`,
        type: "Website",
        provider: "Coursera",
        query: `${categoryLabel.toLowerCase()} case studies`,
        estimatedHours: 5,
        isOptional: true,
      }),
    ],
    milestones: [
      milestone(
        "Finish first independent project",
        `Complete one self-directed project demonstrating core ${categoryLabel.toLowerCase()} skills.`,
        1
      ),
    ],
  };
}

function certificationPhase(categoryLabel: string, order: number, certTitle: string): PhaseTemplate {
  return {
    title: "Credentials & Certification",
    description: `Earn a recognized credential that signals ${CAREER_TOKEN} readiness to employers or further education programs.`,
    order,
    estimatedWeeks: 6,
    resources: [
      resource({
        title: certTitle,
        type: "Certification",
        provider: "Coursera",
        query: certTitle,
        estimatedHours: 30,
        isFree: false,
      }),
      resource({
        title: `${categoryLabel} Certification Prep`,
        type: "Online Course",
        provider: "edX",
        query: `${categoryLabel.toLowerCase()} certification prep`,
        estimatedHours: 12,
        isOptional: true,
      }),
    ],
    milestones: [milestone("Complete certification", `Finish and pass ${certTitle}.`, 1)],
  };
}

function portfolioPhase(categoryLabel: string, order: number, portfolioTitle: string): PhaseTemplate {
  return {
    title: "Build a Portfolio",
    description: `Assemble concrete evidence of ${CAREER_TOKEN} skills — the single most important asset when applying for first roles.`,
    order,
    estimatedWeeks: 5,
    resources: [
      resource({
        title: portfolioTitle,
        type: "Practice Project",
        provider: "freeCodeCamp",
        query: portfolioTitle,
        estimatedHours: 20,
      }),
      resource({
        title: "How to Present Your Work",
        type: "Video",
        provider: "Khan Academy",
        query: `portfolio presentation ${categoryLabel.toLowerCase()}`,
        estimatedHours: 2,
        isOptional: true,
      }),
    ],
    milestones: [milestone("Publish portfolio", `Complete and publish: ${portfolioTitle}.`, 1)],
  };
}

function entryPhase(categoryLabel: string, order: number): PhaseTemplate {
  return {
    title: "Enter the Field",
    description: `Gain first real-world experience and begin the transition into an entry-level ${CAREER_TOKEN} role.`,
    order,
    estimatedWeeks: 8,
    resources: [
      resource({
        title: `Finding Internships in ${categoryLabel}`,
        type: "Website",
        provider: "Coursera",
        query: `internships ${categoryLabel.toLowerCase()}`,
        estimatedHours: 3,
      }),
      resource({
        title: `Resume & Interview Prep for ${CAREER_TOKEN}`,
        type: "Online Course",
        provider: "Udemy",
        query: `resume interview prep ${categoryLabel.toLowerCase()}`,
        estimatedHours: 6,
        isFree: false,
      }),
    ],
    milestones: [
      milestone("Complete an internship or apprenticeship", "Gain supervised real-world experience.", 1),
      milestone("Land first entry-level role", `Secure a first position as a ${CAREER_TOKEN}.`, 2),
    ],
  };
}

// ---- Template assembly helper ----

interface BuildTemplateParams {
  categoryId: string;
  categoryLabel: string;
  description: string;
  estimatedDuration: string;
  difficulty: RoadmapDifficulty;
  coreSkillPhases: PhaseTemplate[]; // category-specific middle phases
  certTitle: string;
  portfolioTitle: string;
}

function buildTemplate(params: BuildTemplateParams): RoadmapTemplate {
  const phases: PhaseTemplate[] = [foundationPhase(params.categoryLabel, 1)];
  let order = 2;
  for (const phase of params.coreSkillPhases) {
    phases.push({ ...phase, order });
    order++;
  }
  phases.push(practicalProjectPhase(params.categoryLabel, order++));
  phases.push(certificationPhase(params.categoryLabel, order++, params.certTitle));
  phases.push(portfolioPhase(params.categoryLabel, order++, params.portfolioTitle));
  phases.push(entryPhase(params.categoryLabel, order++));

  return {
    categoryId: params.categoryId,
    title: `${CAREER_TOKEN} Learning Roadmap`,
    description: params.description,
    estimatedDuration: params.estimatedDuration,
    difficulty: params.difficulty,
    phases,
  };
}

function coreSkillPhase(
  title: string,
  description: string,
  weeks: number,
  resources: PhaseTemplate["resources"],
  milestones: PhaseTemplate["milestones"]
): PhaseTemplate {
  return { title, description, order: 0, estimatedWeeks: weeks, resources, milestones };
}

// ---- 14 category templates ----

export const ROADMAP_TEMPLATES: Record<string, RoadmapTemplate> = {
  technology: buildTemplate({
    categoryId: "technology",
    categoryLabel: "Technology",
    description: `A structured path from programming fundamentals to a first role as a ${CAREER_TOKEN}.`,
    estimatedDuration: "18-24 months",
    difficulty: "Intermediate",
    certTitle: "Professional Certificate in Software Development",
    portfolioTitle: "Build and deploy 3 personal coding projects",
    coreSkillPhases: [
      coreSkillPhase(
        "Programming Fundamentals",
        "Learn a first programming language and core logic/problem-solving skills.",
        6,
        [
          resource({ title: "Python for Everybody", type: "Online Course", provider: "Coursera", query: "python for everybody", estimatedHours: 40, isFree: false }),
          resource({ title: "freeCodeCamp: Scientific Computing with Python", type: "Online Course", provider: "freeCodeCamp", query: "python basics", estimatedHours: 30 }),
          resource({ title: "Codecademy: Learn Python", type: "Online Course", provider: "Codecademy", query: "learn python", estimatedHours: 25, isFree: false },),
        ],
        [milestone("Complete Python basics", "Finish an introductory Python course end-to-end.", 1)]
      ),
      coreSkillPhase(
        "Data Structures & Algorithms",
        "Study the core structures and algorithmic thinking used across all software roles.",
        6,
        [
          resource({ title: "Data Structures and Algorithms", type: "Online Course", provider: "edX", query: "data structures and algorithms", estimatedHours: 35, isFree: false }),
          resource({ title: "freeCodeCamp: Data Structures", type: "Online Course", provider: "freeCodeCamp", query: "data structures algorithms", estimatedHours: 20 }),
        ],
        [milestone("Solve 50 practice problems", "Work through algorithmic practice problems independently.", 1)]
      ),
      coreSkillPhase(
        "Web Development & Git",
        "Learn version control and how to build and ship a working web application.",
        5,
        [
          resource({ title: "Git & GitHub Essentials", type: "Documentation", provider: "MDN", query: "git and github basics", estimatedHours: 6 }),
          resource({ title: "Full Stack Web Development", type: "Online Course", provider: "freeCodeCamp", query: "full stack web development", estimatedHours: 40 }),
          resource({ title: "SQL & Databases Fundamentals", type: "Online Course", provider: "Khan Academy", query: "sql databases fundamentals", estimatedHours: 15 }),
        ],
        [milestone("Deploy first website", "Build and publish a working website.", 1)]
      ),
    ],
  }),

  business: buildTemplate({
    categoryId: "business",
    categoryLabel: "Business",
    description: `A path from business fundamentals to analytical and leadership skills needed as a ${CAREER_TOKEN}.`,
    estimatedDuration: "12-18 months",
    difficulty: "Intermediate",
    certTitle: "Professional Certificate in Business Management",
    portfolioTitle: "Build a business case study portfolio",
    coreSkillPhases: [
      coreSkillPhase(
        "Business Fundamentals",
        "Learn how organizations operate, strategy basics, and core business vocabulary.",
        5,
        [
          resource({ title: "Business Foundations", type: "Online Course", provider: "Coursera", query: "business foundations", estimatedHours: 25, isFree: false }),
          resource({ title: "Khan Academy: Economics Basics", type: "Online Course", provider: "Khan Academy", query: "economics basics", estimatedHours: 15 }),
        ],
        [milestone("Complete a business fundamentals course", "Finish an intro business course end-to-end.", 1)]
      ),
      coreSkillPhase(
        "Data & Analysis Skills",
        "Learn to analyze data and communicate findings clearly to stakeholders.",
        5,
        [
          resource({ title: "Business Analytics with Excel", type: "Online Course", provider: "Coursera", query: "business analytics excel", estimatedHours: 20, isFree: false }),
          resource({ title: "Data Visualization Basics", type: "Online Course", provider: "edX", query: "data visualization basics", estimatedHours: 12 }),
        ],
        [milestone("Complete a data analysis project", "Analyze a real or sample business dataset.", 1)]
      ),
      coreSkillPhase(
        "Communication & Leadership",
        "Build the communication, negotiation, and leadership skills central to business roles.",
        4,
        [
          resource({ title: "Business Communication Skills", type: "Online Course", provider: "Udemy", query: "business communication skills", estimatedHours: 10, isFree: false }),
          resource({ title: "Leadership Fundamentals", type: "Online Course", provider: "Coursera", query: "leadership fundamentals", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Lead a team project", "Take a leadership role in a group or team setting.", 1)]
      ),
    ],
  }),

  healthcare: buildTemplate({
    categoryId: "healthcare",
    categoryLabel: "Healthcare",
    description: `A structured path through science prerequisites, clinical skills, and licensure requirements for a ${CAREER_TOKEN}.`,
    estimatedDuration: "24-48 months",
    difficulty: "Advanced",
    certTitle: "Healthcare Fundamentals Certificate",
    portfolioTitle: "Complete supervised clinical practice hours",
    coreSkillPhases: [
      coreSkillPhase(
        "Science Prerequisites",
        "Build the biology, anatomy, and chemistry foundation required for healthcare study.",
        8,
        [
          resource({ title: "Anatomy & Physiology", type: "Online Course", provider: "Khan Academy", query: "anatomy and physiology", estimatedHours: 30 }),
          resource({ title: "Introduction to Human Biology", type: "Online Course", provider: "edX", query: "introduction to human biology", estimatedHours: 25, isFree: false }),
        ],
        [milestone("Complete anatomy fundamentals", "Finish an anatomy & physiology course.", 1)]
      ),
      coreSkillPhase(
        "Patient Care Skills",
        "Learn the interpersonal and procedural skills used in direct patient care.",
        6,
        [
          resource({ title: "Patient Communication Basics", type: "Online Course", provider: "Coursera", query: "patient communication basics", estimatedHours: 10, isFree: false }),
          resource({ title: "Medical Terminology", type: "Online Course", provider: "edX", query: "medical terminology", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete patient communication training", "Finish a patient-interaction skills course.", 1)]
      ),
      coreSkillPhase(
        "Clinical Training",
        "Gain supervised, hands-on clinical experience under a licensed professional.",
        10,
        [
          resource({ title: "Clinical Skills Lab", type: "Practice Project", provider: "Coursera", query: "clinical skills training", estimatedHours: 40, isFree: false }),
        ],
        [milestone("Complete clinical training hours", "Finish required supervised clinical hours.", 1)]
      ),
    ],
  }),

  engineering: buildTemplate({
    categoryId: "engineering",
    categoryLabel: "Engineering",
    description: `A path from math and physics fundamentals through design and hands-on engineering practice for a ${CAREER_TOKEN}.`,
    estimatedDuration: "24-36 months",
    difficulty: "Advanced",
    certTitle: "Engineering Fundamentals (FE) Prep Certificate",
    portfolioTitle: "Design and document 2 engineering projects",
    coreSkillPhases: [
      coreSkillPhase(
        "Math & Physics Foundations",
        "Build the calculus, physics, and applied math skills underlying all engineering disciplines.",
        8,
        [
          resource({ title: "Calculus", type: "Online Course", provider: "Khan Academy", query: "calculus", estimatedHours: 40 }),
          resource({ title: "Physics: Mechanics", type: "Online Course", provider: "edX", query: "physics mechanics", estimatedHours: 30, isFree: false }),
        ],
        [milestone("Complete calculus fundamentals", "Finish a calculus course.", 1)]
      ),
      coreSkillPhase(
        "Engineering Design Principles",
        "Learn the design and modeling tools used across engineering disciplines.",
        6,
        [
          resource({ title: "Introduction to CAD", type: "Online Course", provider: "Coursera", query: "introduction to cad", estimatedHours: 20, isFree: false }),
          resource({ title: "Engineering Design Process", type: "Documentation", provider: "MDN", query: "engineering design process", estimatedHours: 8 }),
        ],
        [milestone("Complete a CAD design", "Produce a first CAD design or model.", 1)]
      ),
      coreSkillPhase(
        "Hands-On Lab Skills",
        "Build practical, hands-on experience through lab work and prototyping.",
        6,
        [
          resource({ title: "Prototyping Fundamentals", type: "Practice Project", provider: "Udemy", query: "prototyping fundamentals", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Build a working prototype", "Design and build a functioning prototype.", 1)]
      ),
    ],
  }),

  science: buildTemplate({
    categoryId: "science",
    categoryLabel: "Science",
    description: `A research-oriented path from core science fundamentals to lab experience for a ${CAREER_TOKEN}.`,
    estimatedDuration: "36-60 months",
    difficulty: "Advanced",
    certTitle: "Research Methods Certificate",
    portfolioTitle: "Complete an independent research project",
    coreSkillPhases: [
      coreSkillPhase(
        "Core Science Foundations",
        "Build a strong foundation in the specific scientific discipline.",
        8,
        [
          resource({ title: "General Chemistry", type: "Online Course", provider: "Khan Academy", query: "general chemistry", estimatedHours: 30 }),
          resource({ title: "Scientific Method & Research Design", type: "Online Course", provider: "edX", query: "scientific method research design", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete core science coursework", "Finish foundational coursework in the discipline.", 1)]
      ),
      coreSkillPhase(
        "Data Analysis for Research",
        "Learn the statistics and data analysis skills used in scientific research.",
        6,
        [
          resource({ title: "Statistics for Research", type: "Online Course", provider: "Coursera", query: "statistics for research", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete a statistics course", "Finish a statistics-for-research course.", 1)]
      ),
      coreSkillPhase(
        "Laboratory Techniques",
        "Gain hands-on laboratory and field research experience.",
        8,
        [
          resource({ title: "Lab Safety & Techniques", type: "Online Course", provider: "edX", query: "lab safety and techniques", estimatedHours: 10, isFree: false }),
        ],
        [milestone("Complete lab training", "Finish required lab safety and technique training.", 1)]
      ),
    ],
  }),

  education: buildTemplate({
    categoryId: "education",
    categoryLabel: "Education",
    description: `A path from teaching foundations to classroom-ready practice for a ${CAREER_TOKEN}.`,
    estimatedDuration: "18-30 months",
    difficulty: "Intermediate",
    certTitle: "Teaching Certification Prep",
    portfolioTitle: "Complete a supervised teaching practicum",
    coreSkillPhases: [
      coreSkillPhase(
        "Learning & Child Development",
        "Understand how students learn and develop at different ages.",
        6,
        [
          resource({ title: "Child Development Fundamentals", type: "Online Course", provider: "Coursera", query: "child development fundamentals", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete a child development course", "Finish a foundational development course.", 1)]
      ),
      coreSkillPhase(
        "Curriculum & Instruction",
        "Learn to design lessons and curriculum for a subject or age group.",
        6,
        [
          resource({ title: "Instructional Design Basics", type: "Online Course", provider: "edX", query: "instructional design basics", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Design a lesson plan", "Create a complete lesson plan for a topic.", 1)]
      ),
      coreSkillPhase(
        "Classroom Management",
        "Build practical strategies for managing a classroom effectively.",
        5,
        [
          resource({ title: "Classroom Management Strategies", type: "Online Course", provider: "Udemy", query: "classroom management strategies", estimatedHours: 10, isFree: false }),
        ],
        [milestone("Observe an experienced teacher", "Complete classroom observation hours.", 1)]
      ),
    ],
  }),

  creative: buildTemplate({
    categoryId: "creative",
    categoryLabel: "Creative",
    description: `A portfolio-driven path building technical craft and creative skill for a ${CAREER_TOKEN}.`,
    estimatedDuration: "12-24 months",
    difficulty: "Intermediate",
    certTitle: "Creative Portfolio Development Certificate",
    portfolioTitle: "Build a professional creative portfolio",
    coreSkillPhases: [
      coreSkillPhase(
        "Design Fundamentals",
        "Learn the fundamentals of visual design, composition, and creative tools.",
        6,
        [
          resource({ title: "Design Fundamentals", type: "Online Course", provider: "Coursera", query: "design fundamentals", estimatedHours: 20, isFree: false }),
          resource({ title: "Creative Software Basics", type: "Online Course", provider: "Udemy", query: "creative software basics", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete design fundamentals course", "Finish an intro design course.", 1)]
      ),
      coreSkillPhase(
        "Craft-Specific Skills",
        "Develop the specific technical craft skills required for the role.",
        8,
        [
          resource({ title: "Intermediate Craft Techniques", type: "Online Course", provider: "Udemy", query: "intermediate creative technique", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete a craft skill course", "Finish an intermediate skill-building course.", 1)]
      ),
      coreSkillPhase(
        "Creative Business Basics",
        "Learn how to work with clients, pricing, and creative business practice.",
        4,
        [
          resource({ title: "Freelancing for Creatives", type: "Online Course", provider: "Udemy", query: "freelancing for creatives", estimatedHours: 8, isFree: false }),
        ],
        [milestone("Complete a client-style brief", "Respond to a simulated client project brief.", 1)]
      ),
    ],
  }),

  finance: buildTemplate({
    categoryId: "finance",
    categoryLabel: "Finance",
    description: `A quantitative path from financial fundamentals to analytical practice for a ${CAREER_TOKEN}.`,
    estimatedDuration: "18-30 months",
    difficulty: "Advanced",
    certTitle: "Financial Analysis Certificate",
    portfolioTitle: "Build a financial modeling portfolio",
    coreSkillPhases: [
      coreSkillPhase(
        "Finance Fundamentals",
        "Learn core financial concepts, accounting basics, and financial statements.",
        6,
        [
          resource({ title: "Financial Accounting Basics", type: "Online Course", provider: "Coursera", query: "financial accounting basics", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete financial accounting basics", "Finish an intro accounting course.", 1)]
      ),
      coreSkillPhase(
        "Financial Modeling & Excel",
        "Build practical modeling and spreadsheet skills used across finance roles.",
        6,
        [
          resource({ title: "Financial Modeling in Excel", type: "Online Course", provider: "Udemy", query: "financial modeling excel", estimatedHours: 18, isFree: false }),
        ],
        [milestone("Build a financial model", "Complete a working financial model.", 1)]
      ),
      coreSkillPhase(
        "Markets & Risk",
        "Understand financial markets, investment principles, and risk assessment.",
        6,
        [
          resource({ title: "Introduction to Financial Markets", type: "Online Course", provider: "Coursera", query: "introduction to financial markets", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete a markets course", "Finish an intro financial markets course.", 1)]
      ),
    ],
  }),

  law: buildTemplate({
    categoryId: "law",
    categoryLabel: "Law",
    description: `A structured path through legal reasoning, research skills, and practical experience for a ${CAREER_TOKEN}.`,
    estimatedDuration: "36-60 months",
    difficulty: "Advanced",
    certTitle: "Legal Studies Certificate",
    portfolioTitle: "Complete a legal research writing sample",
    coreSkillPhases: [
      coreSkillPhase(
        "Legal Reasoning Foundations",
        "Learn the fundamentals of legal reasoning, argumentation, and the legal system.",
        8,
        [
          resource({ title: "Introduction to Legal Reasoning", type: "Online Course", provider: "edX", query: "introduction to legal reasoning", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete legal reasoning fundamentals", "Finish an intro legal reasoning course.", 1)]
      ),
      coreSkillPhase(
        "Legal Research & Writing",
        "Develop the research and writing skills central to legal work.",
        8,
        [
          resource({ title: "Legal Research Fundamentals", type: "Online Course", provider: "Coursera", query: "legal research fundamentals", estimatedHours: 18, isFree: false }),
        ],
        [milestone("Complete a legal writing sample", "Produce a formal legal writing sample.", 1)]
      ),
      coreSkillPhase(
        "Practical Legal Experience",
        "Gain hands-on exposure through internships, clerkships, or moot court.",
        10,
        [
          resource({ title: "Mock Trial & Moot Court Prep", type: "Practice Project", provider: "edX", query: "mock trial moot court", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Participate in a moot court or internship", "Complete a practical legal experience.", 1)]
      ),
    ],
  }),

  trades: buildTemplate({
    categoryId: "trades",
    categoryLabel: "Trades",
    description: `A hands-on apprenticeship-style path from safety fundamentals to certified trade skill for a ${CAREER_TOKEN}.`,
    estimatedDuration: "18-30 months",
    difficulty: "Intermediate",
    certTitle: "Trade Certification Prep",
    portfolioTitle: "Complete supervised apprenticeship hours",
    coreSkillPhases: [
      coreSkillPhase(
        "Safety & Tool Fundamentals",
        "Learn workplace safety standards and how to use core tools correctly.",
        4,
        [
          resource({ title: "Workplace Safety Fundamentals", type: "Online Course", provider: "Coursera", query: "workplace safety fundamentals", estimatedHours: 8, isFree: false }),
        ],
        [milestone("Complete a safety certification", "Finish a workplace safety course.", 1)]
      ),
      coreSkillPhase(
        "Core Trade Skills",
        "Build the hands-on technical skills specific to the trade.",
        10,
        [
          resource({ title: "Core Trade Skills Training", type: "Online Course", provider: "Udemy", query: "trade skills training", estimatedHours: 25, isFree: false }),
        ],
        [milestone("Complete a hands-on skills assessment", "Pass a practical skills evaluation.", 1)]
      ),
      coreSkillPhase(
        "Apprenticeship Experience",
        "Gain supervised, on-the-job apprenticeship experience.",
        12,
        [
          resource({ title: "Apprenticeship Programs Overview", type: "Website", provider: "Official Documentation", query: "trade apprenticeship programs", estimatedHours: 4 }),
        ],
        [milestone("Complete apprenticeship hours", "Finish required apprenticeship hours.", 1)]
      ),
    ],
  }),

  government: buildTemplate({
    categoryId: "government",
    categoryLabel: "Government",
    description: `A path through public policy fundamentals and civic knowledge required for a ${CAREER_TOKEN}.`,
    estimatedDuration: "18-36 months",
    difficulty: "Intermediate",
    certTitle: "Public Policy Certificate",
    portfolioTitle: "Complete a public policy analysis project",
    coreSkillPhases: [
      coreSkillPhase(
        "Public Policy Foundations",
        "Understand how public policy and government institutions work.",
        6,
        [
          resource({ title: "Introduction to Public Policy", type: "Online Course", provider: "edX", query: "introduction to public policy", estimatedHours: 20, isFree: false }),
        ],
        [milestone("Complete a public policy course", "Finish an intro public policy course.", 1)]
      ),
      coreSkillPhase(
        "Research & Analysis Skills",
        "Build the research and analytical writing skills used in policy and government roles.",
        6,
        [
          resource({ title: "Policy Research Methods", type: "Online Course", provider: "Coursera", query: "policy research methods", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete a policy brief", "Write a formal policy analysis brief.", 1)]
      ),
      coreSkillPhase(
        "Civic & Institutional Knowledge",
        "Study the specific institutions and processes relevant to the role.",
        6,
        [
          resource({ title: "How Government Works", type: "Website", provider: "Official Documentation", query: "how government works", estimatedHours: 5 }),
        ],
        [milestone("Complete a government internship", "Gain experience within a government institution.", 1)]
      ),
    ],
  }),

  sports: buildTemplate({
    categoryId: "sports",
    categoryLabel: "Sports",
    description: `A path combining physical training, sport-specific knowledge, and practical coaching or performance experience for a ${CAREER_TOKEN}.`,
    estimatedDuration: "12-24 months",
    difficulty: "Intermediate",
    certTitle: "Sports Science / Coaching Certification",
    portfolioTitle: "Complete a coaching or training practicum",
    coreSkillPhases: [
      coreSkillPhase(
        "Sports Science Fundamentals",
        "Learn the basics of exercise physiology, training, and nutrition.",
        6,
        [
          resource({ title: "Exercise Physiology Basics", type: "Online Course", provider: "Coursera", query: "exercise physiology basics", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete a sports science course", "Finish an intro sports science course.", 1)]
      ),
      coreSkillPhase(
        "Coaching & Communication",
        "Build the communication and motivational skills used to coach or train others.",
        5,
        [
          resource({ title: "Coaching Fundamentals", type: "Online Course", provider: "Udemy", query: "coaching fundamentals", estimatedHours: 10, isFree: false }),
        ],
        [milestone("Lead a training session", "Plan and lead a practice or training session.", 1)]
      ),
      coreSkillPhase(
        "Practical Field Experience",
        "Gain hands-on experience in a real training, coaching, or competitive setting.",
        8,
        [
          resource({ title: "Sports Practicum Guide", type: "Website", provider: "Official Documentation", query: "sports coaching practicum", estimatedHours: 4 }),
        ],
        [milestone("Complete a practicum placement", "Finish supervised field experience.", 1)]
      ),
    ],
  }),

  hospitality: buildTemplate({
    categoryId: "hospitality",
    categoryLabel: "Hospitality",
    description: `A service-oriented path building customer service, operations, and management skills for a ${CAREER_TOKEN}.`,
    estimatedDuration: "12-24 months",
    difficulty: "Beginner",
    certTitle: "Hospitality Management Certificate",
    portfolioTitle: "Complete a supervised hospitality placement",
    coreSkillPhases: [
      coreSkillPhase(
        "Customer Service Fundamentals",
        "Learn the core customer service and communication skills used across hospitality roles.",
        4,
        [
          resource({ title: "Customer Service Excellence", type: "Online Course", provider: "Coursera", query: "customer service excellence", estimatedHours: 10, isFree: false }),
        ],
        [milestone("Complete a customer service course", "Finish an intro customer service course.", 1)]
      ),
      coreSkillPhase(
        "Operations & Management",
        "Learn the operational and organizational skills used to run hospitality services.",
        6,
        [
          resource({ title: "Hospitality Operations Basics", type: "Online Course", provider: "edX", query: "hospitality operations basics", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete an operations project", "Plan or manage a small hospitality operation.", 1)]
      ),
      coreSkillPhase(
        "On-the-Job Experience",
        "Gain direct, hands-on experience in a hospitality setting.",
        8,
        [
          resource({ title: "Hospitality Industry Placement Guide", type: "Website", provider: "Official Documentation", query: "hospitality industry placement", estimatedHours: 3 }),
        ],
        [milestone("Complete a hospitality placement", "Finish a supervised industry placement.", 1)]
      ),
    ],
  }),

  marketing: buildTemplate({
    categoryId: "marketing",
    categoryLabel: "Marketing",
    description: `A practical path from marketing fundamentals to hands-on campaign experience for a ${CAREER_TOKEN}.`,
    estimatedDuration: "12-18 months",
    difficulty: "Intermediate",
    certTitle: "Digital Marketing Certificate",
    portfolioTitle: "Build a marketing campaign portfolio",
    coreSkillPhases: [
      coreSkillPhase(
        "Marketing Fundamentals",
        "Learn the core principles of marketing strategy and consumer behavior.",
        5,
        [
          resource({ title: "Marketing Fundamentals", type: "Online Course", provider: "Coursera", query: "marketing fundamentals", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Complete a marketing fundamentals course", "Finish an intro marketing course.", 1)]
      ),
      coreSkillPhase(
        "Digital & Analytics Skills",
        "Build practical skills in digital channels, SEO, and marketing analytics.",
        6,
        [
          resource({ title: "Digital Marketing Analytics", type: "Online Course", provider: "edX", query: "digital marketing analytics", estimatedHours: 18, isFree: false }),
        ],
        [milestone("Complete a digital marketing course", "Finish a digital marketing skills course.", 1)]
      ),
      coreSkillPhase(
        "Campaign Experience",
        "Plan, run, and analyze a real or simulated marketing campaign.",
        6,
        [
          resource({ title: "Run a Marketing Campaign", type: "Practice Project", provider: "Udemy", query: "run a marketing campaign", estimatedHours: 15, isFree: false }),
        ],
        [milestone("Launch a marketing campaign", "Plan and execute a complete campaign.", 1)]
      ),
    ],
  }),
};

export function getRoadmapTemplate(categoryId: string): RoadmapTemplate | undefined {
  return ROADMAP_TEMPLATES[categoryId];
}