export interface User {
  id: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  age?: number;
  bio?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  location?: string;
  city?: string;
  job?: string;
  birthdate?: string;

  // Progress tracking fields
  round1Completed?: boolean;
  isMatchingSurveyCompleted?: boolean;
  round2Completed?: boolean;
  round3Completed?: boolean;
  isMember?: boolean;
  isFullyOnboarded?: boolean;
  isInMatchingPool?: boolean;
  adminStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | string;
  adminRejectionReason?: string;

  // Profile completeness
  photos?: UserPhoto[];
}

export interface UserPhoto {
  url: string;
  category?: 'profile' | 'full_body' | 'lifestyle';
  type?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchScore: number;
  status: 'pending' | 'accepted' | 'rejected' | 'mutual_accept';
  createdAt: string;
  meetingId?: string;
}

export interface LocalizedString {
  en: string;
  vi: string;
}

export interface MatchSuggestion {
  id: string;
  userId: string;
  suggestedId: string;
  score: number;
  confidenceFlag: string;
  status: 'pending' | 'accepted' | 'rejected' | 'accepted_by_owner' | 'accepted_by_target' | 'mutual_accept';
  meetingId: string | null;
  suggestedAt: string;
  suggested?: {
    id: string;
    fullName?: string;
    photos?: UserPhoto[];
  };
  reveal: MatchReveal;
}

export interface MatchReveal {
  hero: {
    firstName: string;
    fullName?: string;
    age: number;
    city: string;
    profession: string;
    identityLabel: LocalizedString;
    profilePicUrl?: string;
    avatarUrl?: string;
    anthemUrl?: string;
    anthemName?: string;
    anthemArtist?: string;
    anthemCoverUrl?: string;
  };
  story: MatchStory;
  facts: MatchFacts;
  fullProfile: MatchFullProfile;
  photos?: UserPhoto[];
}

export interface MatchStory {
  hook?: LocalizedString;
  matchReveal?: LocalizedString;
  whyThisMatch?: LocalizedString;
  personalityEmotionalFit?: LocalizedString;
  lifestyleCompatibility?: LocalizedString;
  relationshipDynamics?: LocalizedString;
  deepInsight?: LocalizedString;
  watchOut?: Array<{ point: string; detail: string }>;
  firstDateQuestions?: Array<{ question: string }>;
  finalPush?: LocalizedString;
}

export interface MatchFacts {
  age: number;
  height: number;
  smoking?: string | null;
  drinking?: string | null;
  children?: string | null;
  intention: string;
  city?: string;
  job?: string;
  mbti?: string;
  attachmentStyle?: string;
  socialEnergy?: number;
  communicationStyle?: string;
  maritalStatus?: string;
  religion?: string;
}

export interface MatchFullProfile {
  bio: string;
  interests: string[];
  education: string;
  workField: string;
  values?: string[];
  about?: {
    bio?: string;
    threeWords?: string[];
  };
  lifestyle?: {
    diet?: string | null;
    fitnessLevel?: number | string;
    petAttitude?: string | null;
  };
  relationship?: {
    communication?: string;
    attachment?: string;
    loveLanguage?: string;
  };
  background?: {
    education?: string;
    culture?: string;
    languages?: string[] | string;
    nationality?: string;
  };
}

// ─── Survey & Onboarding ──────────────────────────────────────────────────

export interface IntakeSurveyData {
  name: string;
  phoneNumber: string;
  gender: string;
  targetGenders: string[];
  birthdate: string;
  location: string;
  education: string;
  workField: string;
  income: string;
  lookingFor: string[];
  source: string[];
}

export interface Round2SurveyData {
  coreValues: string[];
  lifestylePreference: string | number;
  decisionStyle: string;
  ageRange: { from: number; to: number; flexible: boolean } | null;
  introExtro: string | number;
  attachmentStyle: string;
  conflictStyle: string;
  loveLanguage: string[];
  physicalActivity: string | number;
  height: string | number;
  minHeight: string | number;
  activities: string[];
  languages: string[];
  openness: string | number;
  dealbreakers: string;
  bio: string;
}

export interface Round3SurveyData {
  moneyRelation: string;
  lifeStage: string;
  childrenView: string;
  diet: string;
  petPreference: string;
  sharedInterests: string | number;
  religionImportance: string | number;
  spirituality: string | number;
  culturalBg: string;
  nationality: string;
  smoking: string;
  acceptSmoker: string;
  drinking: string;
  acceptDrinking: string;
  maritalStatus: string;
  acceptDivorced: string;
  descriptiveWords: { energy: string; depth: string; values: string };
  anythingElse: string;
  mbti: string;
}

// ─── Meeting & Feedback ───────────────────────────────────────────────────

export type HasMetStatus = 'yes' | 'no' | 'missed';

export interface PartnerRating {
  interestInYou: number;
  appearance: number;
  punctuality: number;
}

export interface SelfRating {
  confidence: number;
  comfortableSharing: number;
  understoodPartner: number;
}

export interface MeetingFeedback {
  hasMet: HasMetStatus;
  durationMinutes?: number;
  overallExperience: string;
  conversationBalance: string;
  partnerRating: PartnerRating;
  selfRating: SelfRating;
  wantsToMeetAgain: boolean;
  hasSecondDatePlan: boolean;
  openFeedback?: string;
}

export type MeetingFeedbackSubmission = MeetingFeedback;

// ─── Payment & Scheduling ──────────────────────────────────────────────────

export interface PaymentPayload {
  userId?: string;
  meetingId?: string;
  amount?: number;
  method?: string;
  useMock?: boolean;
}

export interface AvailabilityDate {
  id: string;
  dayKey: string;
  dateNum: string | number;
  isToday?: boolean;
}

export interface GroupedSlot {
  id: string;
  dateStr: string;
  display: string;
  timeRange: string;
  startHour: number;
  endHour: number;
}

export interface AvailabilityGrid {
  dates: AvailabilityDate[];
  selectedSlots: string[];
}
