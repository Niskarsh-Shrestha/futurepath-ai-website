export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "likert"
  | "rating"
  | "slider"
  | "yes_no";

export interface AssessmentQuestion {
  id: string;
  sectionId: string;
  type: QuestionType;
  label: string;
  description?: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ---- Section 1: Personal Information ----
  { id: "pi-1", sectionId: "personal-info", type: "short_text", label: "What does your child enjoy doing in their free time?", required: true },
  { id: "pi-2", sectionId: "personal-info", type: "dropdown", label: "How many siblings does your child have?", required: false, options: ["None", "1", "2", "3", "4+"] },
  { id: "pi-3", sectionId: "personal-info", type: "single_choice", label: "Where does your child spend most of their time outside school?", required: true, options: ["At home", "Extracurricular activities", "With friends", "Sports/clubs", "Mixed"] },
  { id: "pi-4", sectionId: "personal-info", type: "yes_no", label: "Does your child have any diagnosed learning differences (e.g. ADHD, dyslexia)?", required: false },
  { id: "pi-5", sectionId: "personal-info", type: "short_text", label: "If yes, please briefly describe (optional).", required: false },
  { id: "pi-6", sectionId: "personal-info", type: "likert", label: "How would you rate your child's overall daily routine consistency?", required: true, min: 1, max: 5, minLabel: "Very inconsistent", maxLabel: "Very consistent" },
  { id: "pi-7", sectionId: "personal-info", type: "single_choice", label: "How would you describe your family's household environment?", required: false, options: ["Quiet and structured", "Busy and social", "Mixed", "Flexible/unstructured"] },
  { id: "pi-8", sectionId: "personal-info", type: "long_text", label: "Is there anything else about your child's home or personal life relevant to this assessment?", required: false },

  // ---- Section 2: Personality ----
  { id: "per-1", sectionId: "personality", type: "likert", label: "My child enjoys meeting new people and socializing.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-2", sectionId: "personality", type: "likert", label: "My child is naturally curious and asks a lot of questions.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-3", sectionId: "personality", type: "likert", label: "My child is patient when working through difficult tasks.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-4", sectionId: "personality", type: "likert", label: "My child is comfortable taking risks or trying new things.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-5", sectionId: "personality", type: "likert", label: "My child shows empathy toward others' feelings.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-6", sectionId: "personality", type: "likert", label: "My child prefers to work independently rather than in groups.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-7", sectionId: "personality", type: "likert", label: "My child adapts easily to changes in routine or environment.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-8", sectionId: "personality", type: "likert", label: "My child is confident expressing their own opinions.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-9", sectionId: "personality", type: "likert", label: "My child is organized and keeps track of their belongings/tasks.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
  { id: "per-10", sectionId: "personality", type: "likert", label: "My child stays calm under pressure or when frustrated.", required: true, min: 1, max: 5, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },

  // ---- Section 3: Interests ----
  { id: "int-1", sectionId: "interests", type: "multiple_choice", label: "Which subjects does your child enjoy most at school?", required: true, options: ["Math", "Science", "English/Literacy", "History/Social Studies", "Art", "Music", "Physical Education", "Technology/Computing", "Languages"] },
  { id: "int-2", sectionId: "interests", type: "multiple_choice", label: "What hobbies or activities does your child pursue outside school?", required: true, options: ["Reading", "Drawing/Painting", "Building/Making things", "Video games", "Sports", "Music/Instruments", "Coding", "Outdoor activities", "Writing/Storytelling", "Cooking/Baking"] },
  { id: "int-3", sectionId: "interests", type: "likert", label: "How interested is your child in technology and computers?", required: true, min: 1, max: 5, minLabel: "Not interested", maxLabel: "Very interested" },
  { id: "int-4", sectionId: "interests", type: "likert", label: "How interested is your child in science and how things work?", required: true, min: 1, max: 5, minLabel: "Not interested", maxLabel: "Very interested" },
  { id: "int-5", sectionId: "interests", type: "likert", label: "How interested is your child in art, design, or creative expression?", required: true, min: 1, max: 5, minLabel: "Not interested", maxLabel: "Very interested" },
  { id: "int-6", sectionId: "interests", type: "likert", label: "How interested is your child in business, money, or entrepreneurship?", required: true, min: 1, max: 5, minLabel: "Not interested", maxLabel: "Very interested" },
  { id: "int-7", sectionId: "interests", type: "likert", label: "How interested is your child in sports or physical activity?", required: true, min: 1, max: 5, minLabel: "Not interested", maxLabel: "Very interested" },
  { id: "int-8", sectionId: "interests", type: "yes_no", label: "Does your child regularly participate in a club, team, or extracurricular activity?", required: false },
  { id: "int-9", sectionId: "interests", type: "short_text", label: "If yes, which one(s)?", required: false },

  // ---- Section 4: Academic Strengths ----
  { id: "acad-1", sectionId: "academic", type: "dropdown", label: "What is your child's strongest subject?", required: true, options: ["Math", "Science", "English/Literacy", "History/Social Studies", "Art", "Music", "Physical Education", "Technology/Computing", "Languages"] },
  { id: "acad-2", sectionId: "academic", type: "dropdown", label: "What subject does your child find most challenging?", required: false, options: ["Math", "Science", "English/Literacy", "History/Social Studies", "Art", "Music", "Physical Education", "Technology/Computing", "Languages"] },
  { id: "acad-3", sectionId: "academic", type: "likert", label: "How would you rate your child's math ability?", required: true, min: 1, max: 5, minLabel: "Needs support", maxLabel: "Excellent" },
  { id: "acad-4", sectionId: "academic", type: "likert", label: "How would you rate your child's reading ability?", required: true, min: 1, max: 5, minLabel: "Needs support", maxLabel: "Excellent" },
  { id: "acad-5", sectionId: "academic", type: "likert", label: "How would you rate your child's writing ability?", required: true, min: 1, max: 5, minLabel: "Needs support", maxLabel: "Excellent" },
  { id: "acad-6", sectionId: "academic", type: "likert", label: "How well does your child memorize and recall information?", required: true, min: 1, max: 5, minLabel: "Struggles", maxLabel: "Excellent" },
  { id: "acad-7", sectionId: "academic", type: "likert", label: "How does your child typically perform on tests and exams?", required: true, min: 1, max: 5, minLabel: "Below average", maxLabel: "Excellent" },
  { id: "acad-8", sectionId: "academic", type: "likert", label: "How independently does your child complete homework?", required: true, min: 1, max: 5, minLabel: "Needs constant help", maxLabel: "Fully independent" },
  { id: "acad-9", sectionId: "academic", type: "long_text", label: "Any additional notes on your child's academic performance?", required: false },

  // ---- Section 5: Learning Style ----
  { id: "ls-1", sectionId: "learning-style", type: "single_choice", label: "How does your child learn best?", required: true, options: ["Seeing (visual: diagrams, videos)", "Hearing (auditory: explanations, discussion)", "Reading/writing (text-based)", "Doing (hands-on/kinesthetic)", "Not sure"] },
  { id: "ls-2", sectionId: "learning-style", type: "single_choice", label: "Does your child prefer working alone or in groups?", required: true, options: ["Strongly prefers alone", "Somewhat prefers alone", "No preference", "Somewhat prefers groups", "Strongly prefers groups"] },
  { id: "ls-3", sectionId: "learning-style", type: "single_choice", label: "Does your child prefer structured routines or flexible/open-ended tasks?", required: true, options: ["Strongly prefers structure", "Somewhat prefers structure", "No preference", "Somewhat prefers flexibility", "Strongly prefers flexibility"] },
  { id: "ls-4", sectionId: "learning-style", type: "single_choice", label: "How does your child respond best to feedback?", required: false, options: ["Direct and to the point", "Gentle and encouraging", "Detailed written feedback", "Verbal discussion", "Varies"] },
  { id: "ls-5", sectionId: "learning-style", type: "likert", label: "How long can your child typically focus on a single task?", required: true, min: 1, max: 5, minLabel: "Very short", maxLabel: "Very long" },
  { id: "ls-6", sectionId: "learning-style", type: "yes_no", label: "Does your child learn well through repetition and practice?", required: false },
  { id: "ls-7", sectionId: "learning-style", type: "yes_no", label: "Does your child ask for help when they don't understand something?", required: false },
  { id: "ls-8", sectionId: "learning-style", type: "short_text", label: "What environment helps your child concentrate best (e.g. quiet room, background music)?", required: false },

  // ---- Section 6: Soft Skills ----
  { id: "ss-1", sectionId: "soft-skills", type: "likert", label: "How would you rate your child's communication skills?", required: true, min: 1, max: 5, minLabel: "Needs development", maxLabel: "Excellent" },
  { id: "ss-2", sectionId: "soft-skills", type: "likert", label: "How well does your child work as part of a team?", required: true, min: 1, max: 5, minLabel: "Needs development", maxLabel: "Excellent" },
  { id: "ss-3", sectionId: "soft-skills", type: "likert", label: "How would you rate your child's leadership tendencies?", required: true, min: 1, max: 5, minLabel: "Rarely leads", maxLabel: "Often leads" },
  { id: "ss-4", sectionId: "soft-skills", type: "likert", label: "How well does your child solve problems on their own?", required: true, min: 1, max: 5, minLabel: "Needs guidance", maxLabel: "Very resourceful" },
  { id: "ss-5", sectionId: "soft-skills", type: "likert", label: "How creative is your child in their approach to tasks?", required: true, min: 1, max: 5, minLabel: "Conventional", maxLabel: "Highly creative" },
  { id: "ss-6", sectionId: "soft-skills", type: "likert", label: "How well does your child handle disagreements or conflict?", required: true, min: 1, max: 5, minLabel: "Struggles", maxLabel: "Handles very well" },
  { id: "ss-7", sectionId: "soft-skills", type: "likert", label: "How well does your child manage their time and deadlines?", required: true, min: 1, max: 5, minLabel: "Needs support", maxLabel: "Excellent" },
  { id: "ss-8", sectionId: "soft-skills", type: "likert", label: "How resilient is your child when facing setbacks or failure?", required: true, min: 1, max: 5, minLabel: "Gives up easily", maxLabel: "Very resilient" },
  { id: "ss-9", sectionId: "soft-skills", type: "rating", label: "How comfortable is your child speaking in front of a group?", required: true, min: 1, max: 5 },

  // ---- Section 7: Career Preferences ----
  { id: "cp-1", sectionId: "career-preferences", type: "multiple_choice", label: "Which career fields does your child show curiosity about, if any?", required: false, options: ["Technology/Engineering", "Healthcare/Medicine", "Business/Finance", "Arts/Design/Media", "Science/Research", "Education", "Law/Government", "Sports/Fitness", "Trades/Hands-on work", "Not sure yet"] },
  { id: "cp-2", sectionId: "career-preferences", type: "single_choice", label: "What kind of work environment do you think would suit your child?", required: false, options: ["Office/desk-based", "Outdoors/active", "Hands-on/practical", "Creative studio", "Mix of environments", "Not sure"] },
  { id: "cp-3", sectionId: "career-preferences", type: "slider", label: "How much does your child value doing meaningful/helpful work vs. earning a high income?", required: false, min: 0, max: 100, minLabel: "Meaningful work", maxLabel: "High income" },
  { id: "cp-4", sectionId: "career-preferences", type: "yes_no", label: "Has your child expressed interest in starting their own business someday?", required: false },
  { id: "cp-5", sectionId: "career-preferences", type: "likert", label: "How important is helping others to your child?", required: false, min: 1, max: 5, minLabel: "Not important", maxLabel: "Very important" },
  { id: "cp-6", sectionId: "career-preferences", type: "likert", label: "How important is working with technology to your child?", required: false, min: 1, max: 5, minLabel: "Not important", maxLabel: "Very important" },
  { id: "cp-7", sectionId: "career-preferences", type: "yes_no", label: "Does your child show interest in traveling or working internationally in the future?", required: false },
  { id: "cp-8", sectionId: "career-preferences", type: "single_choice", label: "What level of further study do you expect your child may pursue?", required: false, options: ["Trade/vocational", "Undergraduate degree", "Postgraduate degree", "Not sure yet", "Prefer not to say"] },
  { id: "cp-9", sectionId: "career-preferences", type: "short_text", label: "Has your child ever mentioned a specific dream job? If so, what?", required: false },

  // ---- Section 8: Parent Observations ----
  { id: "po-1", sectionId: "parent-observations", type: "long_text", label: "What do you consider your child's single greatest strength or talent?", required: true },
  { id: "po-2", sectionId: "parent-observations", type: "long_text", label: "What is the biggest challenge your child currently faces (academic, social, or personal)?", required: false },
  { id: "po-3", sectionId: "parent-observations", type: "long_text", label: "Describe a moment you were especially proud of your child.", required: false },
  { id: "po-4", sectionId: "parent-observations", type: "long_text", label: "Do you have any concerns about your child's development or future direction?", required: false },
  { id: "po-5", sectionId: "parent-observations", type: "likert", label: "How confident do you feel about guiding your child's educational choices?", required: true, min: 1, max: 5, minLabel: "Not confident", maxLabel: "Very confident" },
  { id: "po-6", sectionId: "parent-observations", type: "rating", label: "How much additional support do you feel your child currently needs?", required: false, min: 1, max: 5 },
  { id: "po-7", sectionId: "parent-observations", type: "short_text", label: "Are there any activities or resources you'd like recommendations for?", required: false },
  { id: "po-8", sectionId: "parent-observations", type: "long_text", label: "What are your overall hopes or goals for your child's future?", required: false },
  { id: "po-9", sectionId: "parent-observations", type: "long_text", label: "Is there anything else you'd like to share that wasn't covered above?", required: false },
];