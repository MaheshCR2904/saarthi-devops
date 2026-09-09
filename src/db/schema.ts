import mongoose, { Schema, Document, Model } from "mongoose";

// ============================================================
// ENUMS (as string literals for Mongoose enums)
// ============================================================

export const LIFE_STAGES = [
  "stage_1", // 16-18: Stream selection, college targeting
  "stage_2", // 18-22: College, skills, internships
  "stage_3", // 22-26: First job, career path
  "stage_4", // 26-35: Career growth
  "stage_5", // 35-50: Mid-career
  "stage_6", // 50-60: Retirement planning
] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];

export const ROLES = ["user", "mentor", "admin"] as const;
export type UserRole = (typeof ROLES)[number];

export const MOODS = ["great", "good", "okay", "low", "stressed", "anxious"] as const;
export type Mood = (typeof MOODS)[number];

export const EVENT_TYPES = [
  "milestone", "setback", "skill_learned", "job_applied",
  "interview", "promotion", "course_completed", "certification", "other",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

// ============================================================
// USER SCHEMA
// ============================================================

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  age?: number;
  lifeStage: LifeStage;
  role: UserRole;
  interests: string[];
  aptitudeScores: Record<string, number>;
  goals: string[];
  goalRawText?: string;
  parsedGoalTags: { domain: string; location: string; salaryRange: string };
  education?: string;
  stream?: string;
  college?: string;
  cgpa?: number;
  skills: string[];
  experienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  currentSalary?: number;
  targetRole?: string;
  location?: string;
  preferredLocation?: string;
  careerScore: number;
  financeScore: number;
  skillsScore: number;
  wellbeingScore: number;
  overallLifeScore: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckinDate?: string;
  monthlySavings: number;
  monthlyIncome: number;
  emergencyFund: number;
  googleId?: string;
  refreshToken?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String },
    dateOfBirth: { type: String },
    age: { type: Number },
    lifeStage: { type: String, enum: LIFE_STAGES, default: "stage_1" },
    role: { type: String, enum: ROLES, default: "user" },
    interests: { type: [String], default: [] },
    aptitudeScores: { type: Schema.Types.Mixed, default: {} },
    goals: { type: [String], default: [] },
    goalRawText: { type: String },
    parsedGoalTags: {
      type: Schema.Types.Mixed,
      default: { domain: "", location: "", salaryRange: "" },
    },
    education: { type: String },
    stream: { type: String },
    college: { type: String },
    cgpa: { type: Number },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    currentRole: { type: String },
    currentCompany: { type: String },
    currentSalary: { type: Number },
    targetRole: { type: String },
    location: { type: String },
    preferredLocation: { type: String },
    careerScore: { type: Number, default: 50 },
    financeScore: { type: Number, default: 50 },
    skillsScore: { type: Number, default: 50 },
    wellbeingScore: { type: Number, default: 50 },
    overallLifeScore: { type: Number, default: 50 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCheckinDate: { type: String },
    monthlySavings: { type: Number, default: 0 },
    monthlyIncome: { type: Number, default: 0 },
    emergencyFund: { type: Number, default: 0 },
    googleId: { type: String },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.refreshToken;
    return ret;
  },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// ============================================================
// LIFE EVENTS SCHEMA
// ============================================================

export interface ILifeEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: EventType;
  title: string;
  description?: string;
  lifeStage?: LifeStage;
  impactScore: number;
  tags: string[];
  occurredAt: Date;
  createdAt: Date;
}

const LifeEventSchema = new Schema<ILifeEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    eventType: { type: String, enum: EVENT_TYPES, required: true },
    title: { type: String, required: true },
    description: { type: String },
    lifeStage: { type: String, enum: LIFE_STAGES },
    impactScore: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LifeEvent: Model<ILifeEvent> =
  mongoose.models.LifeEvent || mongoose.model<ILifeEvent>("LifeEvent", LifeEventSchema);

// ============================================================
// PREDICTIONS SCHEMA
// ============================================================

export interface IPrediction extends Document {
  userId: mongoose.Types.ObjectId;
  modelType: string;
  inputFeatures: Record<string, any>;
  outputPrediction: Record<string, any>;
  confidenceScore?: number;
  expiresAt?: Date;
  createdAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    modelType: { type: String, required: true },
    inputFeatures: { type: Schema.Types.Mixed, default: {} },
    outputPrediction: { type: Schema.Types.Mixed, required: true },
    confidenceScore: { type: Number },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Prediction: Model<IPrediction> =
  mongoose.models.Prediction || mongoose.model<IPrediction>("Prediction", PredictionSchema);

// ============================================================
// MOOD LOGS SCHEMA
// ============================================================

export interface IMoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  mood: Mood;
  note?: string;
  lifeUpdate?: string;
  wellbeingScore?: number;
  createdAt: Date;
}

const MoodLogSchema = new Schema<IMoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mood: { type: String, enum: MOODS, required: true },
    note: { type: String },
    lifeUpdate: { type: String },
    wellbeingScore: { type: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MoodLog: Model<IMoodLog> =
  mongoose.models.MoodLog || mongoose.model<IMoodLog>("MoodLog", MoodLogSchema);

// ============================================================
// RESUME DATA SCHEMA
// ============================================================

export interface IResumeData extends Document {
  userId: mongoose.Types.ObjectId;
  fullName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  education: Array<{ institution: string; degree: string; year: string; cgpa: string }>;
  experience: Array<{ company: string; role: string; duration: string; description: string }>;
  skills: string[];
  certifications: string[];
  projects: Array<{ name: string; description: string; link: string }>;
  atsScore?: number;
  lastOptimizedRole?: string;
  updatedAt: Date;
}

const ResumeDataSchema = new Schema<IResumeData>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    summary: { type: String },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          year: String,
          cgpa: String,
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
        },
      ],
      default: [],
    },
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    projects: {
      type: [
        {
          name: String,
          description: String,
          link: String,
        },
      ],
      default: [],
    },
    atsScore: { type: Number },
    lastOptimizedRole: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const ResumeData: Model<IResumeData> =
  mongoose.models.ResumeData || mongoose.model<IResumeData>("ResumeData", ResumeDataSchema);

// ============================================================
// INTERVIEW SESSIONS SCHEMA
// ============================================================

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole?: string;
  questions: Array<{ question: string; type: string; category: string }>;
  answers: Array<{ questionIndex: number; answer: string; score: number; feedback: string }>;
  overallScore?: number;
  weakAreas: string[];
  prepPlan: Array<{ area: string; sessionsRecommended: number }>;
  completedAt?: Date;
  createdAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetRole: { type: String },
    questions: {
      type: [
        { question: String, type: String, category: String },
      ],
      default: [],
    },
    answers: {
      type: [
        { questionIndex: Number, answer: String, score: Number, feedback: String },
      ],
      default: [],
    },
    overallScore: { type: Number },
    weakAreas: { type: [String], default: [] },
    prepPlan: {
      type: [
        { area: String, sessionsRecommended: Number },
      ],
      default: [],
    },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const InterviewSession: Model<IInterviewSession> =
  mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);

// ============================================================
// WHAT-IF SCENARIOS SCHEMA
// ============================================================

export interface IWhatIfScenario extends Document {
  userId: mongoose.Types.ObjectId;
  scenarioA: Record<string, any>;
  scenarioB: Record<string, any>;
  resultA: Record<string, any>;
  resultB: Record<string, any>;
  createdAt: Date;
}

const WhatIfScenarioSchema = new Schema<IWhatIfScenario>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    scenarioA: { type: Schema.Types.Mixed, required: true },
    scenarioB: { type: Schema.Types.Mixed, required: true },
    resultA: { type: Schema.Types.Mixed, default: {} },
    resultB: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const WhatIfScenario: Model<IWhatIfScenario> =
  mongoose.models.WhatIfScenario ||
  mongoose.model<IWhatIfScenario>("WhatIfScenario", WhatIfScenarioSchema);

// ============================================================
// COMMUNITY JOURNEYS SCHEMA
// ============================================================

export interface ICommunityJourney extends Document {
  userId: mongoose.Types.ObjectId;
  isPublic: boolean;
  anonymizedName?: string;
  summary?: string;
  milestones: Array<{ age: number; event: string; impact: string }>;
  lifeStageAt?: LifeStage;
  upvotes: number;
  views: number;
  createdAt: Date;
}

const CommunityJourneySchema = new Schema<ICommunityJourney>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isPublic: { type: Boolean, default: false },
    anonymizedName: { type: String },
    summary: { type: String },
    milestones: {
      type: [
        { age: Number, event: String, impact: String },
      ],
      default: [],
    },
    lifeStageAt: { type: String, enum: LIFE_STAGES },
    upvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CommunityJourney: Model<ICommunityJourney> =
  mongoose.models.CommunityJourney ||
  mongoose.model<ICommunityJourney>("CommunityJourney", CommunityJourneySchema);

// ============================================================
// RESOURCES SCHEMA
// ============================================================

export interface IResource extends Document {
  title: string;
  description?: string;
  url?: string;
  type?: string;
  skillTags: string[];
  careerPathTags: string[];
  difficulty?: string;
  durationHours?: number;
  rating: number;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    type: { type: String },
    skillTags: { type: [String], default: [] },
    careerPathTags: { type: [String], default: [] },
    difficulty: { type: String },
    durationHours: { type: Number },
    rating: { type: Number, default: 4.0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

// ============================================================
// AI CONVERSATIONS SCHEMA
// ============================================================

export interface IAiConversation extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  response: string;
  contextType?: string;
  createdAt: Date;
}

const AiConversationSchema = new Schema<IAiConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    contextType: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AiConversation: Model<IAiConversation> =
  mongoose.models.AiConversation ||
  mongoose.model<IAiConversation>("AiConversation", AiConversationSchema);

// ============================================================
// ALERTS SCHEMA
// ============================================================

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

// ============================================================
// MENTOR SESSIONS SCHEMA
// ============================================================

export interface IMentorSession extends Document {
  menteeId: mongoose.Types.ObjectId;
  mentorId?: mongoose.Types.ObjectId;
  agenda?: string;
  notes?: string;
  rating?: number;
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const MentorSessionSchema = new Schema<IMentorSession>(
  {
    menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mentorId: { type: Schema.Types.ObjectId, ref: "User" },
    agenda: { type: String },
    notes: { type: String },
    rating: { type: Number },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MentorSession: Model<IMentorSession> =
  mongoose.models.MentorSession ||
  mongoose.model<IMentorSession>("MentorSession", MentorSessionSchema);

// ============================================================
// TYPE EXPORTS (for backward compatibility with existing code)
// ============================================================

export type UserDocument = IUser;
export type NewUser = {
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth?: string;
  age?: number;
  lifeStage?: LifeStage;
};
export type LifeEventDocument = ILifeEvent;
export type NewLifeEvent = {
  userId: string;
  eventType: EventType;
  title: string;
  description?: string;
  lifeStage?: LifeStage;
  impactScore?: number;
  tags?: string[];
  occurredAt: Date;
};
export type PredictionDocument = IPrediction;
export type MoodLogDocument = IMoodLog;
export type ResumeDataRow = IResumeData;
export type InterviewSessionDocument = IInterviewSession;
export type WhatIfScenarioDocument = IWhatIfScenario;
export type CommunityJourneyDocument = ICommunityJourney;
export type ResourceDocument = IResource;
export type AiConversationDocument = IAiConversation;
export type AlertDocument = IAlert;
export type MentorSessionDocument = IMentorSession;

