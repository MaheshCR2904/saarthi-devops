/**
 * Saarthi ML Engine — Core prediction logic
 * In production, these would call the Python/Flask microservice.
 * For MVP, we implement the logic directly in TypeScript with
 * simple rule-based + statistical models.
 */

// ─── CAREER PATH CLASSIFIER ──────────────────────────────

interface CareerPathInput {
  age: number;
  interests: string[];
  skills: string[];
  cgpa: number;
  stream: string;
  education: string;
  location: string;
  goals: string[];
}

interface CareerPathPrediction {
  path: string;
  probability: number;
  matchReason: string;
  avgStartingSalary: number;
  growthPotential: "high" | "medium" | "stable";
}

const CAREER_PATHS: Record<
  string,
  {
    requiredInterests: string[];
    requiredSkills: string[];
    minCgpa: number;
    preferredStreams: string[];
    avgStartingSalary: number;
    growthPotential: "high" | "medium" | "stable";
  }
> = {
  "Software Engineer": {
    requiredInterests: ["technology", "coding", "problem-solving", "computers"],
    requiredSkills: ["programming", "logic", "algorithms"],
    minCgpa: 6.5,
    preferredStreams: ["Science", "Computer Science"],
    avgStartingSalary: 600000,
    growthPotential: "high",
  },
  "Data Scientist": {
    requiredInterests: ["data", "statistics", "analytics", "research"],
    requiredSkills: ["python", "statistics", "machine learning", "sql"],
    minCgpa: 7.0,
    preferredStreams: ["Science", "Computer Science", "Mathematics"],
    avgStartingSalary: 800000,
    growthPotential: "high",
  },
  "Product Manager": {
    requiredInterests: ["business", "strategy", "leadership", "technology"],
    requiredSkills: ["communication", "analytics", "problem-solving"],
    minCgpa: 6.5,
    preferredStreams: ["Science", "Commerce", "Arts"],
    avgStartingSalary: 700000,
    growthPotential: "high",
  },
  "UX Designer": {
    requiredInterests: ["design", "creativity", "psychology", "technology"],
    requiredSkills: ["design thinking", "wireframing", "user research"],
    minCgpa: 6.0,
    preferredStreams: ["Science", "Arts", "Commerce"],
    avgStartingSalary: 500000,
    growthPotential: "medium",
  },
  "Chartered Accountant": {
    requiredInterests: ["finance", "accounting", "business", "audit"],
    requiredSkills: ["accounting", "financial analysis", "compliance"],
    minCgpa: 6.5,
    preferredStreams: ["Commerce"],
    avgStartingSalary: 500000,
    growthPotential: "stable",
  },
  "Investment Banker": {
    requiredInterests: ["finance", "markets", "analysis", "strategy"],
    requiredSkills: ["financial modeling", "excel", "valuation"],
    minCgpa: 7.5,
    preferredStreams: ["Commerce", "Science"],
    avgStartingSalary: 1200000,
    growthPotential: "high",
  },
  "Marketing Manager": {
    requiredInterests: ["marketing", "creativity", "communication", "strategy"],
    requiredSkills: ["content creation", "analytics", "social media"],
    minCgpa: 6.0,
    preferredStreams: ["Commerce", "Arts", "Science"],
    avgStartingSalary: 450000,
    growthPotential: "medium",
  },
  "Mechanical Engineer": {
    requiredInterests: ["machines", "design", "manufacturing", "physics"],
    requiredSkills: ["cad", "thermodynamics", "mechanics"],
    minCgpa: 6.5,
    preferredStreams: ["Science"],
    avgStartingSalary: 400000,
    growthPotential: "medium",
  },
  "Doctor / Medical Professional": {
    requiredInterests: ["medicine", "biology", "helping people", "science"],
    requiredSkills: ["biology", "chemistry", "empathy", "diagnosis"],
    minCgpa: 8.0,
    preferredStreams: ["Science"],
    avgStartingSalary: 500000,
    growthPotential: "stable",
  },
  "Civil Services": {
    requiredInterests: ["public service", "governance", "leadership", "policy"],
    requiredSkills: ["general knowledge", "writing", "analytical thinking"],
    minCgpa: 6.0,
    preferredStreams: ["Science", "Commerce", "Arts"],
    avgStartingSalary: 450000,
    growthPotential: "stable",
  },
};

export function predictCareerPaths(input: CareerPathInput): CareerPathPrediction[] {
  const predictions: CareerPathPrediction[] = [];

  for (const [pathName, pathData] of Object.entries(CAREER_PATHS)) {
    let score = 0;
    const reasons: string[] = [];

    // Interest match (40% weight)
    const interestOverlap = input.interests.filter((i) =>
      pathData.requiredInterests.some((ri) =>
        i.toLowerCase().includes(ri.toLowerCase()) || ri.toLowerCase().includes(i.toLowerCase())
      )
    ).length;
    const interestScore =
      pathData.requiredInterests.length > 0
        ? (interestOverlap / pathData.requiredInterests.length) * 0.40
        : 0;
    score += interestScore;
    if (interestOverlap > 0) reasons.push(`${interestOverlap} matching interests`);

    // Skill match (35% weight)
    const skillOverlap = input.skills.filter((s) =>
      pathData.requiredSkills.some((rs) =>
        s.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(s.toLowerCase())
      )
    ).length;
    const skillScore =
      pathData.requiredSkills.length > 0
        ? (skillOverlap / pathData.requiredSkills.length) * 0.35
        : 0;
    score += skillScore;
    if (skillOverlap > 0) reasons.push(`${skillOverlap} matching skills`);

    // CGPA match (15% weight)
    const cgpaScore = input.cgpa >= pathData.minCgpa ? 0.15 : (input.cgpa / pathData.minCgpa) * 0.15;
    score += cgpaScore;
    if (input.cgpa >= pathData.minCgpa) reasons.push("CGPA meets requirement");

    // Stream match (10% weight)
    const streamMatch = pathData.preferredStreams.some(
      (s) => s.toLowerCase() === input.stream.toLowerCase()
    );
    score += streamMatch ? 0.10 : 0;
    if (streamMatch) reasons.push("Stream alignment");

    // Normalize to 0-100
    const probability = Math.round(Math.min(score, 1) * 100);

    predictions.push({
      path: pathName,
      probability,
      matchReason: reasons.join(", ") || "General alignment",
      avgStartingSalary: pathData.avgStartingSalary,
      growthPotential: pathData.growthPotential,
    });
  }

  return predictions.sort((a, b) => b.probability - a.probability).slice(0, 3);
}

// ─── SALARY GROWTH PROJECTOR ─────────────────────────────

interface SalaryProjectionInput {
  currentSalary: number;
  careerPath: string;
  experienceYears: number;
  skills: string[];
  location: string;
}

interface SalaryProjection {
  year: number;
  projectedSalary: number;
  confidenceRange: { low: number; high: number };
}

const LOCATION_MULTIPLIERS: Record<string, number> = {
  bangalore: 1.0,
  mumbai: 1.05,
  delhi: 0.95,
  hyderabad: 0.95,
  pune: 0.90,
  chennai: 0.88,
  kolkata: 0.80,
  default: 0.85,
};

const PATH_GROWTH_RATES: Record<string, number> = {
  "Software Engineer": 0.18,
  "Data Scientist": 0.22,
  "Product Manager": 0.20,
  "UX Designer": 0.14,
  "Chartered Accountant": 0.12,
  "Investment Banker": 0.25,
  "Marketing Manager": 0.15,
  "Mechanical Engineer": 0.10,
  "Doctor / Medical Professional": 0.13,
  "Civil Services": 0.08,
};

export function projectSalary(input: SalaryProjectionInput): SalaryProjection[] {
  const locationMultiplier =
    LOCATION_MULTIPLIERS[input.location?.toLowerCase()] || LOCATION_MULTIPLIERS.default;

  const growthRate = PATH_GROWTH_RATES[input.careerPath] || 0.15;
  const skillBonus = Math.min(input.skills.length * 0.005, 0.05); // max 5% bonus

  const adjustedGrowth = growthRate + skillBonus;
  const base = input.currentSalary * locationMultiplier;

  const projections: SalaryProjection[] = [3, 5, 10].map((year) => {
    const projected = base * Math.pow(1 + adjustedGrowth, year);
    const variance = year * 0.08;
    return {
      year,
      projectedSalary: Math.round(projected),
      confidenceRange: {
        low: Math.round(projected * (1 - variance)),
        high: Math.round(projected * (1 + variance)),
      },
    };
  });

  return projections;
}

// ─── GOAL PARSER (NLP) ───────────────────────────────────

interface ParsedGoal {
  domain: string;
  location: string;
  salaryRange: string;
  confidence: number;
}

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  technology: ["software", "coding", "developer", "tech", "it", "programming", "engineering"],
  finance: ["finance", "banking", "investment", "accounting", "ca", "cfa", "money"],
  healthcare: ["doctor", "medical", "healthcare", "medicine", "nurse", "hospital"],
  design: ["design", "ui", "ux", "graphic", "creative", "product design"],
  management: ["manager", "management", "lead", "mba", "business", "strategy"],
  education: ["teacher", "professor", "teaching", "education", "academic", "research"],
  government: ["civil", "ias", "ips", "government", "public", "administration"],
  data: ["data", "analytics", "ai", "ml", "machine learning", "statistics", "scientist"],
};

const LOCATION_KEYWORDS: Record<string, string> = {
  abroad: "abroad",
  foreign: "abroad",
  us: "united_states",
  usa: "united_states",
  uk: "united_kingdom",
  europe: "europe",
  canada: "canada",
  australia: "australia",
  india: "india",
  bangalore: "bangalore",
  mumbai: "mumbai",
  delhi: "delhi",
  hyderabad: "hyderabad",
  pune: "pune",
};

export function parseGoalText(rawText: string): ParsedGoal {
  const text = rawText.toLowerCase();
  let domain = "technology";
  let location = "india";
  let salaryRange = "entry";
  let confidence = 0.5;

  // Domain detection
  let maxDomainScore = 0;
  for (const [dom, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > maxDomainScore) {
      maxDomainScore = score;
      domain = dom;
    }
  }
  if (maxDomainScore > 0) confidence += 0.2;

  // Location detection
  for (const [keyword, loc] of Object.entries(LOCATION_KEYWORDS)) {
    if (text.includes(keyword)) {
      location = loc;
      confidence += 0.15;
      break;
    }
  }

  // Salary range detection
  if (text.includes("high") || text.includes("good") || text.includes("well") || text.includes("lpa 20") || text.includes("lpa 30")) {
    salaryRange = "high";
  } else if (text.includes("decent") || text.includes("moderate") || text.includes("lpa 10") || text.includes("lpa 15")) {
    salaryRange = "mid";
  } else {
    salaryRange = "entry";
  }

  return {
    domain,
    location,
    salaryRange,
    confidence: Math.min(confidence, 1.0),
  };
}

// ─── BURNOUT / WELLBEING DETECTOR ────────────────────────

interface MoodEntry {
  mood: string;
  note: string;
}

const MOOD_VALUES: Record<string, number> = {
  great: 100,
  good: 75,
  okay: 55,
  low: 35,
  stressed: 25,
  anxious: 20,
};

export function analyzeWellbeing(moodLogs: MoodEntry[]): {
  wellbeingScore: number;
  trend: "improving" | "stable" | "declining";
  riskFlag: "none" | "mild" | "moderate" | "concerning";
  insight: string;
} {
  if (moodLogs.length === 0) {
    return {
      wellbeingScore: 50,
      trend: "stable",
      riskFlag: "none",
      insight: "Start logging your mood to get wellbeing insights.",
    };
  }

  // Calculate average mood
  const scores = moodLogs.map((m) => MOOD_VALUES[m.mood] || 50);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Trend: compare last 7 vs previous 7
  const recent = scores.slice(-7);
  const previous = scores.slice(-14, -7);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg =
    previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : recentAvg;
  const trendChange = recentAvg - previousAvg;

  let trend: "improving" | "stable" | "declining" = "stable";
  if (trendChange > 8) trend = "improving";
  else if (trendChange < -8) trend = "declining";

  // Risk flag
  let riskFlag: "none" | "mild" | "moderate" | "concerning" = "none";
  if (avgScore < 30) riskFlag = "concerning";
  else if (avgScore < 45) riskFlag = "moderate";
  else if (avgScore < 55) riskFlag = "mild";

  // Insight
  let insight = "";
  if (trend === "declining") {
    insight =
      "Your mood has been declining recently. This is common — consider talking to someone you trust or taking a short break.";
  } else if (trend === "improving") {
    insight = "You're on an upward trend! Whatever you're doing, it's working.";
  } else if (avgScore > 70) {
    insight = "You're doing well overall. Keep up your daily routines.";
  } else {
    insight = "Your mood has been stable. Consistent check-ins help Saarthi understand you better.";
  }

  return {
    wellbeingScore: Math.round(avgScore),
    trend,
    riskFlag,
    insight,
  };
}

// ─── PEER SIMILARITY SCORER ──────────────────────────────

interface UserProfile {
  age: number;
  stream: string;
  cgpa: number;
  skills: string[];
  interests: string[];
  careerPath: string;
  location: string;
}

export function calculateProfileSimilarity(a: UserProfile, b: UserProfile): number {
  let score = 0;

  // Age proximity (20%)
  const ageDiff = Math.abs(a.age - b.age);
  score += Math.max(0, (10 - ageDiff) / 10) * 0.20;

  // Stream match (20%)
  if (a.stream === b.stream) score += 0.20;

  // CGPA proximity (15%)
  const cgpaDiff = Math.abs(a.cgpa - b.cgpa);
  score += Math.max(0, (5 - cgpaDiff) / 5) * 0.15;

  // Skill overlap (25%)
  const skillOverlap = a.skills.filter((s) => b.skills.includes(s)).length;
  const maxSkills = Math.max(a.skills.length, b.skills.length, 1);
  score += (skillOverlap / maxSkills) * 0.25;

  // Interest overlap (10%)
  const interestOverlap = a.interests.filter((i) => b.interests.includes(i)).length;
  const maxInterests = Math.max(a.interests.length, b.interests.length, 1);
  score += (interestOverlap / maxInterests) * 0.10;

  // Location match (10%)
  if (a.location === b.location) score += 0.10;

  return Math.round(score * 100);
}

// ─── SKILL GAP DETECTOR ──────────────────────────────────

interface SkillGapResult {
  missingSkills: string[];
  matchPercentage: number;
  recommendedResources: { skill: string; resourceType: string; suggestion: string }[];
}

const ROLE_REQUIRED_SKILLS: Record<string, string[]> = {
  "Software Engineer": ["JavaScript", "Python", "Data Structures", "System Design", "Git", "SQL"],
  "Data Scientist": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas"],
  "Product Manager": ["Product Strategy", "Analytics", "User Research", "Roadmapping", "Stakeholder Management"],
  "UX Designer": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
  "Chartered Accountant": ["Accounting Standards", "Taxation", "Audit", "Financial Reporting", "Excel"],
  "Investment Banker": ["Financial Modeling", "Valuation", "Excel", "Pitch Decks", "M&A Knowledge"],
  "Marketing Manager": ["SEO", "Content Strategy", "Analytics", "Social Media", "Campaign Management"],
  "Mechanical Engineer": ["CAD", "Thermodynamics", "Mechanics", "Manufacturing", "MATLAB"],
  "Doctor / Medical Professional": ["Clinical Diagnosis", "Patient Care", "Anatomy", "Pharmacology"],
  "Civil Services": ["General Studies", "Current Affairs", "Essay Writing", "Public Administration", "Ethics"],
};

const RESOURCE_SUGGESTIONS: Record<string, { type: string; suggestion: string }[]> = {
  default: [
    { type: "online_course", suggestion: "Look for courses on Coursera or Udemy" },
    { type: "youtube", suggestion: "Free tutorials available on YouTube" },
    { type: "book", suggestion: "Standard reference books available" },
  ],
  JavaScript: [
    { type: "course", suggestion: "The Odin Project — Full Stack JavaScript" },
    { type: "practice", suggestion: "LeetCode Easy problems in JavaScript" },
  ],
  Python: [
    { type: "course", suggestion: "CS50's Introduction to Python" },
    { type: "practice", suggestion: "HackerRank Python track" },
  ],
  "Machine Learning": [
    { type: "course", suggestion: "Andrew Ng's Machine Learning on Coursera" },
    { type: "project", suggestion: "Kaggle beginner competitions" },
  ],
  "Data Structures": [
    { type: "course", suggestion: "MIT 6.006 Introduction to Algorithms" },
    { type: "practice", suggestion: "Grokking Algorithms book + LeetCode" },
  ],
  SQL: [
    { type: "course", suggestion: "SQL for Data Analysis — freeCodeCamp" },
    { type: "practice", suggestion: "HackerRank SQL track" },
  ],
  "System Design": [
    { type: "course", suggestion: "System Design Interview — Alex Xu" },
    { type: "resource", suggestion: "ByteByteGo newsletter" },
  ],
};

export function detectSkillGap(
  userSkills: string[],
  targetRole: string
): SkillGapResult {
  const required = ROLE_REQUIRED_SKILLS[targetRole] || [];
  if (required.length === 0) {
    return { missingSkills: [], matchPercentage: 100, recommendedResources: [] };
  }

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());
  const missingSkills = required.filter(
    (rs) => !normalizedUserSkills.some((us) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
  );

  const matchPercentage = Math.round(
    ((required.length - missingSkills.length) / required.length) * 100
  );

  const recommendedResources = missingSkills.map((skill) => {
    const resources = RESOURCE_SUGGESTIONS[skill] || RESOURCE_SUGGESTIONS.default;
    return {
      skill,
      resourceType: resources[0].type,
      suggestion: resources[0].suggestion,
    };
  });

  return { missingSkills, matchPercentage, recommendedResources };
}

// ─── WHAT-IF SIMULATOR ───────────────────────────────────

interface WhatIfScenario {
  label: string;
  careerPath: string;
  educationInvestment: number; // in lakhs
  startingSalary: number;
  growthRate: number;
  riskLevel: "low" | "medium" | "high";
}

interface WhatIfResult {
  label: string;
  year5Salary: number;
  year10Salary: number;
  year20Salary: number;
  retirementCorpus: number; // rough estimate
  netWorthAt40: number;
  riskLevel: string;
  verdict: string;
}

export function simulateWhatIf(
  scenarioA: WhatIfScenario,
  scenarioB: WhatIfScenario
): { resultA: WhatIfResult; resultB: WhatIfResult } {
  const simulate = (s: WhatIfScenario): WhatIfResult => {
    const effectiveGrowth = s.riskLevel === "high" ? s.growthRate * 0.7 : s.growthRate;

    const year5 = s.startingSalary * Math.pow(1 + effectiveGrowth, 5);
    const year10 = s.startingSalary * Math.pow(1 + effectiveGrowth, 10);
    const year20 = s.startingSalary * Math.pow(1 + effectiveGrowth * 0.8, 20);
    const retirementCorpus = year20 * 25; // 25x rule
    const netWorthAt40 = year10 * 10 - s.educationInvestment * 100000;

    let verdict = "";
    if (s.riskLevel === "low" && effectiveGrowth > 0.12) {
      verdict = "Stable path with good growth — a solid choice.";
    } else if (s.riskLevel === "high") {
      verdict = "High risk, high reward. Needs resilience and adaptability.";
    } else {
      verdict = "Balanced path — steady growth with manageable risk.";
    }

    return {
      label: s.label,
      year5Salary: Math.round(year5),
      year10Salary: Math.round(year10),
      year20Salary: Math.round(year20),
      retirementCorpus: Math.round(retirementCorpus),
      netWorthAt40: Math.round(netWorthAt40),
      riskLevel: s.riskLevel,
      verdict,
    };
  };

  return {
    resultA: simulate(scenarioA),
    resultB: simulate(scenarioB),
  };
}

// ─── ATS SCORE SIMULATOR ─────────────────────────────────

export function calculateATSScore(resumeData: {
  skills: string[];
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { institution: string; degree: string; year: string; cgpa: string }[];
  certifications: string[];
  targetRole: string;
}): { score: number; feedback: string[]; tips: string[] } {
  let score = 0;
  const feedback: string[] = [];
  const tips: string[] = [];

  // Skills count (30 points)
  const skillScore = Math.min(resumeData.skills.length * 5, 30);
  score += skillScore;
  if (resumeData.skills.length < 5) {
    feedback.push("Skills section is light — add more relevant skills");
    tips.push("List at least 8-10 skills relevant to your target role");
  }

  // Experience (30 points)
  const expScore = Math.min(resumeData.experience.length * 10, 30);
  score += expScore;
  if (resumeData.experience.length === 0) {
    feedback.push("No work experience listed");
    tips.push("Include internships, freelance work, or projects as experience");
  }
  for (const exp of resumeData.experience) {
    if (exp.description.length < 30) {
      feedback.push(`Experience at ${exp.company} needs more detail`);
    }
  }

  // Education (20 points)
  const hasCGPA = resumeData.education.some((e) => e.cgpa && parseFloat(e.cgpa) > 0);
  score += Math.min(resumeData.education.length * 7, 14);
  if (hasCGPA) score += 6;
  if (resumeData.education.length === 0) {
    feedback.push("Education section is missing");
  }

  // Certifications (10 points)
  score += Math.min(resumeData.certifications.length * 3, 10);

  // Keyword optimization (10 points)
  const roleKeywords: Record<string, string[]> = {
    "Software Engineer": ["javascript", "react", "node", "python", "aws", "git", "agile", "api"],
    "Data Scientist": ["python", "sql", "machine learning", "statistics", "tableau", "pandas"],
    "Product Manager": ["roadmap", "stakeholder", "agile", "user stories", "analytics", "kpi"],
  };
  const keywords = roleKeywords[resumeData.targetRole] || [];
  const allText = [
    ...resumeData.skills,
    ...resumeData.experience.flatMap((e) => [e.role, e.description]),
    ...resumeData.certifications,
  ]
    .join(" ")
    .toLowerCase();
  const keywordMatches = keywords.filter((k) => allText.includes(k)).length;
  score += Math.min(keywordMatches * 2, 10);

  // Round and clamp
  const finalScore = Math.min(Math.round(score), 100);

  return { score: finalScore, feedback, tips };
}
